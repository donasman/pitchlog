package com.pitchlog.api.dto;

import com.pitchlog.domain.entity.Player;
import com.pitchlog.domain.repository.PlayerSeasonStatsRepository.PlayerStatsProjection;

/**
 * 득점/도움 랭킹 응답 DTO.
 * teamName 은 제거 — 선수별 집계값(전 리그 합산)을 표시하므로 특정 팀에 귀속되지 않음.
 */
public record StatsRankingResponse(
        Long playerId,
        String playerName,
        String photoUrl,
        String nationality,
        int goals,
        int assists,
        int appearances
) {
    /** Player 엔티티 + 집계값으로 생성 */
    public static StatsRankingResponse of(Player player, int goals, int assists, int appearances) {
        return new StatsRankingResponse(
                player.getId(),
                player.getName(),
                player.getPhotoUrl(),
                player.getNationality(),
                goals,
                assists,
                appearances
        );
    }

    /** DB 집계 Projection으로 생성 */
    public static StatsRankingResponse from(PlayerStatsProjection p) {
        return new StatsRankingResponse(
                p.getPlayerId(),
                p.getPlayerName(),
                p.getPhotoUrl(),
                p.getNationality(),
                p.getGoals(),
                p.getAssists(),
                p.getAppearances()
        );
    }
}
