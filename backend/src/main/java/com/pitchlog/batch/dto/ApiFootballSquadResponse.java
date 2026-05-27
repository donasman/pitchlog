package com.pitchlog.batch.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ApiFootballSquadResponse(
        @JsonProperty("response") List<SquadItem> response
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record SquadItem(
            @JsonProperty("team") TeamInfo team,
            @JsonProperty("players") List<PlayerInfo> players
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record TeamInfo(
            @JsonProperty("id") Integer id,
            @JsonProperty("name") String name,
            @JsonProperty("logo") String logo
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PlayerInfo(
            @JsonProperty("id") Integer id,
            @JsonProperty("name") String name,
            @JsonProperty("age") Integer age,
            @JsonProperty("number") Integer number,
            @JsonProperty("position") String position,
            @JsonProperty("photo") String photo
    ) {}
}
