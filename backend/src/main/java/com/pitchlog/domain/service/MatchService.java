package com.pitchlog.domain.service;

import com.pitchlog.api.dto.MatchDetailResponse;
import com.pitchlog.api.dto.MatchSummaryResponse;
import com.pitchlog.domain.entity.Match;
import com.pitchlog.domain.entity.MatchLineupEntry;
import com.pitchlog.domain.repository.MatchLineupEntryRepository;
import com.pitchlog.domain.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MatchService {

    private final MatchRepository matchRepository;
    private final MatchLineupEntryRepository lineupEntryRepository;

    /** 전체 경기 목록 (날짜 오름차순) */
    public List<MatchSummaryResponse> getAllMatches() {
        return matchRepository.findAllByOrderByMatchDateAsc().stream()
                .map(m -> {
                    boolean hasLineup = false;
                    try {
                        hasLineup = m.getFixtureId() != null
                                && lineupEntryRepository.existsByFixtureId(m.getFixtureId());
                    } catch (Exception e) {
                        log.warn("라인업 존재 여부 조회 실패 (fixtureId={}): {}", m.getFixtureId(), e.getMessage());
                    }
                    return MatchSummaryResponse.from(m, hasLineup);
                })
                .toList();
    }

    /** 경기 상세 + 라인업 */
    public MatchDetailResponse getMatch(Integer fixtureId) {
        Match match = matchRepository.findByFixtureId(fixtureId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found: " + fixtureId));

        List<MatchLineupEntry> entries = List.of();
        try {
            entries = lineupEntryRepository
                    .findByFixtureIdOrderByTeamApiIdAscSubstituteAscGridAsc(fixtureId);
        } catch (Exception e) {
            log.warn("라인업 조회 실패 (fixtureId={}): {}", fixtureId, e.getMessage());
        }

        return MatchDetailResponse.from(match, entries);
    }
}
