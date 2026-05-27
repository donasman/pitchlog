package com.pitchlog.api.dto;

import com.pitchlog.domain.entity.Match;

import java.time.LocalDateTime;

public record MatchSummaryResponse(
        Integer fixtureId,
        String round,
        String groupName,
        LocalDateTime matchDate,
        String venueName,
        String venueCity,
        String statusShort,
        String statusLong,
        Integer elapsed,
        TeamInfo home,
        TeamInfo away,
        boolean hasLineup
) {
    public record TeamInfo(
            Integer teamApiId,
            String name,
            String logo,
            Integer goals
    ) {}

    public static MatchSummaryResponse from(Match m, boolean hasLineup) {
        return new MatchSummaryResponse(
                m.getFixtureId(),
                m.getRound(),
                m.getGroupName(),
                m.getMatchDate(),
                m.getVenueName(),
                m.getVenueCity(),
                m.getStatusShort(),
                m.getStatusLong(),
                m.getElapsed(),
                new TeamInfo(m.getHomeTeamApiId(), m.getHomeTeamName(), m.getHomeTeamLogo(), m.getHomeGoals()),
                new TeamInfo(m.getAwayTeamApiId(), m.getAwayTeamName(), m.getAwayTeamLogo(), m.getAwayGoals()),
                hasLineup
        );
    }
}
