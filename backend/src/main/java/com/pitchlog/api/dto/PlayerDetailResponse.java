package com.pitchlog.api.dto;

import com.pitchlog.domain.entity.Player;
import com.pitchlog.domain.entity.PlayerSeasonStats;

import java.util.List;

public record PlayerDetailResponse(
        Long id,
        String name,
        String firstName,
        String lastName,
        String nationality,
        String birthDate,
        String height,
        String weight,
        String photoUrl,
        List<SeasonStatsItem> stats
) {
    public record SeasonStatsItem(
            Integer seasonYear,
            String teamName,
            String leagueName,
            Integer appearances,
            Integer goals,
            Integer assists,
            Integer yellowCards,
            Integer redCards,
            Double rating
    ) {
        public static SeasonStatsItem from(PlayerSeasonStats stats) {
            return new SeasonStatsItem(
                    stats.getSeasonYear(),
                    stats.getTeamName(),
                    stats.getLeagueName(),
                    stats.getAppearances(),
                    stats.getGoals(),
                    stats.getAssists(),
                    stats.getYellowCards(),
                    stats.getRedCards(),
                    stats.getRating()
            );
        }
    }

    public static PlayerDetailResponse from(Player player, List<PlayerSeasonStats> statsList) {
        return new PlayerDetailResponse(
                player.getId(),
                player.getName(),
                player.getFirstName(),
                player.getLastName(),
                player.getNationality(),
                player.getBirthDate() != null ? player.getBirthDate().toString() : null,
                player.getHeight(),
                player.getWeight(),
                player.getPhotoUrl(),
                statsList.stream().map(SeasonStatsItem::from).toList()
        );
    }
}
