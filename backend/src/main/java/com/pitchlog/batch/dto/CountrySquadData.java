package com.pitchlog.batch.dto;

import com.pitchlog.domain.entity.Country;

import java.util.List;

/**
 * FetchSquadsStep 에서 Country + 선수 목록을 함께 전달하기 위한 래퍼 레코드.
 * Processor → Writer 구간에 국가 컨텍스트를 유지한다.
 */
public record CountrySquadData(
        Country country,
        List<ApiFootballSquadResponse.PlayerInfo> players
) {}
