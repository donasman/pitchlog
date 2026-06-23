package com.pitchlog.batch.job;

import com.pitchlog.batch.step.BackfillLineupsStep;
import com.pitchlog.batch.step.FetchPlayerRatingsStep;
import com.pitchlog.batch.step.FetchWorldCupPlayerStatsStep;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 월드컵 진행 중 과거 경기 결과 데이터를 백필하는 배치 잡.
 *
 * 실행 순서:
 *   Step1. BackfillLineupsStep      — FT 경기 중 lineup_entry 없는 것 일괄 수집
 *   Step2. FetchPlayerRatingsStep   — lineup은 있지만 rating 없는 경기 평점 수집
 *   Step3. FetchWorldCupPlayerStatsStep — /players?league=1&season=2026 페이지네이션 통계 수집
 *
 * 수동 트리거: POST /api/batch/sync-match-results
 *
 * API 콜 예산 (Free 플랜 100콜/일):
 *   - Step1: 라인업 없는 경기 수 × 1콜
 *   - Step2: 평점 없는 경기 수 × 1콜
 *   - Step3: ~8콜 (100명/페이지 기준)
 * → 경기 수에 따라 Free 플랜 초과 가능. Pro 플랜 권장.
 */
@Configuration
@RequiredArgsConstructor
public class SyncMatchResultsJob {

    private final JobRepository jobRepository;
    private final BackfillLineupsStep backfillLineupsStep;
    private final FetchPlayerRatingsStep fetchPlayerRatingsStep;
    private final FetchWorldCupPlayerStatsStep fetchWorldCupPlayerStatsStep;

    @Bean
    public Job syncMatchResults() {
        return new JobBuilder("syncMatchResultsJob", jobRepository)
                .start(backfillLineupsStep.step())
                .next(fetchPlayerRatingsStep.step())
                .next(fetchWorldCupPlayerStatsStep.step())
                .build();
    }
}
