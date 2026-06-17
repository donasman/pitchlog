package com.pitchlog.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 두 팀 간 맞대결(H2H) 과거 경기 기록.
 * fixture_id UNIQUE — API-Football fixture id.
 */
@Entity
@Table(name = "h2h_records", uniqueConstraints = {
        @UniqueConstraint(name = "uq_h2h_records", columnNames = "fixture_id")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class H2HRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fixture_id", nullable = false)
    private Integer fixtureId;

    /** 두 팀 키 — 정렬해서 저장 (작은 ID-큰 ID), 인덱스용 */
    @Column(name = "team_pair", length = 30, nullable = false)
    private String teamPair;     // "10-20" 형식

    @Column(name = "home_team_api_id")
    private Integer homeTeamApiId;

    @Column(name = "home_team_name", length = 100)
    private String homeTeamName;

    @Column(name = "home_team_logo", length = 500)
    private String homeTeamLogo;

    @Column(name = "away_team_api_id")
    private Integer awayTeamApiId;

    @Column(name = "away_team_name", length = 100)
    private String awayTeamName;

    @Column(name = "away_team_logo", length = 500)
    private String awayTeamLogo;

    @Column(name = "home_goals")
    private Integer homeGoals;

    @Column(name = "away_goals")
    private Integer awayGoals;

    @Column(name = "match_date")
    private LocalDateTime matchDate;

    @Column(name = "status_short", length = 10)
    private String statusShort;

    @Column(name = "league_name", length = 100)
    private String leagueName;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public static String buildPair(Integer t1, Integer t2) {
        if (t1 == null || t2 == null) return "0-0";
        int a = Math.min(t1, t2);
        int b = Math.max(t1, t2);
        return a + "-" + b;
    }

    public static H2HRecord create(Integer fixtureId, String teamPair,
                                   Integer homeTeamApiId, String homeTeamName, String homeTeamLogo,
                                   Integer awayTeamApiId, String awayTeamName, String awayTeamLogo,
                                   Integer homeGoals, Integer awayGoals,
                                   LocalDateTime matchDate, String statusShort, String leagueName) {
        H2HRecord r = new H2HRecord();
        r.fixtureId      = fixtureId;
        r.teamPair       = teamPair;
        r.homeTeamApiId  = homeTeamApiId;
        r.homeTeamName   = homeTeamName;
        r.homeTeamLogo   = homeTeamLogo;
        r.awayTeamApiId  = awayTeamApiId;
        r.awayTeamName   = awayTeamName;
        r.awayTeamLogo   = awayTeamLogo;
        r.homeGoals      = homeGoals;
        r.awayGoals      = awayGoals;
        r.matchDate      = matchDate;
        r.statusShort    = statusShort;
        r.leagueName     = leagueName;
        return r;
    }
}
