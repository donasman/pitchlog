package com.pitchlog.batch.job;

import com.pitchlog.batch.step.SyncFinalSquadStep;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 월드컵 최종 엔트리 동기화 Job.
 *
 * 실행 시점: 월드컵 최종 명단 발표 후 1회 수동 트리거
 * 트리거: POST /api/admin/batch/sync-final-squad
 */
@Configuration
@RequiredArgsConstructor
public class SyncFinalSquadJob {

    private final JobRepository jobRepository;
    private final SyncFinalSquadStep syncFinalSquadStep;

    @Bean
    public Job syncFinalSquad() {
        return new JobBuilder("syncFinalSquadJob", jobRepository)
                .start(syncFinalSquadStep.step())
                .build();
    }
}
