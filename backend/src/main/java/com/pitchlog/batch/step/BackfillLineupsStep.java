package com.pitchlog.batch.step;

import com.pitchlog.domain.entity.Match;
import com.pitchlog.domain.repository.MatchLineupEntryRepository;
import com.pitchlog.domain.repository.MatchRepository;
import com.pitchlog.domain.service.MatchSchedulerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;

import java.util.List;
import java.util.Set;

/**
 * 배포 이전에 완료된 경기의 라인업을 일괄 백필한다.
 *
 * MatchSchedulerService.refreshLineups()는 최근 3시간 경기만 처리하므로,
 * 스케줄러 시작 전에 종료된 경기(FT/AET/PEN)의 lineup_entry가 비어 있는 경우
 * 이 Step 으로 일괄 수집한다.
 *
 * 수동 트리거: POST /api/batch/sync-match-results
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class BackfillLineupsStep {

    private static final Set<String> FINISHED_STATUSES = Set.of("FT", "AET", "PEN");

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final MatchRepository matchRepository;
    private final MatchLineupEntryRepository lineupEntryRepository;
    private final MatchSchedulerService matchSchedulerService;

    /** API 호출 간격 (ms). 기본 6초 — 분당 10콜 제한 대응 */
    @Value("${api-football.call-interval-ms:6000}")
    private long callIntervalMs;

    public Step step() {
        return new StepBuilder("backfillLineupsStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    log.info("[BackfillLineupsStep] 라인업 백필 시작");
                    backfill();
                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }

    /**
     * 수동 트리거(Controller)에서도 직접 호출 가능.
     */
    public void backfill() {
        List<Match> targets = matchRepository.findAllByOrderByMatchDateAsc()
                .stream()
                .filter(m -> FINISHED_STATUSES.contains(m.getStatusShort()))
                // 수동 등록 경기(9_000_000+)는 API 라인업이 없으므로 제외.
                // 예전 경계값 1_000_000 은 2026 fixture_id(1.4M~1.6M)를 전부 걸러버렸다.
                .filter(m -> m.getFixtureId() != null && m.getFixtureId() < 9_000_000)
                .filter(m -> !lineupEntryRepository.existsByFixtureId(m.getFixtureId()))
                .toList();

        log.info("[BackfillLineupsStep] 라인업 미수집 종료 경기 {}개", targets.size());
        if (targets.isEmpty()) {
            log.info("[BackfillLineupsStep] 백필 대상 없음 — 완료");
            return;
        }

        int success = 0;
        int failed  = 0;
        for (Match match : targets) {
            try {
                Thread.sleep(callIntervalMs);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.warn("[BackfillLineupsStep] 인터럽트 발생 — 중단");
                break;
            }
            try {
                matchSchedulerService.fetchAndSaveLineups(match.getFixtureId());
                success++;
                log.debug("[BackfillLineupsStep] 라인업 수집 완료: fixtureId={}", match.getFixtureId());
            } catch (Exception e) {
                failed++;
                log.error("[BackfillLineupsStep] 라인업 수집 실패: fixtureId={}, error={}",
                        match.getFixtureId(), e.getMessage());
            }
        }
        log.info("[BackfillLineupsStep] 완료 — 성공 {}개, 실패 {}개", success, failed);
    }
}
