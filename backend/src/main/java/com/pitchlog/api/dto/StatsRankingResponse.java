package com.pitchlog.api.dto;

import com.pitchlog.domain.entity.Player;
import com.pitchlog.domain.repository.PlayerSeasonStatsRepository.PlayerStatsProjection;

/**
 * 득점/도움/카드 랭킹 응답 DTO.
 * 전 리그 합산 집계값이므로 특정 팀에 귀속되지 않음.
 */
public record StatsRankingResponse(
        Long playerId,
        String playerName,
        String photoUrl,
        String nationality,
        int goals,
        int assists,
        int appearances,
        int yellowCards,
        int redCards
) {
    /** DB 집계 Projection으로 생성 */
    public static StatsRankingResponse from(PlayerStatsProjection p) {
        return new StatsRankingResponse(
                p.getPlayerId(),
                p.getPlayerName(),
                p.getPhotoUrl(),
                p.getNationality(),
                p.getGoals(),
                p.getAssists(),
                p.getAppearances(),
                p.getYellowCards(),
                p.getRedCards()
        );
    }
}
