package com.pitchlog.api.dto;

import com.pitchlog.domain.entity.Country;

public record CountryResponse(
        Long id,
        String code,
        String name,
        String flagUrl,
        String groupName
) {
    public static CountryResponse from(Country country) {
        return new CountryResponse(
                country.getId(),
                country.getCode(),
                country.getName(),
                country.getFlagUrl(),
                country.getGroupName()
        );
    }
}
