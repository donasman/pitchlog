package com.pitchlog.batch.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

/**
 * GET /coachs?team={teamApiId} 응답 DTO
 * <pre>
 * {
 *   "response": [
 *     {
 *       "id": 112,
 *       "name": "Jurgen Klopp",
 *       "firstname": "Jurgen",
 *       "lastname": "Klopp",
 *       "nationality": "Germany",
 *       "birth": { "date": "1967-06-16", ... },
 *       "photo": "https://...",
 *       "team": { "id": 65, "name": "...", "logo": "..." }
 *     }
 *   ]
 * }
 * </pre>
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record ApiFootballCoachResponse(
        List<CoachItem> response,
        Object errors
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record CoachItem(
            Integer id,
            String name,
            String firstname,
            String lastname,
            String nationality,
            BirthInfo birth,
            String photo,
            TeamRef team
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record BirthInfo(
            String date   // "1967-06-16"
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record TeamRef(
            Integer id,
            String name,
            String logo
    ) {}
}
