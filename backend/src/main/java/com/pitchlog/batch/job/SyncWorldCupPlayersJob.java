package com.pitchlog.batch.job;

import com.pitchlog.batch.step.FetchCountriesStep;
import com.pitchlog.batch.step.FetchMatchesStep;
import com.pitchlog.batch.step.FetchPlayerStatsStep;
import com.pitchlog.batch.step.FetchSquadsStep;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class SyncWorldCupPlayersJob {

    private final JobRepository jobRepository;
    private final FetchCountriesStep fetchCountriesStep;
    private final FetchSquadsStep fetchSquadsStep;
    private final FetchPlayerStatsStep fetchPlayerStatsStep;
    private final FetchMatchesStep fetchMatchesStep;

    @Bean
    public Job syncWorldCupPlayers() {
        return new JobBuilder("syncWorldCupPlayersJob", jobRepository)
                .start(fetchCountriesStep.step())
                .next(fetchSquadsStep.step())
                .next(fetchPlayerStatsStep.step())
                .next(fetchMatchesStep.step())
                .build();
    }
}
