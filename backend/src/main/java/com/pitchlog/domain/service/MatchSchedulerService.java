package com.pitchlog.domain.service;

import com.pitchlog.batch.dto.ApiFootballFixturesResponse;
import com.pitchlog.batch.dto.ApiFootballLineupsResponse;
import com.pitchlog.domain.entity.Match;
import com.pitchlog.domain.entity.MatchLineupEntry;
import com.pitchlog.domain.repository.MatchLineupEntryRepository;
import com.pitchlog.domain.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 월드컵 경기 중 결과/라인업을 주기적으로 갱신하는 스케줄러.
 * <p>
 * 아키텍처 원칙 준수: 외부 API는 백엔드 스케줄러에서만 호출,
 * 프론트엔드는 항상 자체 DB만 조회.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MatchSchedulerService {

    private final WebClient apiFootballClient;
    private final MatchRepository matchRepository;
    private final MatchLineupEntryRepository lineupEntryRepository;

    /**
     * 5분마다 라이브/최근 경기 결과를 갱신한다.
     * 월드컵 기간(2026.06.11 ~ 2026.07.19)에만 실질적으로 동작.
     */
    @Scheduled(fixedDelay = 300_000)   // 5분
    @Transactional
    public void refreshLiveMatchResults() {
        LocalDateTime since = LocalDateTime.now().minusHours(2);
        List<Match> activeMatches = matchRepository.findActiveOrRecentMatches(since);

        if (activeMatches.isEmpty()) return;

        log.info("[Scheduler] Refreshing {} active/recent matches", activeMatches.size());
        for (Match match : activeMatches) {
            try {
                refreshFixture(match.getFixtureId());
            } catch (Exception e) {
                log.error("[Scheduler] Failed to refresh fixture {}: {}", match.getFixtureId(), e.getMessage());
            }
        }
    }

    /**
     * 30분마다 라인업 미등록 경기의 라인업을 수집한다.
     * (킥오프 1시간 전부터 공개되는 것이 일반적)
     */
    @Scheduled(fixedDelay = 1_800_000) // 30분
    @Transactional
    public void refreshLineups() {
        LocalDateTime since = LocalDateTime.now().minusHours(3);
        List<Match> activeMatches = matchRepository.findActiveOrRecentMatches(since);

        for (Match match : activeMatches) {
            if (lineupEntryRepository.existsByFixtureId(match.getFixtureId())) continue;
            try {
                fetchAndSaveLineups(match.getFixtureId());
            } catch (Exception e) {
                log.error("[Scheduler] Failed to fetch lineup for fixture {}: {}", match.getFixtureId(), e.getMessage());
            }
        }
    }

    // ── Public methods (also callable from Controller for manual trigger) ────

    @Transactional
    public void refreshFixture(Integer fixtureId) {
        ApiFootballFixturesResponse response = apiFootballClient.get()
                .uri("/fixtures?id={id}", fixtureId)
                .retrieve()
                .bodyToMono(ApiFootballFixturesResponse.class)
                .block();

        if (response == null || response.response() == null || response.response().isEmpty()) return;

        var item   = response.response().get(0);
        var status = item.fixture().status();
        var goals  = item.goals();

        matchRepository.findByFixtureId(fixtureId).ifPresent(match ->
                match.updateResult(
                        status.shortCode(),
                        status.longDesc(),
                        status.elapsed(),
                        goals != null ? goals.home() : null,
                        goals != null ? goals.away() : null
                )
        );
    }

    @Transactional
    public void fetchAndSaveLineups(Integer fixtureId) {
        ApiFootballLineupsResponse response = apiFootballClient.get()
                .uri("/fixtures/lineups?fixture={id}", fixtureId)
                .retrieve()
                .bodyToMono(ApiFootballLineupsResponse.class)
                .block();

        if (response == null || response.response() == null || response.response().isEmpty()) return;

        // 기존 라인업 삭제 후 재저장 (재수집 시 중복 방지)
        lineupEntryRepository.deleteByFixtureId(fixtureId);

        for (ApiFootballLineupsResponse.LineupItem teamLineup : response.response()) {
            var teamInfo  = teamLineup.team();
            String formation = teamLineup.formation();

            saveSlots(fixtureId, teamInfo.id(), teamInfo.name(), formation,
                      teamLineup.startXI(), false);
            saveSlots(fixtureId, teamInfo.id(), teamInfo.name(), formation,
                      teamLineup.substitutes(), true);
        }
        log.info("[Scheduler] Lineups saved for fixture {}", fixtureId);
    }

    private void saveSlots(Integer fixtureId, Integer teamApiId, String teamName,
                           String formation,
                           List<ApiFootballLineupsResponse.PlayerSlot> slots,
                           boolean substitute) {
        if (slots == null) return;
        for (var slot : slots) {
            var p = slot.player();
            if (p == null || p.id() == null) continue;
            lineupEntryRepository.save(MatchLineupEntry.create(
                    fixtureId, teamApiId, teamName, formation,
                    p.id(), p.name(), p.number(), p.pos(), p.grid(), substitute
            ));
        }
    }
}
