package com.pitchlog.batch.job;

import com.pitchlog.batch.step.FetchCoachesStep;
import com.pitchlog.batch.step.FetchCountriesStep;
import com.pitchlog.batch.step.FetchH2HStep;
import com.pitchlog.batch.step.FetchInjuriesStep;
import com.pitchlog.batch.step.FetchMatchesStep;
import com.pitchlog.batch.step.FetchOddsStep;
import com.pitchlog.batch.step.FetchPlayerRatingsStep;
import com.pitchlog.batch.step.FetchPlayerStatsStep;
import com.pitchlog.batch.step.FetchPredictionsStep;
import com.pitchlog.batch.step.FetchSquadsStep;
import com.pitchlog.batch.step.FetchStandingsStep;
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
    private final FetchStandingsStep fetchStandingsStep;
    private final FetchInjuriesStep fetchInjuriesStep;
    private final FetchCoachesStep fetchCoachesStep;
    private final FetchPlayerRatingsStep fetchPlayerRatingsStep;
    private final FetchPredictionsStep fetchPredictionsStep;
    private final FetchH2HStep fetchH2HStep;
    private final FetchOddsStep fetchOddsStep;

    /**
     * 전체 파이프라인: Step1(국가) → Step2(스쿼드) → Step3(선수통계) → Step4(경기) → Step5(순위)
     * Step3에서 선수 1명당 API 1콜 소모 → Free 플랜(100콜/일)으로는 전체 실행 불가.
     * 프로덕션 배포 후 1회 실행 용도.
     */
    @Bean
    public Job syncWorldCupPlayers() {
        return new JobBuilder("syncWorldCupPlayersJob", jobRepository)
                .start(fetchCountriesStep.step())
                .next(fetchSquadsStep.step())
                .next(fetchPlayerStatsStep.step())
                .next(fetchMatchesStep.step())
                .next(fetchStandingsStep.step())
                .next(fetchInjuriesStep.step())
                .next(fetchCoachesStep.step())
                .next(fetchPlayerRatingsStep.step())
                .next(fetchPredictionsStep.step())
                .next(fetchH2HStep.step())
                .next(fetchOddsStep.step())
                .build();
    }

    /**
     * 검증용 Lite 파이프라인: Step1(국가) → Step2(스쿼드) → Step4(경기) → Step5(순위) → Step6(부상) → Step7(감독)
     * Step3(선수통계) 제외 — API 콜 최소화.
     * Free 플랜으로 전체 흐름(국가→스쿼드→경기→순위→부상→감독) 검증 시 사용.
     * 엔드포인트: POST /api/batch/sync-players-lite
     */
    @Bean
    public Job syncWorldCupPlayersLite() {
        return new JobBuilder("syncWorldCupPlayersLiteJob", jobRepository)
                .start(fetchCountriesStep.step())
                .next(fetchSquadsStep.step())
                .next(fetchMatchesStep.step())
                .next(fetchStandingsStep.step())
                .next(fetchInjuriesStep.step())
                .next(fetchCoachesStep.step())
                .next(fetchPlayerRatingsStep.step())
                .next(fetchPredictionsStep.step())
                .next(fetchH2HStep.step())
                .next(fetchOddsStep.step())
                .build();
    }
}
