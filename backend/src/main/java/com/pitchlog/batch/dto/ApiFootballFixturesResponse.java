package com.pitchlog.batch.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ApiFootballFixturesResponse(
        List<FixtureItem> response
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record FixtureItem(
            FixtureInfo fixture,
            LeagueInfo league,
            Teams teams,
            Goals goals
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record FixtureInfo(
            Integer id,
            String date,          // "2026-06-11T19:00:00+00:00"
            Venue venue,
            Status status
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Venue(String name, String city) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Status(
            @JsonProperty("short") String shortCode,
            @JsonProperty("long") String longDesc,
            Integer elapsed
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record LeagueInfo(
            Integer id,
            String name,
            Integer season,
            String round
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Teams(Team home, Team away) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Team(Integer id, String name, String logo) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Goals(Integer home, Integer away) {}
}
