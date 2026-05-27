package com.pitchlog.batch.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ApiFootballPlayerStatsResponse(
        @JsonProperty("response") List<PlayerStatsItem> response
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PlayerStatsItem(
            @JsonProperty("player") PlayerDetail player,
            @JsonProperty("statistics") List<StatisticsDetail> statistics
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PlayerDetail(
            @JsonProperty("id") Integer id,
            @JsonProperty("name") String name,
            @JsonProperty("firstname") String firstname,
            @JsonProperty("lastname") String lastname,
            @JsonProperty("nationality") String nationality,
            @JsonProperty("birth") BirthDetail birth,
            @JsonProperty("height") String height,
            @JsonProperty("weight") String weight,
            @JsonProperty("photo") String photo
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record BirthDetail(
            @JsonProperty("date") String date   // "YYYY-MM-DD"
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record StatisticsDetail(
            @JsonProperty("team") TeamRef team,
            @JsonProperty("league") LeagueRef league,
            @JsonProperty("games") GamesStats games,
            @JsonProperty("goals") GoalsStats goals,
            @JsonProperty("cards") CardsStats cards
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record TeamRef(
            @JsonProperty("id") Integer id,
            @JsonProperty("name") String name
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record LeagueRef(
            @JsonProperty("id") Integer id,
            @JsonProperty("name") String name,
            @JsonProperty("season") Integer season
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record GamesStats(
            @JsonProperty("appearences") Integer appearances,
            @JsonProperty("rating") String rating
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record GoalsStats(
            @JsonProperty("total") Integer total,
            @JsonProperty("assists") Integer assists
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record CardsStats(
            @JsonProperty("yellow") Integer yellow,
            @JsonProperty("red") Integer red
    ) {}
}
