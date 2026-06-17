package com.pitchlog.batch.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ApiFootballStandingsResponse(
        Object errors,
        Integer results,
        List<StandingsData> response
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record StandingsData(LeagueData league) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record LeagueData(
            Integer id,
            String name,
            Integer season,
            List<List<StandingEntry>> standings   // 외부 리스트 = 조, 내부 리스트 = 팀
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record StandingEntry(
            Integer rank,
            TeamInfo team,
            Integer points,
            Integer goalsDiff,
            String group,       // "Group A"
            String form,        // "WWDL" or null
            String status,
            String description,
            AllStats all
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record TeamInfo(Integer id, String name, String logo) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record AllStats(
            Integer played,
            Integer win,
            Integer draw,
            Integer lose,
            Goals goals
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Goals(
            @JsonProperty("for") Integer goalsFor,
            Integer against
    ) {}
}
