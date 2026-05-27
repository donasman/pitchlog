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
    private Integer goals;

    @Column
    private Integer assists;

    @Column(name = "yellow_cards")
    private Integer yellowCards;

    @Column(name = "red_cards")
    private Integer redCards;

    @Column
    private Double rating;

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

    public void updateStats(Integer appearances, Integer goals, Integer assists,
                            Integer yellowCards, Integer redCards, Double rating) {
        this.appearances = appearances;
        this.goals = goals;
        this.assists = assists;
        this.yellowCards = yellowCards;
        this.redCards = redCards;
        this.rating = rating;
    }
}
