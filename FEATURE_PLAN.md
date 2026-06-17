# PitchLog — 미구현 기능 구현 계획

> 기준: API-Football `league=1 / season=2026` 제공 데이터 중 현재 미구현 항목  
> 우선순위: SEO/트래픽 효과 순

---

## 우선순위 요약

| 순위 | 기능 | SEO 가치 | 구현 난이도 | 예상 소요 |
|---|---|---|---|---|
| 1 | 조 순위 (Standings) | ⭐⭐⭐⭐⭐ | 낮음 | 0.5일 |
| 2 | 부상/출전정지 (Injuries) | ⭐⭐⭐⭐ | 낮음 | 0.5일 |
| 3 | 경고 누적 순위 (Top Cards) | ⭐⭐⭐ | 매우 낮음 | 2시간 |
| 4 | 감독 정보 (Coaches) | ⭐⭐⭐ | 낮음 | 0.5일 |
| 5 | 경기별 선수 평점 (Player Ratings) | ⭐⭐⭐ | 중간 | 1일 |
| 6 | 경기 예측 (Predictions) | ⭐⭐⭐ | 중간 | 1일 |
| 7 | 맞대결 히스토리 (Head to Head) | ⭐⭐ | 중간 | 1일 |
| 8 | 배당 (Odds) | ⭐⭐ | 중간 | 1일 |

---

## 1순위 — 조 순위 (Standings)

### SEO 근거
"2026 월드컵 조 순위", "A조 순위", "월드컵 조별 결과" — 대회 기간 중 가장 많이 검색되는 키워드.

### API-Football 엔드포인트
```
GET /standings?league=1&season=2026
```
반환값: 12개 조(A~L), 각 팀별 경기수, 승/무/패, 득점, 실점, 골득실, 승점, 최근폼

### 백엔드 작업

#### 1. Entity — `GroupStanding.java`
```java
// domain/entity/GroupStanding.java
@Entity @Table(name = "group_standings")
@NoArgsConstructor(access = PROTECTED)
public class GroupStanding {
    @Id @GeneratedValue(strategy = IDENTITY)
    private Long id;

    private String groupName;       // "Group A"
    private Integer teamApiId;
    private String teamName;
    private String teamLogo;
    private Integer rank;
    private Integer played;
    private Integer win;
    private Integer draw;
    private Integer lose;
    private Integer goalsFor;
    private Integer goalsAgainst;
    private Integer goalsDiff;
    private Integer points;
    private String form;             // "WWDLW"
    private String description;      // "Promotion - World Cup (Play Offs)"
    private LocalDateTime updatedAt;

    public static GroupStanding create(...) { ... }
    public void update(...) { ... }
}
```

#### 2. Batch Step — `FetchStandingsStep.java`
```
batch/step/FetchStandingsStep.java
```
- `GET /standings?league=1&season=2026` 1회 호출
- 12개 조 × 4팀 = 48개 row Upsert (teamApiId 기준)
- `SyncWorldCupPlayersJob`에 Step 추가

#### 3. Scheduler — `MatchSchedulerService`에 추가
```java
@Scheduled(fixedDelay = 600_000) // 10분마다
public void refreshStandings() { ... }
```
그룹 스테이지(6/11~6/27) 동안 주기적 갱신 필요.

#### 4. API DTO + Controller
```
GET /api/standings                → 전체 12개 조
GET /api/standings?group=A        → 특정 조만
```

### 프론트엔드 작업

#### 새 페이지
```
/standings → 전체 12개 조 순위표
```

#### 컴포넌트
```
src/components/standings/
├── StandingsPage.tsx         ← 12개 조 탭 or 그리드
├── GroupTable.tsx            ← 조별 테이블 (rank, team, P/W/D/L/GD/Pts, form)
└── FormBadge.tsx             ← W/D/L 뱃지 컴포넌트
```

#### sitemap.ts에 추가
```ts
{ url: `${BASE}/standings`, priority: 0.9, changeFrequency: 'daily' }
```

---

## 2순위 — 부상/출전정지 (Injuries)

### SEO 근거
"월드컵 부상 선수 명단", "누가 빠지나", "OO 선수 부상" — 대회 전·중 핫 키워드. 선수 상세 페이지 유입도 증가.

### API-Football 엔드포인트
```
GET /injuries?league=1&season=2026
GET /injuries?fixture=FIXTURE_ID   ← 특정 경기 부상자
```
반환값: 선수명, 팀, 부상 유형(예: "Knee Injury"), 부상 이유, 예상 복귀일

### 백엔드 작업

#### 1. Entity — `PlayerInjury.java`
```java
// domain/entity/PlayerInjury.java
@Entity @Table(name = "player_injuries")
public class PlayerInjury {
    private Integer playerApiId;
    private String playerName;
    private String playerPhoto;
    private Integer teamApiId;
    private String teamName;
    private Integer fixtureId;       // 해당 경기 (null이면 시즌 전체)
    private String injuryType;       // "Knee Injury"
    private String reason;           // "Muscular"
    private LocalDateTime updatedAt;
}
```

#### 2. Batch DTO — `ApiFootballInjuriesResponse.java`

#### 3. Scheduler — 30분마다 갱신 (대회 기간 중)

#### 4. API
```
GET /api/injuries                  → 전체 부상자 목록
GET /api/injuries?team=KOR         → 특정 국가 부상자
```

### 프론트엔드 작업

#### 새 페이지
```
/injuries → 전체 부상자 목록 (국가 필터)
```

#### 선수 상세 페이지 연동
`/players/[slug]`에 부상 뱃지 표시 (해당 선수가 부상 중이면)

---

## 3순위 — 경고 누적 순위 (Top Cards)

### SEO 근거
`/stats/top-scorers`, `/stats/top-assists` 와 나란히 통계 페이지 군 완성. "월드컵 경고 순위"는 중간 수준 검색량.

### API-Football 엔드포인트
```
GET /players/topyellowcards?league=1&season=2026
GET /players/topredcards?league=1&season=2026
```

### 백엔드 작업
별도 엔티티 불필요. `player_season_stats` 테이블의 `yellow_cards`, `red_cards` 컬럼 이미 존재.

```java
// PlayerService에 메서드 추가
List<StatsRankingResponse> getTopYellowCards(int limit);
List<StatsRankingResponse> getTopRedCards(int limit);
```

```
GET /api/players/top-yellowcards?limit=20
GET /api/players/top-redcards?limit=20
```

### 프론트엔드 작업
```
/stats/top-cards → 경고/퇴장 탭 분리
```
기존 `StatsRankingPage.tsx` 재활용, 탭만 추가.

---

## 4순위 — 감독 정보 (Coaches)

### SEO 근거
"OO 감독", "국가대표 감독" 검색 유입. 국가별 스쿼드 페이지 체류시간 향상.

### API-Football 엔드포인트
```
GET /coachs?team=TEAM_API_ID
```
반환값: 이름, 국적, 나이, 생년월일, 사진, 현재 팀, 커리어 히스토리

### 백엔드 작업

#### 1. Entity — `Coach.java`
```java
@Entity @Table(name = "coaches")
public class Coach {
    private Integer teamApiId;
    private String name;
    private String firstName;
    private String lastName;
    private String nationality;
    private LocalDate birthDate;
    private String photo;
    // career는 JSON으로 저장 또는 별도 테이블
    private String careerJson;
    private LocalDateTime updatedAt;
}
```

#### 2. Batch Step — `FetchCoachesStep.java`
48개 팀 × 1req = 48회 호출

#### 3. API
```
GET /api/countries/{code}/coach   → 국가별 감독 정보
```
또는 기존 `SquadResponse`에 `coach` 필드 추가.

### 프론트엔드 작업
`/squads/[country]` 페이지에 감독 카드 섹션 추가.

---

## 5순위 — 경기별 선수 평점 (Player Ratings)

### SEO 근거
"OO 선수 경기 평점", "최고 평점 선수" — 경기 후 검색 폭발. 경기 상세 페이지 체류시간 대폭 향상.

### API-Football 엔드포인트
```
GET /fixtures/players?fixture=FIXTURE_ID
```
반환값: 선수별 평점(0-10), 출전시간, 슛/패스/드리블/태클 등 상세 스탯

### 백엔드 작업

#### 1. `MatchLineupEntry` 엔티티에 필드 추가
```java
private BigDecimal rating;       // 0.00 ~ 10.00
private Integer minutesPlayed;
private Integer shotsTotal;
private Integer shotsOn;
private Integer passesTotal;
private Integer passesAccuracy;
private Integer duelsTotal;
private Integer duelsWon;
```

또는 별도 `FixturePlayerStats` 엔티티.

#### 2. Scheduler — 경기 종료 후 평점 수집 (MatchSchedulerService에 추가)

#### 3. API — `MatchDetailResponse`에 평점 필드 추가

### 프론트엔드 작업
- `MatchDetailPage`에 선수 평점 테이블 추가
- `RadarStatsChart.tsx` 개선 (실제 스탯 데이터 연동)
- 경기 상세의 라인업에 평점 뱃지 표시

---

## 6순위 — 경기 예측 (Predictions)

### SEO 근거
"월드컵 경기 예측", "OO vs OO 승률" — 경기 전날 검색량 폭발. 바이럴 가능성 높음.

### API-Football 엔드포인트
```
GET /predictions?fixture=FIXTURE_ID
```
반환값: 예측 승자, 예상 득점, 홈/무/원정 확률(%), 형태 비교, H2H 요약

### 백엔드 작업

#### 1. Entity — `FixturePrediction.java`
```java
@Entity @Table(name = "fixture_predictions")
public class FixturePrediction {
    private Integer fixtureId;
    private String predictedWinner;   // "home" | "away" | "draw"
    private String winnerName;
    private Integer homeWinPercent;
    private Integer drawPercent;
    private Integer awayWinPercent;
    private String advice;            // "Winner: Brazil"
    private LocalDateTime updatedAt;
}
```

#### 2. Batch — 경기 24시간 전 수집 (또는 FetchMatchesStep에서 함께)

#### 3. API — `MatchDetailResponse`에 `prediction` 필드 추가

### 프론트엔드 작업
경기 상세 페이지에 "경기 예측" 카드 추가. 승/무/패 확률 바 차트.

---

## 7순위 — 맞대결 히스토리 (Head to Head)

### SEO 근거
"OO vs OO 전적", "맞대결 기록" — 경기 전 콘텐츠로 체류시간 향상.

### API-Football 엔드포인트
```
GET /fixtures/headtohead?h2h=TEAM_A_ID-TEAM_B_ID
```
반환값: 역대 맞대결 경기 목록 (날짜, 스코어, 대회명)

### 백엔드 작업
DB 저장 없이 프록시 방식 가능 (배치 시점 캐시).

또는 `Match` 엔티티에 h2h 캐시를 저장하는 방식:
```
GET /api/matches/{fixtureId}/h2h  → 두 팀 맞대결 히스토리 반환
```

### 프론트엔드 작업
경기 상세 페이지에 "맞대결 기록" 섹션 추가 (최근 10경기).

---

## 8순위 — 배당 (Odds)

### 주의사항
⚠️ 도박 관련 콘텐츠는 Google AdSense 정책에서 민감 카테고리.  
표시 시 반드시 면책 조항 필요 ("정보 제공 목적, 도박 권유 아님").

### API-Football 엔드포인트
```
GET /odds?fixture=FIXTURE_ID      → 프리매치 배당 (최근 7일만 제공)
GET /odds/live?fixture=FIXTURE_ID → 라이브 배당
```
반환값: 북메이커별 홈/무/원정 배당

### 백엔드 작업
7일 제한이 있으므로 DB 저장 필수 (경기 1주일 전부터 수집).

```java
// Entity: FixtureOdds
// Scheduler: 경기 7일 전부터 6시간마다 갱신
```

### 프론트엔드 작업
경기 상세 페이지 하단에 "배당 정보" 접이식(accordion) 섹션.

---

## 브랜치 전략 (순서대로)

```
feature/standings           → 1순위
feature/injuries            → 2순위
feature/top-cards           → 3순위
feature/coaches             → 4순위
feature/player-ratings      → 5순위
feature/predictions         → 6순위
feature/headtohead          → 7순위
feature/odds                → 8순위
```

---

## API 요청 수 예산 (Pro 플랜 7,500 req/일)

| 기능 | 배치/수집 빈도 | 일일 req 추정 |
|---|---|---|
| Standings 갱신 | 10분마다 (대회 중) | ~144 |
| Injuries 갱신 | 30분마다 | ~48 |
| Coaches 수집 | 1회성 배치 | 48 |
| Player Ratings | 경기 후 1회 | ~5 (하루 최대) |
| Predictions 수집 | 경기 24h 전 | ~5 |
| H2H 수집 | 경기 배치 시 | ~5 |
| Odds 갱신 | 6시간마다 | ~20 |
| **기존 스케줄러** | 5분/30분 | ~400 |
| **합계** | | **~675 / 7,500** |

여유 충분 — Pro 플랜($19/월)으로 전 기능 커버 가능.
