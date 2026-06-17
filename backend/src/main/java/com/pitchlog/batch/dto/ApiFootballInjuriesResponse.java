package com.pitchlog.batch.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ApiFootballInjuriesResponse(
        Object errors,
        Integer results,
        List<InjuryItem> response
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record InjuryItem(
            InjuredPlayer player,
            TeamRef team,
            FixtureRef fixture
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record InjuredPlayer(
            Integer id,
            String name,
            String photo,
            String type,    // "Knee Injury" | "Suspension"
            String reason   // "Muscular" | "Yellow Cards"
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record TeamRef(
            Integer id,
            String name,
            String logo
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record FixtureRef(
            Integer id,
            String timezone,
            String date,        // ISO 8601
            Long timestamp
    ) {}
}
