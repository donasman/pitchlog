package com.pitchlog.batch.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ApiFootballPlayerStatsResponse(
        @JsonProperty("response") List<PlayerStatsItem> response,
        @JsonProperty("paging")   Paging paging
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Paging(
            @JsonProperty("current") Integer current,
            @JsonProperty("total")   Integer total
    ) {}

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
            @JsonProperty("team")      TeamRef      team,
            @JsonProperty("league")    LeagueRef    league,
            @JsonProperty("games")     GamesStats   games,
            @JsonProperty("goals")     GoalsStats   goals,
            @JsonProperty("cards")     CardsStats   cards,
            @JsonProperty("passes")    PassesStats  passes,
            @JsonProperty("shots")     ShotsStats   shots,
            @JsonProperty("dribbles")  DribblesStats dribbles,
            @JsonProperty("tackles")   TacklesStats tackles,
            @JsonProperty("duels")     DuelsStats   duels,
            @JsonProperty("fouls")     FoulsStats   fouls
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
            @JsonProperty("appearences") Integer appearances,  // API 오타 그대로
            @JsonProperty("lineups")     Integer lineups,
            @JsonProperty("minutes")     Integer minutes,
            @JsonProperty("rating")      String  rating
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record GoalsStats(
            @JsonProperty("total")   Integer total,
            @JsonProperty("assists") Integer assists,
            @JsonProperty("saves")   Integer saves
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record CardsStats(
            @JsonProperty("yellow") Integer yellow,
            @JsonProperty("red")    Integer red
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PassesStats(
            @JsonProperty("total")    Integer total,
            @JsonProperty("accuracy") Integer accuracy  // 정수 퍼센트 (예: 85)
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ShotsStats(
            @JsonProperty("total") Integer total,
            @JsonProperty("on")    Integer on
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record DribblesStats(
            @JsonProperty("attempts") Integer attempts,
            @JsonProperty("success")  Integer success
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record TacklesStats(
            @JsonProperty("total")         Integer total,
            @JsonProperty("interceptions") Integer interceptions
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record DuelsStats(
            @JsonProperty("total") Integer total,
            @JsonProperty("won")   Integer won
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record FoulsStats(
            @JsonProperty("committed") Integer committed,
            @JsonProperty("drawn")     Integer drawn
    ) {}
}
