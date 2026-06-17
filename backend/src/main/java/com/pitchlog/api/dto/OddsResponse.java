package com.pitchlog.api.dto;

import com.pitchlog.domain.entity.FixtureOdds;

public record OddsResponse(
        Integer fixtureId,
        Integer bookmakerId,
        String bookmakerName,
        String betName,
        String homeOdd,
        String drawOdd,
        String awayOdd
) {
    public static OddsResponse from(FixtureOdds o) {
        return new OddsResponse(
                o.getFixtureId(),
                o.getBookmakerId(),
                o.getBookmakerName(),
                o.getBetName(),
                o.getHomeOdd(),
                o.getDrawOdd(),
                o.getAwayOdd()
        );
    }
}
