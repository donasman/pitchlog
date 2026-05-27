package com.pitchlog.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * API-Football fixture ID (배치 수집 시 설정).
     * 수동 입력 경기는 null로 저장 후 DB id 값으로 자동 할당.
     */
    @Column(name = "fixture_id", unique = true)
    private Integer fixtureId;

    /** "Group Stage - 1", "Round of 16", "Quarter-finals" 등 */
    @Column(name = "round", length = 100)
    private String round;

    @Column(name = "match_date")
    private LocalDateTime matchDate;

    @Column(name = "venue_name", length = 100)
    private String venueName;

    @Column(name = "venue_city", length = 100)
    private String venueCity;

    /** NS / 1H / HT / 2H / ET / PEN / FT / AET / AWD / WO */
    @Column(name = "status_short", length = 10)
    private String statusShort;

    @Column(name = "status_long", length = 50)
    private String statusLong;

    @Column(name = "elapsed")
    private Integer elapsed;

    // ── Home team ────────────────────────────────────────────────────────────
    @Column(name = "home_team_api_id")
    private Integer homeTeamApiId;

    @Column(name = "home_team_name", length = 100)
    private String homeTeamName;

    @Column(name = "home_team_logo", length = 500)
    private String homeTeamLogo;

    @Column(name = "home_goals")
    private Integer homeGoals;

    // ── Away team ────────────────────────────────────────────────────────────
    @Column(name = "away_team_api_id")
    private Integer awayTeamApiId;

    @Column(name = "away_team_name", length = 100)
    private String awayTeamName;

    @Column(name = "away_team_logo", length = 500)
    private String awayTeamLogo;

    @Column(name = "away_goals")
    private Integer awayGoals;

    /** 조별리그 그룹명: "Group A" 등 (null for knockout) */
    @Column(name = "group_name", length = 50)
    private String groupName;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── Factory methods ───────────────────────────────────────────────────────

    /** API-Football 배치 수집용 */
    public static Match create(Integer fixtureId, String round, LocalDateTime matchDate,
                               String venueName, String venueCity,
                               String statusShort, String statusLong, Integer elapsed,
                               Integer homeTeamApiId, String homeTeamName, String homeTeamLogo, Integer homeGoals,
                               Integer awayTeamApiId, String awayTeamName, String awayTeamLogo, Integer awayGoals,
                               String groupName) {
        Match m = new Match();
        m.fixtureId = fixtureId;
        m.round = round;
        m.matchDate = matchDate;
        m.venueName = venueName;
        m.venueCity = venueCity;
        m.statusShort = statusShort;
        m.statusLong = statusLong;
        m.elapsed = elapsed;
        m.homeTeamApiId = homeTeamApiId;
        m.homeTeamName = homeTeamName;
        m.homeTeamLogo = homeTeamLogo;
        m.homeGoals = homeGoals;
        m.awayTeamApiId = awayTeamApiId;
        m.awayTeamName = awayTeamName;
        m.awayTeamLogo = awayTeamLogo;
        m.awayGoals = awayGoals;
        m.groupName = groupName;
        return m;
    }

    /**
     * 수동 입력용 — fixtureId는 서비스에서 1_000_000+ 범위로 미리 생성해 전달.
     * API-Football ID(보통 수십만 이하)와 충돌하지 않음.
     */
    public static Match createManual(Integer fixtureId, String round, LocalDateTime matchDate,
                                     String venueName, String venueCity,
                                     String homeTeamName, String homeTeamLogo,
                                     String awayTeamName, String awayTeamLogo,
                                     String groupName) {
        Match m = new Match();
        m.fixtureId = fixtureId;
        m.round = round;
        m.matchDate = matchDate;
        m.venueName = venueName;
        m.venueCity = venueCity;
        m.statusShort = "NS";
        m.statusLong = "Not Started";
        m.homeTeamName = homeTeamName;
        m.homeTeamLogo = homeTeamLogo;
        m.awayTeamName = awayTeamName;
        m.awayTeamLogo = awayTeamLogo;
        m.groupName = groupName;
        return m;
    }

    /** 스케줄러: 결과만 갱신 */
    public void updateResult(String statusShort, String statusLong, Integer elapsed,
                             Integer homeGoals, Integer awayGoals) {
        this.statusShort = statusShort;
        this.statusLong = statusLong;
        this.elapsed = elapsed;
        this.homeGoals = homeGoals;
        this.awayGoals = awayGoals;
    }

    /** 관리자: 모든 필드 수정 */
    public void updateDetails(String round, LocalDateTime matchDate,
                              String venueName, String venueCity,
                              String statusShort, String statusLong,
                              String homeTeamName, String homeTeamLogo, Integer homeGoals,
                              String awayTeamName, String awayTeamLogo, Integer awayGoals,
                              String groupName) {
        this.round = round;
        this.matchDate = matchDate;
        this.venueName = venueName;
        this.venueCity = venueCity;
        this.statusShort = statusShort;
        this.statusLong = statusLong;
        this.homeTeamName = homeTeamName;
        this.homeTeamLogo = homeTeamLogo;
        this.homeGoals = homeGoals;
        this.awayTeamName = awayTeamName;
        this.awayTeamLogo = awayTeamLogo;
        this.awayGoals = awayGoals;
        this.groupName = groupName;
    }
}
