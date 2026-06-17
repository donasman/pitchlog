package com.pitchlog.api.dto;

import com.pitchlog.domain.entity.Coach;

public record CoachResponse(
        Integer coachApiId,
        Integer teamApiId,
        String teamName,
        String teamLogo,
        String name,
        String firstName,
        String lastName,
        String nationality,
        String birthDate,
        String photoUrl
) {
    public static CoachResponse from(Coach c) {
        return new CoachResponse(
                c.getCoachApiId(),
                c.getTeamApiId(),
                c.getTeamName(),
                c.getTeamLogo(),
                c.getName(),
                c.getFirstName(),
                c.getLastName(),
                c.getNationality(),
                c.getBirthDate(),
                c.getPhotoUrl()
        );
    }
}
