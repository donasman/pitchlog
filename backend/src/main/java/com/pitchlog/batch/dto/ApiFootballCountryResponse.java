package com.pitchlog.batch.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ApiFootballCountryResponse(
        @JsonProperty("response") List<CountryItem> response
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record CountryItem(
            @JsonProperty("name") String name,
            @JsonProperty("code") String code,
            @JsonProperty("flag") String flag
    ) {}
}
