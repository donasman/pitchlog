# PitchLog 배포 가이드

> 2026-08-23 개정 — 대회 종료에 따라 **정적 아카이브** 구조로 전환했다.
> 상시 가동 백엔드 없이 Cloudflare Pages 정적 호스팅만으로 동작한다.

## 배포 아키텍처

```
로컬 PC
 ├─ Docker PostgreSQL (5433)      ← 데이터 보관
 └─ Spring Boot (8080, 수동 기동)  ← 빌드 시점에만 필요
        │
        │  next build (빌드 시점에 데이터를 HTML에 구움)
        ▼
   frontend/out/  ──wrangler──▶  Cloudflare Pages
```

**핵심:** 배포된 사이트는 런타임에 API를 호출하지 않는다. 모든 데이터가 빌드 시점에 HTML로 구워진다.
(예외: `/admin/*` 는 여전히 API가 필요해 배포본에서는 동작하지 않는다.)

---

## 1. 사전 조건

| 항목 | 값 |
|---|---|
| API-Football | **Pro 플랜 이상** — Free는 2022~2024 시즌만 접근 가능 |
| Java | 21 |
| Node | 18+ |
| Docker | PostgreSQL 16 컨테이너 |

API 키는 IntelliJ Run Configuration 의 Environment variables 에 넣는다:

```
SPRING_PROFILES_ACTIVE=local;API_FOOTBALL_KEY=<32자 키>
```

> Git Bash 의 `export` 는 IntelliJ 프로세스에 적용되지 않는다.
> 기동 시 `[ApiFootballConfig] apiKey 길이=32` 로그로 주입 여부를 확인할 수 있다.

---

## 2. 데이터 수집 (필요할 때만)

```bash
# DB 기동
docker compose up -d postgres

# 백엔드 기동 (IntelliJ 또는)
cd backend && ./gradlew bootRun --args='--spring.profiles.active=local'
```

배치는 **순서대로** 실행한다. `sync-players` 는 선수 1명당 1콜이라 약 40분 걸린다.

```bash
# 1) 전체 파이프라인 — 국가·스쿼드·선수통계·경기·순위·부상·감독·평점·예측·H2H
curl -X POST http://localhost:8080/api/batch/sync-players

# 2) 최종 엔트리
curl -X POST http://localhost:8080/api/batch/sync-final-squad

# 3) 라인업 백필 + WC 통계 (JWT 필요)
TOKEN=$(curl -s -X POST http://localhost:8080/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin1234!"}' \
  | sed -E 's/.*"token":"([^"]+)".*/\1/')

curl -X POST http://localhost:8080/api/batch/sync-match-results \
  -H "Authorization: Bearer $TOKEN"
```

> `runJob` 은 동기 실행이라 curl 이 작업 종료까지 응답하지 않는다. 멈춘 것처럼 보여도 정상이다.

### 수집 결과 검증

```bash
docker exec pitchlog-postgres psql -U pitchlog -d pitchlog -c \
"SELECT (SELECT COUNT(*) FROM countries) AS 국가,
        (SELECT COUNT(*) FROM matches) AS 경기,
        (SELECT COUNT(*) FROM players) AS 선수,
        (SELECT COUNT(*) FROM match_lineup_entries) AS 라인업;"
```

2026 WC 기준 기대값: **국가 48 / 경기 104 / 선수 1,248 / 라인업 5,300 내외**

---

## 3. 빌드

```bash
cd frontend
npm run build      # ⚠️ npx next build 금지
```

**반드시 `npm run build`** 를 쓴다. `prebuild` 스크립트가 `.next` / `out` 을 지워
오래된 fetch 캐시 재사용을 막는다. `npx next build` 는 이 단계를 건너뛰어
석 달 전 응답(2022 카타르 데이터)이 그대로 렌더되는 사고가 실제로 발생했다.

빌드 로그에서 경로 개수를 확인한다:

```
● /matches/[fixtureId]   104개 (ID 14xxxxx~15xxxxx)
● /squads/[country]      48개
● /players/[slug]        1,248개
```

`placeholder` 경로가 보이거나 개수가 적으면 데이터가 덜 들어온 것이다.
(`generateStaticParams` 가 빈 데이터에서 예외를 던지므로 대부분 빌드 자체가 실패한다.)

### 로컬 확인

```bash
npx serve out -p 3000
```

---

## 4. Cloudflare Pages 배포

**Git 자동 빌드는 사용하지 않는다.** CI 는 `localhost:8080` 에 접근할 수 없어
빌드가 실패한다. 로컬에서 만든 `out/` 을 직접 업로드한다.

```bash
npx wrangler@3 login          # 최신 wrangler 는 Node 22 필요 → v3 로 우회

cd frontend

# 검증용 (dev 브랜치 작업 확인)
npx wrangler@3 pages deploy out --project-name=pitchlog --branch=dev
# → https://dev.pitchlog.pages.dev

# 운영 반영 (dev → main 머지 후)
npx wrangler@3 pages deploy out --project-name=pitchlog --branch=main
# → https://pitchlog.pages.dev
```

**브랜치 인자를 빼면 현재 git 브랜치 이름으로 배포된다.** 그러면 운영이 아니라
`<브랜치명>.pitchlog.pages.dev` 프리뷰로 올라가므로 `--branch` 를 반드시 명시한다.

배포 이력 확인:

```bash
npx wrangler@3 pages deployment list --project-name=pitchlog
```

Cloudflare 대시보드 → Pages → 프로젝트 → Settings → Builds & deployments 에서
**자동 배포를 꺼두면** 푸시할 때마다 실패 알림이 오지 않는다.

### 환경변수

정적 아카이브는 런타임에 API 를 부르지 않으므로 Pages 대시보드의
`NEXT_PUBLIC_API_URL` 은 더 이상 의미가 없다. 로컬 빌드 시
`frontend/.env.local` 의 `http://localhost:8080` 이 사용된다.

`NEXT_PUBLIC_SITE_URL` 로 canonical/OG/sitemap 기준 주소를 덮어쓸 수 있다.
(기본값 `https://pitchlog.pages.dev` — `frontend/src/lib/config.ts`)

---

## 5. 데이터 갱신 절차 (요약)

```
docker compose up -d postgres
백엔드 기동 → 배치 실행 → DB 검증
cd frontend && npm run build
npx wrangler@3 pages deploy out --project-name=pitchlog --branch=dev    # 검증
# dev.pitchlog.pages.dev 확인 후 dev → main PR 머지
npx wrangler@3 pages deploy out --project-name=pitchlog --branch=main   # 운영
```

브랜치 전략(main / dev / feature)은 `CLAUDE.md` 의 Git 전략 항목 참조.

---

## 6. 도메인

`pitchlog.com` 은 타인(Lessizmo LLC) 소유이므로 사용할 수 없다.
현재 운영 주소는 `https://pitchlog.pages.dev` 이며,
커스텀 도메인을 붙이면 `NEXT_PUBLIC_SITE_URL` 만 바꾸면 된다.

---

## 7. 예상 비용

| 항목 | 비용 |
|---|---|
| Cloudflare Pages | $0 |
| API-Football Pro | 데이터 수집이 필요한 달에만 $19 |
| **평시 합계** | **$0** |
