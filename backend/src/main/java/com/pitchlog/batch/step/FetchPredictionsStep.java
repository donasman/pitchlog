package com.pitchlog.batch.step;

import com.pitchlog.batch.dto.ApiFootballPredictionsResponse;
import com.pitchlog.domain.entity.FixturePrediction;
import com.pitchlog.domain.entity.Match;
import com.pitchlog.domain.repository.FixturePredictionRepository;
import com.pitchlog.domain.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

/**
 * Step 9. 다가오는/진행중 경기 예측 수집.
 *
 * GET /predictions?fixture={fixtureId} — 예측 없는 경기마다 1콜.
 * 예측은 경기 시작 전에만 유효 — 종료 경기는 스킵.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FetchPredictionsStep {

    private static final java.util.Set<String> SKIP_STATUSES =
            java.util.Set.of("FT", "AET", "PEN", "CANC", "PST", "ABD");

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final WebClient apiFootballClient;
    private final MatchRepository matchRepository;
    private final FixturePredictionRepository predictionRepository;

    public Step step() {
        return new StepBuilder("fetchPredictionsStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    log.info("[FetchPredictionsStep] 경기 예측 수집 시작");
                    fetchAndRefresh();
                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }

    /** 스케줄러에서도 호출 가능 */
    public void fetchAndRefresh() {
        List<Match> upcoming = matchRepository.findAllByOrderByMatchDateAsc()
                .stream()
                .filter(m -> !SKIP_STATUSES.contains(m.getStatusShort()))
                .filter(m -> m.getFixtureId() != null && m.getFixtureId() < 1_000_000)
                // 이미 예측이 있으면 스킵
                .filter(m -> predictionRepository.findByFixtureId(m.getFixtureId()).isEmpty())
                .toList();

        log.info("[FetchPredictionsStep] 예측 수집 대상 {}경기", upcoming.size());

        int saved = 0;
        for (Match match : upcoming) {
            try {
                Thread.sleep(6_000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }

            if (fetchPredictionForFixture(match)) saved++;
        }
        log.info("[FetchPredictionsStep] 완료 — {}경기 예측 저장", saved);
    }

    private boolean fetchPredictionForFixture(Match match) {
        ApiFootballPredictionsResponse response = apiFootballClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/predictions")
                        .queryParam("fixture", match.getFixtureId())
                        .build())
                .retrieve()
                .bodyToMono(ApiFootballPredictionsResponse.class)
                .block();

        if (response == null || response.response() == null || response.response().isEmpty()) {
            log.debug("[FetchPredictionsStep] fixtureId={} 응답 없음", match.getFixtureId());
            return false;
        }

        var item = response.response().get(0);
        if (item.predictions() == null) return false;

        var pred    = item.predictions();
        var winner  = pred.winner();
        var goals   = pred.goals();
        var percent = pred.percent();

        String winnerName    = winner  != null ? winner.name()    : null;
        String winnerComment = winner  != null ? winner.comment() : null;
        String homeWinPct    = percent != null ? percent.home()   : null;
        String drawPct       = percent != null ? percent.draw()   : null;
        String awayWinPct    = percent != null ? percent.away()   : null;
        String goalsHome     = goals   != null ? goals.home()     : null;
        String goalsAway     = goals   != null ? goals.away()     : null;

        predictionRepository.findByFixtureId(match.getFixtureId())
                .ifPresentOrElse(
                        existing -> existing.update(winnerName, winnerComment,
                                homeWinPct, drawPct, awayWinPct, goalsHome, goalsAway, pred.advice()),
                        () -> predictionRepository.save(FixturePrediction.create(
                                match.getFixtureId(), winnerName, winnerComment,
                                homeWinPct, drawPct, awayWinPct, goalsHome, goalsAway, pred.advice()))
                );

        log.debug("[FetchPredictionsStep] fixtureId={} 예측 저장 — winner={}", match.getFixtureId(), winnerName);
        return true;
    }
}
