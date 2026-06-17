package com.pitchlog.batch.step;

import com.pitchlog.batch.dto.ApiFootballFixturePlayersResponse;
import com.pitchlog.domain.entity.Match;
import com.pitchlog.domain.repository.MatchLineupEntryRepository;
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
 * Step 8. 종료 경기 선수 평점 수집.
 *
 * GET /fixtures/players?fixture={fixtureId} — 종료된 경기(statusShort=FT|AET|PEN)마다 1콜.
 * 이미 평점이 수집된 선수(rating != null)가 있는 경기는 스킵.
 * 스케줄러에서도 호출 가능 — 경기 종료 후 30분 간격으로 갱신.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FetchPlayerRatingsStep {

    private static final java.util.Set<String> FINISHED_STATUSES =
            java.util.Set.of("FT", "AET", "PEN");

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final WebClient apiFootballClient;
    private final MatchRepository matchRepository;
    private final MatchLineupEntryRepository matchLineupEntryRepository;

    public Step step() {
        return new StepBuilder("fetchPlayerRatingsStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    log.info("[FetchPlayerRatingsStep] 선수 평점 수집 시작");
                    fetchAndRefresh();
                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }

    /** 스케줄러에서도 호출 가능 */
    public void fetchAndRefresh() {
        List<Match> finishedMatches = matchRepository.findAllByOrderByMatchDateAsc()
                .stream()
                .filter(m -> FINISHED_STATUSES.contains(m.getStatusShort()))
                .filter(m -> m.getFixtureId() != null && m.getFixtureId() < 1_000_000) // 수동 경기 제외
                .toList();

        log.info("[FetchPlayerRatingsStep] 종료 경기 {}개 처리 대상", finishedMatches.size());

        int updated = 0;
        for (Match match : finishedMatches) {
            // 이미 평점이 수집된 경기라면 스킵 (선수 1명이라도 평점 있으면 수집 완료로 간주)
            boolean alreadyRated = matchLineupEntryRepository
                    .findByFixtureIdOrderByTeamApiIdAscSubstituteAscGridAsc(match.getFixtureId())
                    .stream()
                    .anyMatch(e -> e.getRating() != null);

            if (alreadyRated) continue;

            try {
                Thread.sleep(6_000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }

            fetchRatingsForFixture(match.getFixtureId());
            updated++;
        }
        log.info("[FetchPlayerRatingsStep] 완료 — {}경기 평점 수집", updated);
    }

    private void fetchRatingsForFixture(Integer fixtureId) {
        ApiFootballFixturePlayersResponse response = apiFootballClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/fixtures/players")
                        .queryParam("fixture", fixtureId)
                        .build())
                .retrieve()
                .bodyToMono(ApiFootballFixturePlayersResponse.class)
                .block();

        if (response == null || response.response() == null || response.response().isEmpty()) {
            log.debug("[FetchPlayerRatingsStep] fixtureId={} 응답 없음", fixtureId);
            return;
        }

        int count = 0;
        for (var teamData : response.response()) {
            if (teamData.players() == null) continue;
            for (var entry : teamData.players()) {
                if (entry.player() == null || entry.player().id() == null) continue;

                var stats = entry.statistics() != null && !entry.statistics().isEmpty()
                        ? entry.statistics().get(0) : null;

                Double  rating       = parseRating(stats != null && stats.games() != null ? stats.games().rating() : null);
                Integer minutes      = stats != null && stats.games() != null ? stats.games().minutes() : null;
                Integer goals        = stats != null && stats.goals() != null ? stats.goals().total()   : null;
                Integer assists      = stats != null && stats.goals() != null ? stats.goals().assists() : null;

                matchLineupEntryRepository
                        .findByFixtureIdAndPlayerApiId(fixtureId, entry.player().id())
                        .ifPresent(lineup -> {
                            lineup.updateStats(rating, minutes, goals, assists);
                            matchLineupEntryRepository.save(lineup);
                        });
                count++;
            }
        }
        log.debug("[FetchPlayerRatingsStep] fixtureId={} — {}명 평점 처리", fixtureId, count);
    }

    private Double parseRating(String rating) {
        if (rating == null || rating.isBlank()) return null;
        try { return Double.parseDouble(rating); } catch (NumberFormatException e) { return null; }
    }
}
