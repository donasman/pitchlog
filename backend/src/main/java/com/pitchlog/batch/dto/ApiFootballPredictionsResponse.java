package com.pitchlog.batch.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

/**
 * GET /predictions?fixture={fixtureId} 응답 DTO
 * <pre>
 * {
 *   "response": [
 *     {
 *       "predictions": {
 *         "winner": { "id": 10, "name": "...", "comment": "Strong home record" },
 *         "win_or_draw": true,
 *         "under_over": "+2.5",
 *         "goals": { "home": "2", "away": "1" },
 *         "advice": "Win or draw for Home team",
 *         "percent": { "home": "55%", "draw": "25%", "away": "20%" }
 *       }
 *     }
 *   ]
 * }
 * </pre>
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record ApiFootballPredictionsResponse(
        List<PredictionItem> response,
        Object errors
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PredictionItem(
            Predictions predictions
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Predictions(
            WinnerRef winner,
            GoalsInfo goals,
            String advice,
            Percent percent
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record WinnerRef(
            Integer id,
            String name,
            String comment
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record GoalsInfo(
            String home,
            String away
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Percent(
            String home,    // "55%"
            String draw,
            String away
    ) {}
}
