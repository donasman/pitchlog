package com.pitchlog.batch.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ApiFootballLineupsResponse(
        List<LineupItem> response
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record LineupItem(
            TeamInfo team,
            String formation,
            List<PlayerSlot> startXI,
            List<PlayerSlot> substitutes
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record TeamInfo(Integer id, String name) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PlayerSlot(PlayerInfo player) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PlayerInfo(
            Integer id,
            String name,
            Integer number,
            String pos,    // "G" "D" "M" "F"
            String grid    // "1:1", "2:1" 등
    ) {}
}
