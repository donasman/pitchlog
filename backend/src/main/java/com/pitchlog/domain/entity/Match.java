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

    @Column(name = "fixture_id", unique = true, nullable = false)
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

    public void updateResult(String statusShort, String statusLong, Integer elapsed,
                             Integer homeGoals, Integer awayGoals) {
        this.statusShort = statusShort;
        this.statusLong = statusLong;
        this.elapsed = elapsed;
        this.homeGoals = homeGoals;
        this.awayGoals = awayGoals;
    }
}
