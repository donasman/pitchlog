package com.pitchlog.api.dto;

import com.pitchlog.domain.entity.SquadEntry;

import java.util.List;

public record SquadResponse(
        CountryResponse country,
        List<SquadPlayerItem> players
) {
    public record SquadPlayerItem(
            Long id,
            String name,
            String photoUrl,
            String position,
            Integer jerseyNumber,
            String nationality,
            String birthDate
    ) {
        public static SquadPlayerItem from(SquadEntry entry) {
            return new SquadPlayerItem(
                    entry.getPlayer().getId(),
                    entry.getPlayer().getName(),
                    entry.getPlayer().getPhotoUrl(),
                    entry.getPosition() != null ? entry.getPosition().name() : null,
                    entry.getJerseyNumber(),
                    entry.getPlayer().getNationality(),
                    entry.getPlayer().getBirthDate() != null
                            ? entry.getPlayer().getBirthDate().toString() : null
            );
        }
    }
}
