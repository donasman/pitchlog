package com.pitchlog.batch.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

/**
 * GET /fixtures/headtohead?h2h={t1}-{t2} 응답 DTO
 * 구조는 GET /fixtures 응답과 동일 (ApiFootballFixturesResponse 재활용 가능하나
 * 별도로 분리해 명확성 유지)
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record ApiFootballH2HResponse(
        List<FixtureItem> response,
        Object errors
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record FixtureItem(
            FixtureInfo fixture,
            LeagueInfo league,
            TeamsInfo teams,
            GoalsInfo goals
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record FixtureInfo(
            Integer id,
            String date,           // "2024-11-10T15:00:00+00:00"
            StatusInfo status
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record StatusInfo(
            String shortCode
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record LeagueInfo(
            Integer id,
            String name
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record TeamsInfo(
            TeamRef home,
            TeamRef away
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record TeamRef(
            Integer id,
            String name,
            String logo
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record GoalsInfo(
            Integer home,
            Integer away
    ) {}
}
