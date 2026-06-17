package com.pitchlog.batch.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * GET /odds?fixture={id}&bookmaker=1 응답 DTO
 *
 * 응답 구조:
 * {
 *   "response": [
 *     {
 *       "fixture": { "id": 123 },
 *       "bookmakers": [
 *         {
 *           "id": 1,
 *           "name": "Bet365",
 *           "bets": [
 *             {
 *               "id": 1,
 *               "name": "Match Winner",
 *               "values": [
 *                 { "value": "Home", "odd": "1.85" },
 *                 { "value": "Draw", "odd": "3.40" },
 *                 { "value": "Away", "odd": "4.20" }
 *               ]
 *             }
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 * }
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record ApiFootballOddsResponse(
        List<OddsItem> response
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record OddsItem(
            FixtureRef fixture,
            List<BookmakerItem> bookmakers
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record FixtureRef(
            Integer id
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record BookmakerItem(
            Integer id,
            String name,
            List<BetItem> bets
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record BetItem(
            Integer id,
            String name,
            List<OddsValue> values
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record OddsValue(
            @JsonProperty("value") String label,   // "Home" | "Draw" | "Away"
            String odd
    ) {}
}
