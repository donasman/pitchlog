package com.pitchlog.api.dto;

import com.pitchlog.domain.entity.FixturePrediction;

public record PredictionResponse(
        Integer fixtureId,
        String winnerTeam,
        String winnerComment,
        String homeWinPct,
        String drawPct,
        String awayWinPct,
        String goalsHome,
        String goalsAway,
        String advice
) {
    public static PredictionResponse from(FixturePrediction p) {
        return new PredictionResponse(
                p.getFixtureId(),
                p.getWinnerTeam(),
                p.getWinnerComment(),
                p.getHomeWinPct(),
                p.getDrawPct(),
                p.getAwayWinPct(),
                p.getGoalsHome(),
                p.getGoalsAway(),
                p.getAdvice()
        );
    }
}
