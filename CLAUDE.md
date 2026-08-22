# PitchLog — Claude Code 가이드

> 2026 FIFA 월드컵 선수 정보·통계 아카이브
> Repository: https://github.com/donasman/pitchlog
> 운영: https://pitchlog.pages.dev
> 환경: Windows + Git Bash, IntelliJ(백엔드), VS Code(프론트)

---

## 현재 상태 (2026-08-23)

**2026 월드컵 아카이브 완료.** 대회가 2026-07-19 결승(스페인 1-0 아르헨티나)으로 종료되어
실시간 서비스에서 **정적 아카이브**로 전환했다. 상시 가동 백엔드가 없고 평시 비용은 $0.

수집 완료: 48개국 / 104경기 / 선수 1,248명 / 시즌통계 6,532건 / 라인업 5,323건 / 조 순위 48건

다음 단계는 26-27 유럽 리그로의 확장이다. `FEATURE_PLAN.md` 참조.

---

## 아키텍처

```
로컬 PC
 ├─ Docker PostgreSQL (5433)       ← 데이터 보관 (영구)
 └─ Spring Boot (8080, 수동 기동)   ← 배치 수집 + 빌드 시점 API 제공
        │
        │  npm run build — 빌드 시점에 데이터를 HTML 에 구움
        ▼
   frontend/out/  ──wrangler──▶  Cloudflare Pages
```

**핵심 원칙: 배포된 사이트는 런타임에 API 를 호출하지 않는다.**
모든 데이터가 빌드 시점에 정적 HTML 로 구워진다.
예외는 `/admin/*` 로, 배포본에서는 동작하지 않는다(설계상 의도).

Cloudflare 의 Git 자동 빌드는 **반드시 실패한다** — CI 가 `localhost:8080` 에 닿을 수 없기 때문이다.
이는 버그가 아니라 안전장치가 작동하는 것이다. 대시보드에서 자동 배포를 꺼둘 것.

---

## ⚠️ 이 저장소에서 작업할 때

### git 명령을 샌드박스에서 실행하지 말 것

Claude 가 샌드박스(마운트된 폴더)에서 `git status` 등을 실행하면 `.git/index.lock` 이 생기는데,
샌드박스에는 그 파일을 지울 권한이 없어 락이 남고 **사용자의 git 이 통째로 막힌다.**
2026-08-23 에 실제로 발생했다.

- 파일 편집(Write/Edit, python 스크립트)은 문제없다.
- 커밋·스테이징·브랜치 조작은 **사용자에게 명령을 안내**한다.
- 락이 걸렸다면 사용자가 직접: `rm -f .git/index.lock`

### 커밋은 사용자가 한다

Claude 는 워킹트리를 수정하고, 사용자가 브랜치를 파서 커밋·푸시한다.

---

## 프로젝트 구조

```
pitchlog/
├── backend/                   ← Spring Boot 3.2 + Java 21
│   └── src/main/java/com/pitchlog/
│       ├── batch/
│       │   ├── job/           ← SyncWorldCupPlayersJob, SyncFinalSquadJob, SyncMatchResultsJob
│       │   ├── step/          ← Fetch{Countries,Squads,PlayerStats,Matches,Standings,
│       │   │                     Injuries,Coaches,PlayerRatings,Predictions,H2H}Step
│       │   │                     BackfillLineupsStep, FetchWorldCupPlayerStatsStep, SyncFinalSquadStep
│       │   └── dto/           ← ApiFootball* 응답 DTO
│       ├── config/            ← ApiFootballConfig, CorsConfig, SecurityConfig,
│       │                        AdminAuthFilter, JwtUtil, SchedulerConfig, QueryDslConfig
│       ├── domain/
│       │   ├── entity/        ← Country, Player, PlayerSeasonStats, SquadEntry, Match,
│       │   │                     MatchLineupEntry, GroupStanding, PlayerInjury, Coach,
│       │   │                     FixturePrediction, H2HRecord, AdminUser
│       │   ├── repository/
│       │   └── service/       ← Player/Country/Match/Standings/Injury/Coach/Prediction/H2H
│       │                        MatchSchedulerService, AdminAuthService, AdminMatchService
│       └── api/controller/    ← Player, Country, Match, Standings, Injury, Coach,
│                                Prediction, H2H, AdminAuth, AdminMatch, BatchJob
├── frontend/                  ← Next.js 14 App Router (output: export)
│   └── src/
│       ├── app/               ← 라우트는 대부분 컴포넌트 재노출(re-export)만 한다
│       │   ├── squads/ players/ stats/ matches/ standings/ injuries/ admin/
│       │   ├── robots.ts  sitemap.ts
│       ├── components/
│       │   ├── home/          ← HomePage, HomeResultsSection(우승 배너·라운드별 결과)
│       │   ├── layout/        ← ResultsTicker(서버), ThemeToggle
│       │   ├── match/         ← MatchesPage, MatchDetailPage, MatchDetailView,
│       │   │                     PitchFormation, PlayerMarker, PlayerSidebar,
│       │   │                     RadarStatsChart, DateJumpNav(client)
│       │   ├── squad/ player/ standings/ stats/ injuries/ admin/ ui/
│       ├── lib/               ← api.ts, config.ts(API_BASE·SITE_URL), format.ts,
│       │                        round.ts, matchStatus.ts, utils.ts, adminAuth.ts
│       └── types/
├── docker-compose.yml
├── DEPLOY.md                  ← 데이터 수집·빌드·배포 절차 (실행 시 여기부터 볼 것)
├── FEATURE_PLAN.md            ← 기능 완료 현황 + v2 유럽 리그 확장 설계
└── README.md
```

---

## Git 전략

### 브랜치 — GitHub Flow

- `main` 은 항상 배포 가능한 상태
- 모든 작업은 feature 브랜치 → PR → main
- **직접 main 커밋 금지**

| 접두사 | 용도 | 예시 |
|---|---|---|
| `feature/` | 신규 기능 | `feature/team-model` |
| `fix/` | 버그 수정 | `fix/lineup-fixture-range` |
| `chore/` | 설정·의존성·환경 | `chore/node-22-upgrade` |
| `docs/` | 문서 | `docs/deploy-guide` |
| `refactor/` | 리팩토링 | `refactor/static-archive` |
| `test/` | 테스트 | `test/backfill-step` |

### 커밋 — Conventional Commits

```
<type>(<scope>): <한국어 설명>
```

type: `feat` `fix` `chore` `docs` `refactor` `test` `style`
scope 예시: `batch` `api` `frontend` `db` `deploy` `config`

```
feat(frontend): 우승 하이라이트 배너 추가
fix(batch): 수동 경기 fixtureId 대역을 9_000_000+ 로 이동
refactor(frontend): 경기 페이지를 서버 컴포넌트로 전환
chore(deploy): wrangler 직접 업로드 방식으로 전환
```

### PR

- 기능 하나 = PR 하나
- PR 제목도 Conventional Commits 형식
- `Closes #이슈번호` 로 이슈 자동 닫기
- **Cloudflare Pages 체크 실패는 정상이다** — 머지를 막지 않는다

---

## 설계 원칙 — 조용한 실패 금지

이 프로젝트가 두 달간 멈춰 있던 이유는 전부 **"실패했는데 성공이라고 보고해서"** 였다.
새 코드를 쓸 때 이 원칙을 지킬 것.

| 지점 | 예전(잘못) | 현재 |
|---|---|---|
| 배치 | API 키 없이 0건 수집 후 `COMPLETED` | `FetchCountriesStep` 이 예외를 던져 `FAILED` |
| 빌드 | 데이터 없이 placeholder 경로만 생성 후 성공 | `generateStaticParams` 3곳이 throw |
| 프론트 | `.catch(() => {})` 로 장애 은폐 | 폴링 자체를 제거, 실패 시 문구 노출 |
| 캐시 | 석 달 묵은 fetch 응답 재사용 | `prebuild` 로 `.next`/`out` 제거 |

**빈 결과를 정상으로 처리하지 말 것.** 데이터가 없으면 크게 실패해야 한다.

---

## 코드 작성 규칙

### Backend (Java 21)

- 패키지 `com.pitchlog.*`
- Java record, `@NoArgsConstructor(access = PROTECTED)`, 정적 팩토리 메서드
- 외부 API DTO 에 `@JsonIgnoreProperties(ignoreUnknown = true)` 필수
- **서비스에서 외부 API 호출 금지** — 배치·스케줄러 시점에만 허용
- 시간은 UTC 로 저장 (`hibernate.jdbc.time_zone: UTC`)

### Frontend (TypeScript)

- Next.js 14 App Router, `output: 'export'` 호환 코드만
- **기본은 서버 컴포넌트.** `'use client'` 는 실제 상호작용이 필요한 곳에만
  (PitchFormation 의 선수 선택, DateJumpNav 의 스크롤 등)
- `app/` 의 `page.tsx` 는 `components/` 의 실제 구현을 재노출만 한다
- **matchDate 는 UTC 로 파싱할 것** — DB 가 timezone 없이 UTC 를 저장하므로 `Z` 를 붙인다.
  `lib/format.ts` 의 `toKST()` / `formatMatchTime()` / `kstDateKey()` 를 쓸 것
- canonical·OG·sitemap 은 `lib/config.ts` 의 `SITE_URL` 상수를 쓴다. 도메인 하드코딩 금지

---

## 환경변수 · 시크릿

**절대 커밋 금지**
```
backend/src/main/resources/application-local.yml
backend/src/main/resources/application-secret.yml
frontend/.env.local
frontend/.env*.local
```

**API-Football 키 주입** — IntelliJ Run Configuration → Environment variables

```
SPRING_PROFILES_ACTIVE=local;API_FOOTBALL_KEY=<32자 키>
```

Git Bash 의 `export` 는 IntelliJ 프로세스에 적용되지 않는다.
기동 시 아래 로그로 주입 여부를 확인할 수 있다(키 원문은 남지 않는다):

```
[ApiFootballConfig] baseUrl=..., apiKey 길이=32, 값=6f00...0bfe
```

길이 0 = 미주입, 32 아님 = 복사 오류.

**프론트 URL**
- `NEXT_PUBLIC_API_URL` — 빌드 시점 API 주소. 로컬은 `.env.local` 의 `http://localhost:8080`
- `NEXT_PUBLIC_SITE_URL` — canonical 기준 주소. 기본값 `https://pitchlog.pages.dev`

---

## 알려진 함정

### 1. Next.js fetch 캐시가 오래된 응답을 재사용한다
`lib/api.ts` 의 `fetch()` 에 캐시 옵션이 없으면 App Router 기본값 `force-cache` 가 적용되고
응답이 `.next/cache/fetch-cache` 에 **영구 저장**된다. 실제로 석 달 전 응답(2022 카타르 데이터)이
2026 빌드에 섞여 나왔다.
→ **반드시 `npm run build`** 를 쓸 것. `prebuild` 가 `.next`/`out` 을 지운다.
`npx next build` 는 prebuild 를 건너뛴다.
`output: export` 환경이라 `cache: 'no-store'` 는 쓸 수 없다(동적 렌더링으로 전환돼 export 실패).

### 2. 수동 경기 fixtureId 대역
어드민이 만든 경기는 `fixtureId >= 9_000_000` 을 쓴다.
예전 경계값 1,000,000 은 2026 WC 실제 fixture_id(1,489,369~1,591,866)와 겹쳐
`BackfillLineupsStep` 이 104경기를 전부 걸러버렸다.
관련 위치: `MatchRepository.findMaxManualFixtureId()`, `AdminMatchService.createMatch()`,
`BackfillLineupsStep.backfill()`

### 3. MatchSchedulerService 는 항상 Bean 으로 등록된다
`@ConditionalOnProperty` 로 Bean 자체를 없애면 `BackfillLineupsStep` 이 주입받지 못해 앱이 안 뜬다.
`scheduler-enabled` 플래그는 `@Scheduled` 메서드 5개의 진입부에서만 검사한다.

### 4. 배치 API 는 동기 실행이다
`BatchJobController.runJob()` 이 `jobLauncher.run()` 을 그대로 호출한다(커스텀 JobLauncher 없음).
응답 메시지는 `"STARTED"` 지만 **작업이 끝나야 응답이 온다.** curl 이 멈춘 것처럼 보여도 정상.

### 5. 배치 엔드포인트 인증이 갈린다
`AdminAuthFilter` 의 PUBLIC_PATHS 에 따라:
- 인증 불필요: `sync-players`, `sync-players-lite`, `restart-sync-players`, `sync-final-squad`
- **JWT 필요**: `sync-match-results`, `backfill-lineups`, `refresh-player-ratings`, `sync-wc-player-stats`

### 6. API-Football 플랜별 시즌 제한
Free 플랜은 **2022~2024 시즌만** 접근 가능하다.
2026 시즌은 Pro($19/월) 이상이 필요하며, 없으면 `{"errors":{"plan":...}}` 가 온다.

### 7. 도메인
`pitchlog.com` 은 타인(Lessizmo LLC) 소유다. 사용할 수 없다.

---

## 자주 쓰는 명령어

```bash
# DB
docker compose up -d postgres
docker exec pitchlog-postgres psql -U pitchlog -d pitchlog -c "SELECT COUNT(*) FROM matches;"

# 백엔드 (또는 IntelliJ 에서 실행)
cd backend && ./gradlew bootRun --args='--spring.profiles.active=local'

# 프론트 빌드 — npx next build 금지
cd frontend && npm run build

# 배포 (wrangler 최신판은 Node 22 필요 → v3 로 우회 중)
npx wrangler@3 pages deploy out --project-name=pitchlog --branch=main

# git 락이 걸렸을 때
rm -f .git/index.lock
```

배치 실행 순서와 검증 쿼리는 `DEPLOY.md` 참조.

---

## 로드맵

| 단계 | 내용 | 상태 |
|---|---|---|
| 1 | DB 스키마·ERD 설계 | ✅ |
| 2 | Spring Batch 파이프라인 | ✅ |
| 3 | Next.js UI + REST API 연동 | ✅ |
| 4 | 최종 엔트리, SEO, 라인업 UI, 어드민 인증 | ✅ |
| 5 | 배포 (Railway → Cloudflare Pages 정적) | ✅ |
| 6 | 부가 기능 (순위·부상·경고·감독·평점·예측·H2H) | ✅ |
| 7 | 대회 종료 후 정적 아카이브 전환 | ✅ |
| 8 | **26-27 유럽 리그 확장 (v2)** | 계획 |

미구현: 배당(Odds) — `schema.sql` 에 `fixture_odds` 테이블만 있고 엔티티·API·UI 없음.
AdSense 정책상 민감 카테고리라 보류 상태.
