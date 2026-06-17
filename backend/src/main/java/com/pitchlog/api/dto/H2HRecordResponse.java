package com.pitchlog.api.dto;

import com.pitchlog.domain.entity.H2HRecord;

import java.time.LocalDateTime;

public record H2HRecordResponse(
        Integer fixtureId,
        Integer homeTeamApiId,
        String homeTeamName,
        String homeTeamLogo,
        Integer awayTeamApiId,
        String awayTeamName,
        String awayTeamLogo,
        Integer homeGoals,
        Integer awayGoals,
        LocalDateTime matchDate,
        String statusShort,
        String leagueName
) {
    public static H2HRecordResponse from(H2HRecord r) {
        return new H2HRecordResponse(
                r.getFixtureId(),
                r.getHomeTeamApiId(), r.getHomeTeamName(), r.getHomeTeamLogo(),
                r.getAwayTeamApiId(), r.getAwayTeamName(), r.getAwayTeamLogo(),
                r.getHomeGoals(), r.getAwayGoals(),
                r.getMatchDate(), r.getStatusShort(), r.getLeagueName()
        );
    }
}
