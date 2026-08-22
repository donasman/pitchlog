# PitchLog

2026 FIFA 월드컵 선수 정보·통계 아카이브

**🔗 https://pitchlog.pages.dev**

> 2026 월드컵은 역대 최초 **48개국** 체제로 치러졌다.
> 12개 조 × 4팀 → 조 1·2위와 조 3위 상위 8팀이 32강 토너먼트에 진출.
> 2026-07-19 결승에서 **스페인이 아르헨티나를 1-0으로 꺾고 우승**했다.

## 담긴 데이터

| 항목 | 수량 |
|---|---|
| 참가국 | 48 |
| 경기 | 104 (조별리그 ~ 결승) |
| 선수 | 1,248 |
| 시즌 통계 | 6,532 |
| 선발 라인업 | 5,323 (104경기 전부) |
| 조 순위 | 12개 조 |

제공 화면: 우승 하이라이트 · 토너먼트 브라켓 · 전 경기 결과 · 경기별 선발 포메이션 ·
국가별 스쿼드 · 선수 상세 · 득점/도움/경고 순위 · 조별 순위 · 부상자 명단

## 기술 스택

| 영역 | 기술 |
|---|---|
| 백엔드 | Spring Boot 3.2 · Java 21 · Spring Batch 5 |
| ORM | Spring Data JPA · QueryDSL |
| DB | PostgreSQL 16 (Docker) |
| 프론트엔드 | Next.js 14 App Router · TypeScript |
| 스타일 | Tailwind CSS · shadcn/ui |
| 데이터 출처 | API-Football (v3) |
| 배포 | Cloudflare Pages (정적 업로드) |

## 아키텍처

대회가 종료되어 **상시 가동 백엔드 없는 정적 아카이브**로 운영한다.

```
로컬 PC
 ├─ Docker PostgreSQL (5433)      ← 데이터 보관
 └─ Spring Boot (8080, 수동 기동)  ← 배치 수집 + 빌드 시점 API
        │
        │  next build — 데이터를 HTML 에 구움
        ▼
   frontend/out/  ──wrangler──▶  Cloudflare Pages
```

배포된 사이트는 런타임에 API 를 호출하지 않으므로 서버 비용이 들지 않는다.
데이터 갱신이 필요할 때만 로컬에서 백엔드를 띄워 배치를 돌리고 재빌드한다.

## 로컬 실행

### 사전 요구사항
- Java 21+
- Node.js 20+ (배포 툴 최신판은 22 필요)
- Docker Desktop
- API-Football **Pro 플랜** 키 (Free 는 2022~2024 시즌만 접근 가능)

### 1. 데이터베이스

```bash
docker compose up -d postgres
```

### 2. 백엔드

IntelliJ 에서 `PitchlogApplication` 실행.
Run Configuration → Environment variables:

```
SPRING_PROFILES_ACTIVE=local;API_FOOTBALL_KEY=<32자 키>
```

또는 터미널에서:

```bash
export API_FOOTBALL_KEY=<키>
cd backend && ./gradlew bootRun --args='--spring.profiles.active=local'
```

### 3. 프론트엔드

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
```

### 4. 데이터 수집 / 빌드 / 배포

`DEPLOY.md` 참조.

## 문서

| 파일 | 내용 |
|---|---|
| `CLAUDE.md` | 개발 가이드 — 구조, Git 전략, 코드 규칙, 알려진 함정 |
| `DEPLOY.md` | 데이터 수집·빌드·배포 절차 |
| `FEATURE_PLAN.md` | 기능 완료 현황 및 v2 확장 설계 |

## 다음 단계

26-27 유럽 리그로의 확장을 검토 중이다. 배치 Step 이 리그·시즌을 주입받는 구조라
재사용성이 높지만, `Country → Team` 모델 전환과 정적 export 포기(Edge SSR)가 필요하다.
자세한 내용은 `FEATURE_PLAN.md` 참조.
