package com.pitchlog.batch.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

/**
 * GET /fixtures/players?fixture={fixtureId} 응답 DTO
 * <pre>
 * {
 *   "response": [
 *     {
 *       "team": { "id": 10, "name": "...", "logo": "..." },
 *       "players": [
 *         {
 *           "player": { "id": 123, "name": "...", "photo": "..." },
 *           "statistics": [
 *             {
 *               "games": { "minutes": 90, "rating": "7.5" },
 *               "goals": { "total": 1, "assists": 0 }
 *             }
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 * }
 * </pre>
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record ApiFootballFixturePlayersResponse(
        List<TeamPlayerData> response,
        Object errors
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record TeamPlayerData(
            TeamRef team,
            List<PlayerEntry> players
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record TeamRef(
            Integer id,
            String name,
            String logo
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PlayerEntry(
            PlayerRef player,
            List<PlayerStats> statistics
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PlayerRef(
            Integer id,
            String name,
            String photo
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PlayerStats(
            GamesStats games,
            GoalsStats goals
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record GamesStats(
            Integer minutes,
            String rating     // "7.5" 형식 문자열
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record GoalsStats(
            Integer total,    // 골
            Integer assists
    ) {}
}
