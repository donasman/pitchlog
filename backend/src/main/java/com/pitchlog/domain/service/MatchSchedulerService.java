package com.pitchlog.domain.service;

import com.pitchlog.batch.dto.ApiFootballFixturesResponse;
import com.pitchlog.batch.dto.ApiFootballLineupsResponse;
import com.pitchlog.batch.dto.ApiFootballStandingsResponse;
import com.pitchlog.batch.step.FetchInjuriesStep;
import com.pitchlog.batch.step.FetchPlayerRatingsStep;
import com.pitchlog.batch.step.FetchPredictionsStep;
import com.pitchlog.batch.step.FetchStandingsStep;
import com.pitchlog.domain.entity.Match;
import com.pitchlog.domain.entity.MatchLineupEntry;
import com.pitchlog.domain.repository.MatchLineupEntryRepository;
import com.pitchlog.domain.repository.MatchRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.atomic.AtomicReference;

/**
 * 월드컵 경기 중 결과/라인업/순위를 주기적으로 갱신하는 스케줄러.
 * <p>
 * 3단계 동적 모드로 동작:
 * <ul>
 *   <li>IDLE   — 경기 없음. 라이브/라인업 폴링 중단.</li>
 *   <li>LINEUP — 킥오프 1시간 이내 NS 경기 존재. 5분마다 라인업 조회.</li>
 *   <li>LIVE   — 진행 중 경기 존재. 10초 스코어 + 5분 라인업 미수집 재시도.</li>
 * </ul>
 * 순위/부상/평점/예측은 고정 주기(@Scheduled) 유지.
 */
@Slf4j
@Service
@ConditionalOnProperty(name = "api-football.scheduler-enabled", havingValue = "true", matchIfMissing = true)
public class MatchSchedulerService {

    private static final List<String> LIVE_STATUS_CODES =
            List.of("1H", "HT", "2H", "ET", "BT", "P");

    private final WebClient apiFootballClient;
    private final MatchRepository matchRepository;
    private final MatchLineupEntryRepository lineupEntryRepository;
    private final FetchStandingsStep fetchStandingsStep;
    private final FetchInjuriesStep fetchInjuriesStep;
    private final FetchPlayerRatingsStep fetchPlayerRatingsStep;
    private final FetchPredictionsStep fetchPredictionsStep;
    private final TaskScheduler taskScheduler;

    @Value("${api-football.wc-league-id:1}")
    private Integer leagueId;

    @Value("${api-football.season:2026}")
    private Integer season;

    private final AtomicReference<ScheduledFuture<?>> liveTask   = new AtomicReference<>();
    private final AtomicReference<ScheduledFuture<?>> lineupTask = new AtomicReference<>();
    private volatile String currentMode = "IDLE";

    public MatchSchedulerService(
            WebClient apiFootballClient,
            MatchRepository matchRepository,
            MatchLineupEntryRepository lineupEntryRepository,
            FetchStandingsStep fetchStandingsStep,
            FetchInjuriesStep fetchInjuriesStep,
            FetchPlayerRatingsStep fetchPlayerRatingsStep,
            FetchPredictionsStep fetchPredictionsStep,
            @Qualifier("dynamicTaskScheduler") TaskScheduler taskScheduler) {
        this.apiFootballClient      = apiFootballClient;
        this.matchRepository        = matchRepository;
        this.lineupEntryRepository  = lineupEntryRepository;
        this.fetchStandingsStep     = fetchStandingsStep;
        this.fetchInjuriesStep      = fetchInjuriesStep;
        this.fetchPlayerRatingsStep = fetchPlayerRatingsStep;
        this.fetchPredictionsStep   = fetchPredictionsStep;
        this.taskScheduler          = taskScheduler;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 마스터 루프 — 1분마다 모드 판단 후 동적 태스크 등록/해제
    // ═══════════════════════════════════════════════════════════════════════

    @Scheduled(fixedDelay = 60_000)
    public void modeController() {
        try {
            LocalDateTime now = LocalDateTime.now();

            // DB에 이미 라이브 코드가 있거나, 킥오프 시간이 지난 NS 경기가 있으면 LIVE
            boolean hasLive = matchRepository.existsLiveMatch()
                    || matchRepository.existsMatchShouldHaveStarted(now.minusHours(3), now);

            boolean hasPreMatch = !hasLive && matchRepository.existsPreMatchWithin(
                    now, now.plusHours(1));

            String targetMode = hasLive ? "LIVE" : (hasPreMatch ? "LINEUP" : "IDLE");

            if (targetMode.equals(currentMode)) return;

            log.info("[Scheduler] 모드 전환: {} → {}", currentMode, targetMode);

            switch (targetMode) {
                case "LIVE" -> {
                    // 10초 스코어 폴링
                    startTask(liveTask, this::refreshLiveMatchResults, Duration.ofSeconds(10));
                    // 5분마다 라인업 미수집 경기 재시도 (킥오프 후 늦게 공개되는 경우 대응)
                    startTask(lineupTask, this::refreshLineupsForLiveMatches, Duration.ofMinutes(5));
                }
                case "LINEUP" -> {
                    cancelTask(liveTask);
                    startTask(lineupTask, this::refreshLineups, Duration.ofMinutes(5));
                }
                case "IDLE" -> {
                    cancelTask(liveTask);
                    cancelTask(lineupTask);
                }
            }
            currentMode = targetMode;
        } catch (Exception e) {
            log.error("[Scheduler] modeController 오류: {}", e.getMessage());
        }
    }

    private void startTask(AtomicReference<ScheduledFuture<?>> ref, Runnable task, Duration interval) {
        ScheduledFuture<?> existing = ref.get();
        if (existing != null && !existing.isDone() && !existing.isCancelled()) return;
        ref.set(taskScheduler.scheduleWithFixedDelay(task, interval));
    }

    private void cancelTask(AtomicReference<ScheduledFuture<?>> ref) {
        ScheduledFuture<?> task = ref.getAndSet(null);
        if (task != null && !task.isDone()) task.cancel(false);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // LIVE 모드
    // ═══════════════════════════════════════════════════════════════════════

    /** live=all 1콜로 진행 중인 모든 경기 스코어 갱신 */
    @Transactional
    public void refreshLiveMatchResults() {
        try {
            ApiFootballFixturesResponse response = apiFootballClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/fixtures")
                            .queryParam("league", leagueId)
                            .queryParam("season", season)
                            .queryParam("live", "all")
                            .build())
                    .retrieve()
                    .bodyToMono(ApiFootballFixturesResponse.class)
                    .block();

            if (response == null || response.response() == null || response.response().isEmpty()) {
                log.debug("[Scheduler] 라이브 경기 없음 — 다음 modeController에서 모드 전환 예정");
                return;
            }

            log.info("[Scheduler] 라이브 갱신 {} 경기 (API 1콜)", response.response().size());
            for (var item : response.response()) {
                try {
                    Integer fixtureId = item.fixture().id();
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
                } catch (Exception e) {
                    log.error("[Scheduler] fixture {} 갱신 실패: {}", item.fixture().id(), e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("[Scheduler] 라이브 갱신 실패: {}", e.getMessage());
        }
    }

    /**
     * LIVE 모드 전용: 진행 중인 경기 중 라인업이 없는 경기만 재시도.
     * API-Football은 킥오프 직후 수 분 뒤에 라인업을 공개하는 경우가 있어
     * LINEUP 모드(킥오프 전)에서 수집하지 못했을 때를 대비.
     */
    @Transactional
    public void refreshLineupsForLiveMatches() {
        List<Match> liveMatches = matchRepository.findByStatusShortIn(LIVE_STATUS_CODES);
        for (Match match : liveMatches) {
            if (lineupEntryRepository.existsByFixtureId(match.getFixtureId())) continue;
            try {
                fetchAndSaveLineups(match.getFixtureId());
                log.info("[Scheduler] 라이브 라인업 수집 완료 fixture {}", match.getFixtureId());
            } catch (Exception e) {
                log.error("[Scheduler] 라이브 라인업 조회 실패 fixture {}: {}", match.getFixtureId(), e.getMessage());
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // LINEUP 모드
    // ═══════════════════════════════════════════════════════════════════════

    /** 킥오프 1시간 이내 NS 경기 라인업 조회 */
    @Transactional
    public void refreshLineups() {
        LocalDateTime now  = LocalDateTime.now();
        LocalDateTime from = now.minusHours(1);
        LocalDateTime to   = now.plusHours(1);

        List<Match> targets = matchRepository.findPreMatchOrJustStarted(from, to);
        for (Match match : targets) {
            if (lineupEntryRepository.existsByFixtureId(match.getFixtureId())) continue;
            try {
                fetchAndSaveLineups(match.getFixtureId());
            } catch (Exception e) {
                log.error("[Scheduler] 라인업 조회 실패 fixture {}: {}", match.getFixtureId(), e.getMessage());
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 고정 주기 스케줄 (모드 무관 항상 실행)
    // ═══════════════════════════════════════════════════════════════════════

    @Scheduled(fixedDelay = 600_000)   // 10분
    @Transactional
    public void refreshStandings() {
        try {
            ApiFootballStandingsResponse response = apiFootballClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/standings")
                            .queryParam("league", leagueId)
                            .queryParam("season", season)
                            .build())
                    .retrieve()
                    .bodyToMono(ApiFootballStandingsResponse.class)
                    .block();

            if (response == null || response.response() == null || response.response().isEmpty()) {
                log.debug("[Scheduler] Standings: 데이터 없음");
                return;
            }

            var leagueData = response.response().get(0).league();
            if (leagueData == null || leagueData.standings() == null) return;

            int count = 0;
            for (var group : leagueData.standings()) {
                for (var entry : group) {
                    if (entry.team() == null || entry.team().id() == null) continue;
                    fetchStandingsStep.upsertStanding(entry);
                    count++;
                }
            }
            log.debug("[Scheduler] Standings 갱신 완료 — {}개", count);
        } catch (Exception e) {
            log.error("[Scheduler] Standings 갱신 실패: {}", e.getMessage());
        }
    }

    @Scheduled(fixedDelay = 1_800_000) // 30분
    public void refreshInjuries() {
        try {
            fetchInjuriesStep.fetchAndRefresh();
            log.debug("[Scheduler] Injuries 갱신 완료");
        } catch (Exception e) {
            log.error("[Scheduler] Injuries 갱신 실패: {}", e.getMessage());
        }
    }

    @Scheduled(fixedDelay = 1_800_000) // 30분
    public void refreshPlayerRatings() {
        try {
            fetchPlayerRatingsStep.fetchAndRefresh();
            log.debug("[Scheduler] PlayerRatings 갱신 완료");
        } catch (Exception e) {
            log.error("[Scheduler] PlayerRatings 갱신 실패: {}", e.getMessage());
        }
    }

    @Scheduled(fixedDelay = 21_600_000) // 6시간
    public void refreshPredictions() {
        try {
            fetchPredictionsStep.fetchAndRefresh();
            log.debug("[Scheduler] Predictions 갱신 완료");
        } catch (Exception e) {
            log.error("[Scheduler] Predictions 갱신 실패: {}", e.getMessage());
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Public methods (컨트롤러 수동 트리거)
    // ═══════════════════════════════════════════════════════════════════════

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

        lineupEntryRepository.deleteByFixtureId(fixtureId);

        for (ApiFootballLineupsResponse.LineupItem teamLineup : response.response()) {
            var teamInfo     = teamLineup.team();
            String formation = teamLineup.formation();

            saveSlots(fixtureId, teamInfo.id(), teamInfo.name(), formation,
                      teamLineup.startXI(), false);
            saveSlots(fixtureId, teamInfo.id(), teamInfo.name(), formation,
                      teamLineup.substitutes(), true);
        }
        log.info("[Scheduler] 라인업 저장 완료 fixture {}", fixtureId);
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
