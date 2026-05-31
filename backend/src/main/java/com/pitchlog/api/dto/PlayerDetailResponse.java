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
            String  teamName,
            String  leagueName,
            Integer appearances,
            Integer lineups,
            Integer minutes,
            Integer goals,
            Integer assists,
            Integer saves,
            Integer yellowCards,
            Integer redCards,
            Double  rating,
            Integer passesTotal,
            Integer passesAccuracy,
            Integer shotsTotal,
            Integer shotsOn,
            Integer dribblesAttempts,
            Integer dribblesSuccess,
            Integer tacklesTotal,
            Integer interceptions,
            Integer duelsTotal,
            Integer duelsWon,
            Integer foulsCommitted,
            Integer foulsDrawn
    ) {
        public static SeasonStatsItem from(PlayerSeasonStats s) {
            return new SeasonStatsItem(
                    s.getSeasonYear(),
                    s.getTeamName(),
                    s.getLeagueName(),
                    s.getAppearances(),
                    s.getLineups(),
                    s.getMinutes(),
                    s.getGoals(),
                    s.getAssists(),
                    s.getSaves(),
                    s.getYellowCards(),
                    s.getRedCards(),
                    s.getRating(),
                    s.getPassesTotal(),
                    s.getPassesAccuracy(),
                    s.getShotsTotal(),
                    s.getShotsOn(),
                    s.getDribblesAttempts(),
                    s.getDribblesSuccess(),
                    s.getTacklesTotal(),
                    s.getInterceptions(),
                    s.getDuelsTotal(),
                    s.getDuelsWon(),
                    s.getFoulsCommitted(),
                    s.getFoulsDrawn()
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
