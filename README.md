# PitchLog

2026 FIFA 월드컵 참가국 선수 정보 및 통계 서비스.

> **2026 월드컵 포맷 변경**
> 역대 최초 **48개국** 체제. 12개 조 × 4팀 → 조별 상위 2팀 + 조 3위 중 8팀 = 32강 토너먼트 진행.

## 기술 스택

| 영역 | 기술 |
|------|------|
| 백엔드 | Spring Boot 3.x · Java 21 · Spring Batch 5.x |
| ORM | Spring Data JPA · QueryDSL |
| DB | Railway PostgreSQL |
| 프론트엔드 | Next.js 14 (App Router) · TypeScript |
| 스타일 | Tailwind CSS · shadcn/ui |
| 프론트 배포 | Cloudflare Pages (정적 빌드) |
| 백엔드 배포 | Railway |

## 로컬 개발 환경 실행

### 1. 사전 요구사항
- Java 21+
- Node.js 20+
- Docker Desktop

### 2. 데이터베이스 실행
```bash
docker-compose up -d
```

### 3. 백엔드 실행 (IntelliJ Community)
1. `backend/` 폴더를 IntelliJ로 열기
2. Gradle 동기화 완료 후 `PitchlogApplication` 실행
3. Run Configuration → Active Profile: `local`

### 4. 프론트엔드 실행 (VS Code)
```bash
cd frontend
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 프로젝트 구조

```
pitchlog/
├── backend/                    # Spring Boot
│   └── src/main/java/com/pitchlog/
│       ├── PitchlogApplication.java
│       ├── config/             # QueryDSL, WebClient 설정
│       ├── domain/
│       │   ├── entity/         # JPA 엔티티 4개
│       │   ├── repository/     # Spring Data JPA
│       │   └── service/        # 비즈니스 로직
│       ├── batch/
│       │   ├── job/            # SyncWorldCupPlayersJob
│       │   ├── step/           # FetchCountries/Squads/PlayerStats
│       │   └── dto/            # 외부 API 응답 DTO
│       └── api/
│           ├── controller/     # REST API
│           └── dto/            # 응답 DTO (record)
├── frontend/                   # Next.js 14
│   └── src/
│       ├── app/                # App Router 페이지
│       ├── components/         # UI 컴포넌트
│       ├── lib/                # API 클라이언트, 유틸
│       └── types/              # TypeScript 타입
├── docker-compose.yml
└── README.md
```

## DB 스키마

- `countries` — 참가국 마스터 (Upsert 기준: `code`)
- `players` — 선수 마스터 (Upsert 기준: `api_player_id`)
- `player_season_stats` — 시즌/리그별 통계 (복합 UNIQUE)
- `squad_entries` — 월드컵 최종 엔트리

## 개발 로드맵

- [x] 1주차: DB 스키마/ERD 설계
- [ ] 2주차: Spring Batch 파이프라인 구현
- [ ] 3주차: Next.js UI 개발 및 REST API 연동
- [ ] 4주차: 최종 엔트리 동기화, 데이터 정제 및 테스트
- [ ] 5주차: Railway + Cloudflare Pages 배포
