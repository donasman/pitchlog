package com.pitchlog.domain.service;

import com.pitchlog.api.dto.AdminMatchRequest;
import com.pitchlog.api.dto.MatchSummaryResponse;
import com.pitchlog.domain.entity.Match;
import com.pitchlog.domain.repository.MatchLineupEntryRepository;
import com.pitchlog.domain.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class AdminMatchService {

    private final MatchRepository matchRepository;
    private final MatchLineupEntryRepository lineupEntryRepository;

    /** 단일 경기 조회 (편집 폼용) */
    @Transactional(readOnly = true)
    public MatchSummaryResponse getMatch(Integer fixtureId) {
        Match match = matchRepository.findByFixtureId(fixtureId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found: " + fixtureId));
        return MatchSummaryResponse.from(match, lineupEntryRepository.existsByFixtureId(fixtureId));
    }

    /** 경기 생성 — fixtureId를 1_000_000+ 범위에서 사전 생성 (DB NOT NULL 제약 충족) */
    @Transactional
    public MatchSummaryResponse createMatch(AdminMatchRequest req) {
        // 수동 경기는 1_000_000부터 시작하는 범위 사용 (API-Football ID와 분리)
        int nextFixtureId = matchRepository.findMaxManualFixtureId()
                .map(max -> max + 1)
                .orElse(1_000_000);

        Match match = Match.createManual(
                nextFixtureId,
                req.round(),
                parseDate(req.matchDate()),
                req.venueName(),
                req.venueCity(),
                req.homeTeamName(),
                req.homeTeamLogo(),
                req.awayTeamName(),
                req.awayTeamLogo(),
                req.groupName()
        );
        Match saved = matchRepository.save(match);
        return MatchSummaryResponse.from(saved, false);
    }

    /** 경기 수정 */
    @Transactional
    public MatchSummaryResponse updateMatch(Integer fixtureId, AdminMatchRequest req) {
        Match match = matchRepository.findByFixtureId(fixtureId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found: " + fixtureId));

        String statusShort = req.statusShort() != null ? req.statusShort() : match.getStatusShort();
        String statusLong  = req.statusLong()  != null ? req.statusLong()  : match.getStatusLong();

        match.updateDetails(
                req.round(),
                parseDate(req.matchDate()),
                req.venueName(),
                req.venueCity(),
                statusShort,
                statusLong,
                req.homeTeamName(),
                req.homeTeamLogo(),
                req.homeGoals(),
                req.awayTeamName(),
                req.awayTeamLogo(),
                req.awayGoals(),
                req.groupName()
        );
        return MatchSummaryResponse.from(match, lineupEntryRepository.existsByFixtureId(fixtureId));
    }

    /** 경기 삭제 */
    @Transactional
    public void deleteMatch(Integer fixtureId) {
        Match match = matchRepository.findByFixtureId(fixtureId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found: " + fixtureId));
        lineupEntryRepository.deleteByFixtureId(fixtureId);
        matchRepository.delete(match);
    }

    private LocalDateTime parseDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return null;
        // "2026-06-11T19:00" 또는 "2026-06-11T19:00:00" 모두 허용
        return LocalDateTime.parse(dateStr.length() == 16 ? dateStr + ":00" : dateStr,
                DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }
}
