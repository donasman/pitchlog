# PitchLog — Claude Code 가이드

> 2026 FIFA 월드컵 선수 정보 통계 웹서비스  
> Repository: https://github.com/donasman/pitchlog  
> 환경: Windows Git Bash

---

## 프로젝트 구조

```
pitchlog/                      ← 모노레포 루트
├── backend/                   ← Spring Boot 3.x + Java 21
│   └── src/main/java/com/pitchlog/
│       ├── batch/
│       │   ├── job/           ← SyncWorldCupPlayersJob, SyncFinalSquadJob
│       │   ├── step/          ← FetchCountriesStep, FetchSquadsStep, FetchPlayerStatsStep, FetchMatchesStep, SyncFinalSquadStep
│       │   └── dto/           ← ApiFootball* 응답 DTO
│       ├── config/            ← SecurityConfig, CorsConfig, AdminAuthFilter, JwtUtil, QueryDslConfig
│       ├── domain/
│       │   ├── entity/        ← Country, Player, PlayerSeasonStats, SquadEntry, Match, MatchLineupEntry, AdminUser
│       │   ├── repository/
│       │   └── service/       ← PlayerService, CountryService, MatchService, AdminAuthService, AdminMatchService
│       └── api/
│           ├── controller/    ← PlayerController, CountryController, MatchController, AdminAuthController, AdminMatchController, BatchJobController
│           └── dto/
├── frontend/                  ← Next.js 14 (App Router)
│   └── src/
│       ├── app/
│       │   ├── squads/        ← 전체 참가국, [country] 국가별 스쿼드
│       │   ├── players/       ← [slug] 선수 상세
│       │   ├── stats/         ← top-scorers, top-assists
│       │   ├── matches/       ← 경기 목록, [fixtureId] 경기 상세
│       │   ├── admin/         ← login, matches 관리 (new, edit)
│       │   ├── robots.ts
│       │   └── sitemap.ts
│       ├── components/
│       │   ├── match/         ← FootballField, PitchFormation, PlayerMarker, PlayerSidebar, BenchList, RadarStatsChart
│       │   └── admin/         ← MatchForm, CountrySearchInput
│       ├── lib/               ← api.ts, adminAuth.ts, utils.ts
│       └── types/             ← index.ts
├── docker-compose.yml
└── README.md
```

---

## Git 전략

### 브랜치 전략 — GitHub Flow

- `main` 브랜치는 항상 배포 가능한 상태를 유지한다
- 모든 작업은 feature 브랜치에서 진행 후 PR → main 머지
- 직접 main 커밋은 절대 금지

### 브랜치 네이밍

| 접두사 | 용도 | 예시 |
|---|---|---|
| `feature/` | 신규 기능 | `feature/batch-fetch-squads` |
| `fix/` | 버그 수정 | `fix/player-upsert-duplicate` |
| `chore/` | 설정, 의존성, 환경 | `chore/railway-env-setup` |
| `docs/` | 문서, README | `docs/api-spec` |
| `refactor/` | 리팩토링 | `refactor/player-service` |

### 커밋 메시지 — Conventional Commits

```
<type>(<scope>): <한국어 또는 영어 설명>
```

**type 목록:**
- `feat` — 신규 기능
- `fix` — 버그 수정
- `chore` — 빌드, 설정, 의존성
- `docs` — 문서
- `refactor` — 기능 변경 없는 코드 개선
- `test` — 테스트 추가/수정
- `style` — 포맷, 세미콜론 등 코드 의미 변경 없는 수정

**scope 예시:** `batch`, `api`, `frontend`, `db`, `deploy`, `config`

**커밋 예시:**
```
feat(batch): FetchCountriesStep 32개국 수집 구현
feat(batch): FetchSquadsStep 청크 5개국씩 처리
fix(api): player_id null 참조 예외 처리
chore(deploy): Railway 환경변수 설정 추가
docs: ERD 다이어그램 업데이트
refactor(domain): Player 엔티티 정적 팩토리 메서드 적용
test(batch): FetchPlayerStatsStep 단위 테스트 추가
```

### PR 전략
- 기능 하나 = PR 하나 원칙
- PR 제목도 Conventional Commits 형식 사용
- `Closes #이슈번호` 로 이슈 자동 닫기

---

## Git 자동화 워크플로우

Claude Code에서 아래 작업을 요청하면 Git Bash 명령어로 실행한다.

### 1. 새 feature 브랜치 시작

```bash
git checkout main
git pull origin main
git checkout -b feature/<브랜치명>
```

### 2. 작업 후 커밋

```bash
git add .
git status
git commit -m "<type>(<scope>): <설명>"
```

### 3. 원격 푸시 및 PR 준비

```bash
git push origin feature/<브랜치명>
```

이후 https://github.com/donasman/pitchlog/compare 에서 PR 생성

### 4. main 머지 후 브랜치 정리

```bash
git checkout main
git pull origin main
git branch -d feature/<브랜치명>
git push origin --delete feature/<브랜치명>
```

### 5. 주차별 릴리즈 태그

```bash
# 주차 완료 시점에 main에서 실행
git tag -a v0.2-wk2 -m "2주차: Spring Batch 파이프라인 완성"
git push origin v0.2-wk2
```

---

## 코드 작성 규칙

### Backend (Java)
- 패키지: `com.pitchlog.*` 준수
- Java record, `@NoArgsConstructor(access = PROTECTED)`, 정적 팩토리 메서드 패턴 사용
- 외부 API DTO에 `@JsonIgnoreProperties(ignoreUnknown = true)` 필수
- 서비스 중 외부 API 호출 절대 금지 (배치 시점에만 허용)

### Frontend (TypeScript)
- Next.js 14 App Router 기준
- Tailwind CSS + shadcn/ui 사용
- 정적 빌드(`output: export`) 호환 코드만 작성

---

## 환경변수 관리 (보안)

절대 커밋 금지 파일:
- `backend/src/main/resources/application-secret.yml`
- `backend/src/main/resources/application-local.yml`
- `frontend/.env.local`
- `frontend/.env*.local`

API-Football API 키는 IntelliJ 환경변수 `API_FOOTBALL_KEY`로 주입 (application-local.yml에서 `${API_FOOTBALL_KEY:}` 참조)
Railway 배포 시에는 Railway 환경변수 패널에 직접 설정

---

## 개발 로드맵 현황

| 주차 | 내용 | 상태 |
|---|---|---|
| 1주차 | DB 스키마/ERD 설계 | ✅ 완료 |
| 2주차 | Spring Batch 파이프라인 구현 (SyncWorldCupPlayersJob, SyncFinalSquadJob, FetchMatchesStep) | ✅ 완료 |
| 3주차 | Next.js 프론트엔드 UI + REST API 연동 (squads, players, stats, matches) | ✅ 완료 |
| 4주차 | 최종 엔트리 동기화, SEO(robots/sitemap), 라인업 UI(PitchFormation), 어드민 인증(JWT), 경기 관리 어드민 | ✅ 완료 |
| 5주차 | Railway + Cloudflare Pages 실배포 | 🔄 진행 중 |

## 5주차 남은 작업

- [ ] Railway 백엔드 배포 (환경변수 설정 포함)
- [ ] Cloudflare Pages 프론트엔드 배포 (`output: export` 정적 빌드)
- [ ] 도메인 pitchlog.com 연결
- [ ] Google AdSense 연동
- [ ] 실 데이터 배치 실행 (API-Football → Railway PostgreSQL)

---

## 자주 쓰는 명령어 참고

```bash
# 현재 브랜치 및 상태 확인
git status
git branch -a

# 변경 이력 확인
git log --oneline --graph --all

# 특정 파일만 스테이징
git add backend/src/...

# 마지막 커밋 메시지 수정 (푸시 전에만)
git commit --amend -m "수정된 메시지"

# 원격 브랜치 목록 최신화
git fetch --prune
```
