package com.pitchlog.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * API-Football /predictions?fixture={fixtureId} 수집 결과.
 * fixture_id UNIQUE — 경기당 1개.
 */
@Entity
@Table(name = "fixture_predictions", uniqueConstraints = {
        @UniqueConstraint(name = "uq_fixture_predictions", columnNames = "fixture_id")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FixturePrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fixture_id", nullable = false)
    private Integer fixtureId;

    /** "Home" | "Away" | "Draw" */
    @Column(name = "winner_team", length = 20)
    private String winnerTeam;

    @Column(name = "winner_comment", length = 300)
    private String winnerComment;

    /** 홈 승 확률 (예: "55%") */
    @Column(name = "home_win_pct", length = 10)
    private String homeWinPct;

    /** 무승부 확률 */
    @Column(name = "draw_pct", length = 10)
    private String drawPct;

    /** 원정 승 확률 */
    @Column(name = "away_win_pct", length = 10)
    private String awayWinPct;

    /** 예측 득점 (예: "2:1") */
    @Column(name = "goals_home", length = 10)
    private String goalsHome;

    @Column(name = "goals_away", length = 10)
    private String goalsAway;

    @Column(name = "advice", length = 300)
    private String advice;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public static FixturePrediction create(Integer fixtureId, String winnerTeam,
                                           String winnerComment, String homeWinPct,
                                           String drawPct, String awayWinPct,
                                           String goalsHome, String goalsAway, String advice) {
        FixturePrediction p = new FixturePrediction();
        p.fixtureId     = fixtureId;
        p.winnerTeam    = winnerTeam;
        p.winnerComment = winnerComment;
        p.homeWinPct    = homeWinPct;
        p.drawPct       = drawPct;
        p.awayWinPct    = awayWinPct;
        p.goalsHome     = goalsHome;
        p.goalsAway     = goalsAway;
        p.advice        = advice;
        return p;
    }

    public void update(String winnerTeam, String winnerComment, String homeWinPct,
                       String drawPct, String awayWinPct,
                       String goalsHome, String goalsAway, String advice) {
        this.winnerTeam    = winnerTeam;
        this.winnerComment = winnerComment;
        this.homeWinPct    = homeWinPct;
        this.drawPct       = drawPct;
        this.awayWinPct    = awayWinPct;
        this.goalsHome     = goalsHome;
        this.goalsAway     = goalsAway;
        this.advice        = advice;
    }
}
