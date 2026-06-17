package com.pitchlog.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * 관리자 경기 생성/수정 요청 DTO
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record AdminMatchRequest(
        String round,          // "Group Stage - 1", "Round of 16" 등
        String matchDate,      // ISO 8601: "2026-06-11T19:00:00"
        String venueName,
        String venueCity,
        String statusShort,    // "NS" (기본값), "FT" 등
        String statusLong,
        String homeTeamName,
        String homeTeamLogo,   // 국기 URL (선택)
        Integer homeGoals,
        String awayTeamName,
        String awayTeamLogo,
        Integer awayGoals,
        String groupName       // "Group A" 등 (조별리그만)
) {}
