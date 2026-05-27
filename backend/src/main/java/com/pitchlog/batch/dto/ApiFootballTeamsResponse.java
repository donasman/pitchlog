package com.pitchlog.batch.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

/**
 * GET /teams?league=1&season=2026 응답 DTO
 *
 * 2026 FIFA 월드컵 48개 참가국 팀 정보를 수집한다.
 * team.code 는 3자리 코드(예: BEL, FRA)로 내부 코드 체계와 일치한다.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record ApiFootballTeamsResponse(
        Integer results,
        Object errors,   // [] (배열) 또는 {"key":"msg"} (객체) 둘 다 허용
        List<TeamEntry> response
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record TeamEntry(
            TeamInfo team,
            VenueInfo venue
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record TeamInfo(
            Integer id,     // API-Football 팀 ID (= FetchSquadsStep 에서 쓸 teamApiId)
            String name,
            String code,    // 3자리 국가 코드 (예: BEL, KOR)
            String country,
            String logo     // 팀/국기 로고 URL
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record VenueInfo(
            Integer id,
            String name,
            String city
    ) {}
}
