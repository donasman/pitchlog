package com.pitchlog.domain.service;

import com.pitchlog.api.dto.MatchDetailResponse;
import com.pitchlog.api.dto.MatchSummaryResponse;
import com.pitchlog.domain.entity.Match;
import com.pitchlog.domain.repository.MatchLineupEntryRepository;
import com.pitchlog.domain.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MatchService {

    private final MatchRepository matchRepository;
    private final MatchLineupEntryRepository lineupEntryRepository;

    /** 전체 경기 목록 (날짜 오름차순) */
    public List<MatchSummaryResponse> getAllMatches() {
        return matchRepository.findAllByOrderByMatchDateAsc().stream()
                .map(m -> MatchSummaryResponse.from(m, lineupEntryRepository.existsByFixtureId(m.getFixtureId())))
                .toList();
    }

    /** 경기 상세 + 라인업 */
    public MatchDetailResponse getMatch(Integer fixtureId) {
        Match match = matchRepository.findByFixtureId(fixtureId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found: " + fixtureId));
        var entries = lineupEntryRepository.findByFixtureIdOrderByTeamApiIdAscSubstituteAscGridAsc(fixtureId);
        return MatchDetailResponse.from(match, entries);
    }
}
