package com.pitchlog.api.dto;

import com.pitchlog.domain.entity.GroupStanding;

import java.util.List;

public record StandingGroupResponse(
        String groupName,
        List<StandingEntryResponse> standings
) {
    public record StandingEntryResponse(
            Integer rank,
            Integer teamApiId,
            String teamName,
            String teamLogo,
            Integer played,
            Integer win,
            Integer draw,
            Integer lose,
            Integer goalsFor,
            Integer goalsAgainst,
            Integer goalsDiff,
            Integer points,
            String form,
            String description
    ) {
        public static StandingEntryResponse from(GroupStanding gs) {
            return new StandingEntryResponse(
                    gs.getRank(),
                    gs.getTeamApiId(),
                    gs.getTeamName(),
                    gs.getTeamLogo(),
                    gs.getPlayed(),
                    gs.getWin(),
                    gs.getDraw(),
                    gs.getLose(),
                    gs.getGoalsFor(),
                    gs.getGoalsAgainst(),
                    gs.getGoalsDiff(),
                    gs.getPoints(),
                    gs.getForm(),
                    gs.getDescription()
            );
        }
    }
}
