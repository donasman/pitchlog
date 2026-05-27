package com.pitchlog.api.dto;

import com.pitchlog.domain.entity.PlayerSeasonStats;

public record StatsRankingResponse(
        Long playerId,
        String playerName,
        String photoUrl,
        String nationality,
        String teamName,
        Integer goals,
        Integer assists,
        Integer appearances
) {
    public static StatsRankingResponse from(PlayerSeasonStats stats) {
        return new StatsRankingResponse(
                stats.getPlayer().getId(),
                stats.getPlayer().getName(),
                stats.getPlayer().getPhotoUrl(),
                stats.getPlayer().getNationality(),
                stats.getTeamName(),
                stats.getGoals(),
                stats.getAssists(),
                stats.getAppearances()
        );
    }
}
