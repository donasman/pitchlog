package com.pitchlog.domain.service;

import com.pitchlog.api.dto.MatchDetailResponse;
import com.pitchlog.api.dto.MatchSummaryResponse;
import com.pitchlog.domain.entity.Match;
import com.pitchlog.domain.entity.MatchLineupEntry;
import com.pitchlog.domain.exception.ResourceNotFoundException;
import com.pitchlog.domain.repository.MatchLineupEntryRepository;
import com.pitchlog.domain.repository.MatchRepository;
import com.pitchlog.domain.repository.PlayerRepository;
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
    private final PlayerRepository playerRepository;

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

    /**
     * 경기 상세 + 라인업.
     * 라인업 조회는 별도 트랜잭션으로 분리해 실패 시 경기 정보만 반환.
     */
    public MatchDetailResponse getMatch(Integer fixtureId) {
        Match match = matchRepository.findByFixtureId(fixtureId)
                .orElseThrow(() -> ResourceNotFoundException.match(fixtureId));

        List<MatchLineupEntry> entries = fetchLineupsSafely(fixtureId);
        return MatchDetailResponse.from(match, entries, buildPlayerIdMap(entries));
    }

    /**
     * 라인업 조회 실패 시 빈 리스트 반환.
     * @Transactional 경계 밖에서 예외를 처리해 상위 트랜잭션 오염 방지.
     */
    @Transactional(readOnly = true, noRollbackFor = Exception.class)
    public List<MatchLineupEntry> fetchLineupsSafely(Integer fixtureId) {
        try {
            return lineupEntryRepository
                    .findByFixtureIdOrderByTeamApiIdAscSubstituteAscGridAsc(fixtureId);
        } catch (Exception e) {
            log.warn("라인업 조회 실패 (fixtureId={}) — 빈 리스트 반환: {}", fixtureId, e.getMessage());
            return List.of();
        }
    }

    /**
     * 라인업 항목의 apiPlayerId 를 DB Player.id 로 매핑한다.
     * MatchLineupEntry 는 Player 와 FK 로 묶여 있지 않아 별도 조회가 필요하다.
     * 프론트의 선수 상세 페이지(/players/[slug]) 링크에 쓰인다.
     */
    private java.util.Map<Integer, Long> buildPlayerIdMap(List<MatchLineupEntry> entries) {
        var apiIds = entries.stream()
                .map(MatchLineupEntry::getPlayerApiId)
                .filter(java.util.Objects::nonNull)
                .collect(java.util.stream.Collectors.toSet());
        if (apiIds.isEmpty()) return java.util.Map.of();

        return playerRepository.findByApiPlayerIdIn(apiIds).stream()
                .collect(java.util.stream.Collectors.toMap(
                        com.pitchlog.domain.entity.Player::getApiPlayerId,
                        com.pitchlog.domain.entity.Player::getId,
                        (a, b) -> a));
    }
}
