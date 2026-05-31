package com.pitchlog.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "player_season_stats", uniqueConstraints = {
        @UniqueConstraint(
                name = "uq_player_season_stats",
                columnNames = {"player_id", "team_api_id", "league_api_id", "season_year"}
        )
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PlayerSeasonStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @Column(name = "team_api_id", nullable = false)
    private Integer teamApiId;

    @Column(name = "team_name", length = 100)
    private String teamName;

    @Column(name = "league_api_id", nullable = false)
    private Integer leagueApiId;

    @Column(name = "league_name", length = 100)
    private String leagueName;

    @Column(name = "season_year", nullable = false)
    private Integer seasonYear;    // 예: 2025

    @Column
    private Integer appearances;

    @Column
    private Integer lineups;        // 선발 횟수

    @Column
    private Integer minutes;        // 총 출전 분수

    @Column
    private Integer goals;

    @Column
    private Integer assists;

    @Column
    private Integer saves;          // 선방 수 (GK)

    @Column(name = "yellow_cards")
    private Integer yellowCards;

    @Column(name = "red_cards")
    private Integer redCards;

    @Column
    private Double rating;

    // 패스
    @Column(name = "passes_total")
    private Integer passesTotal;

    @Column(name = "passes_accuracy")
    private Integer passesAccuracy; // 정수 퍼센트

    // 슈팅
    @Column(name = "shots_total")
    private Integer shotsTotal;

    @Column(name = "shots_on")
    private Integer shotsOn;        // 유효 슈팅

    // 드리블
    @Column(name = "dribbles_attempts")
    private Integer dribblesAttempts;

    @Column(name = "dribbles_success")
    private Integer dribblesSuccess;

    // 수비
    @Column(name = "tackles_total")
    private Integer tacklesTotal;

    @Column
    private Integer interceptions;

    // 듀얼
    @Column(name = "duels_total")
    private Integer duelsTotal;

    @Column(name = "duels_won")
    private Integer duelsWon;

    // 파울
    @Column(name = "fouls_committed")
    private Integer foulsCommitted;

    @Column(name = "fouls_drawn")
    private Integer foulsDrawn;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 정적 팩토리 메서드
    public static PlayerSeasonStats create(Player player, Integer teamApiId, String teamName,
                                           Integer leagueApiId, String leagueName, Integer seasonYear) {
        PlayerSeasonStats stats = new PlayerSeasonStats();
        stats.player = player;
        stats.teamApiId = teamApiId;
        stats.teamName = teamName;
        stats.leagueApiId = leagueApiId;
        stats.leagueName = leagueName;
        stats.seasonYear = seasonYear;
        return stats;
    }

    /** 통계 값 묶음 — FetchPlayerStatsStep에서 값 전달 시 사용 */
    public record StatsValues(
            Integer appearances, Integer lineups, Integer minutes,
            Integer goals, Integer assists, Integer saves,
            Integer yellowCards, Integer redCards, Double rating,
            Integer passesTotal, Integer passesAccuracy,
            Integer shotsTotal, Integer shotsOn,
            Integer dribblesAttempts, Integer dribblesSuccess,
            Integer tacklesTotal, Integer interceptions,
            Integer duelsTotal, Integer duelsWon,
            Integer foulsCommitted, Integer foulsDrawn
    ) {}

    public void updateStats(StatsValues v) {
        this.appearances      = v.appearances();
        this.lineups          = v.lineups();
        this.minutes          = v.minutes();
        this.goals            = v.goals();
        this.assists          = v.assists();
        this.saves            = v.saves();
        this.yellowCards      = v.yellowCards();
        this.redCards         = v.redCards();
        this.rating           = v.rating();
        this.passesTotal      = v.passesTotal();
        this.passesAccuracy   = v.passesAccuracy();
        this.shotsTotal       = v.shotsTotal();
        this.shotsOn          = v.shotsOn();
        this.dribblesAttempts = v.dribblesAttempts();
        this.dribblesSuccess  = v.dribblesSuccess();
        this.tacklesTotal     = v.tacklesTotal();
        this.interceptions    = v.interceptions();
        this.duelsTotal       = v.duelsTotal();
        this.duelsWon         = v.duelsWon();
        this.foulsCommitted   = v.foulsCommitted();
        this.foulsDrawn       = v.foulsDrawn();
    }
}
