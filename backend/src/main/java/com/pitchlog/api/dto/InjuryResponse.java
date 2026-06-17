package com.pitchlog.api.dto;

import com.pitchlog.domain.entity.PlayerInjury;

public record InjuryResponse(
        Integer playerApiId,
        String  playerName,
        String  playerPhoto,
        Integer teamApiId,
        String  teamName,
        String  teamLogo,
        Integer fixtureId,
        String  fixtureDate,    // ISO 8601
        String  injuryType,
        String  reason,
        boolean isSuspension    // injuryType == "Suspension" 편의 플래그
) {
    public static InjuryResponse from(PlayerInjury injury) {
        return new InjuryResponse(
                injury.getPlayerApiId(),
                injury.getPlayerName(),
                injury.getPlayerPhoto(),
                injury.getTeamApiId(),
                injury.getTeamName(),
                injury.getTeamLogo(),
                injury.getFixtureId(),
                injury.getFixtureDate() != null ? injury.getFixtureDate().toString() : null,
                injury.getInjuryType(),
                injury.getReason(),
                "Suspension".equalsIgnoreCase(injury.getInjuryType())
        );
    }
}
