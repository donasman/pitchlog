package com.pitchlog.batch.step;

import com.pitchlog.batch.dto.ApiFootballH2HResponse;
import com.pitchlog.domain.entity.H2HRecord;
import com.pitchlog.domain.entity.Match;
import com.pitchlog.domain.repository.H2HRecordRepository;
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

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Step 10. 월드컵 경기 맞대결(H2H) 기록 수집.
 *
 * GET /fixtures/headtohead?h2h={t1}-{t2}&last=10 — 경기 고유 팀 페어마다 1콜.
 * 이미 수집된 팀 페어는 스킵.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FetchH2HStep {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final WebClient apiFootballClient;
    private final MatchRepository matchRepository;
    private final H2HRecordRepository h2hRecordRepository;

    public Step step() {
        return new StepBuilder("fetchH2HStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    log.info("[FetchH2HStep] H2H 수집 시작");
                    fetchAndRefresh();
                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }

    public void fetchAndRefresh() {
        List<Match> matches = matchRepository.findAllByOrderByMatchDateAsc()
                .stream()
                .filter(m -> m.getHomeTeamApiId() != null && m.getAwayTeamApiId() != null)
                .filter(m -> m.getFixtureId() != null && m.getFixtureId() < 1_000_000)
                .toList();

        // 팀 페어 중복 제거
        Set<String> processed = new HashSet<>();
        int saved = 0;

        for (Match match : matches) {
            String pair = H2HRecord.buildPair(match.getHomeTeamApiId(), match.getAwayTeamApiId());
            if (processed.contains(pair)) continue;
            if (h2hRecordRepository.existsByTeamPair(pair)) {
                processed.add(pair);
                continue;
            }

            try {
                Thread.sleep(6_000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }

            int count = fetchH2HForPair(match.getHomeTeamApiId(), match.getAwayTeamApiId(), pair);
            saved += count;
            processed.add(pair);
        }
        log.info("[FetchH2HStep] 완료 — {}건 H2H 저장", saved);
    }

    private int fetchH2HForPair(Integer t1, Integer t2, String pair) {
        String h2hParam = t1 + "-" + t2;

        ApiFootballH2HResponse response = apiFootballClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/fixtures/headtohead")
                        .queryParam("h2h", h2hParam)
                        .queryParam("last", 10)
                        .build())
                .retrieve()
                .bodyToMono(ApiFootballH2HResponse.class)
                .block();

        if (response == null || response.response() == null || response.response().isEmpty()) {
            log.debug("[FetchH2HStep] pair={} 응답 없음", pair);
            return 0;
        }

        int count = 0;
        for (var item : response.response()) {
            if (item.fixture() == null || item.fixture().id() == null) continue;
            if (h2hRecordRepository.findByFixtureId(item.fixture().id()).isPresent()) continue;

            var teams  = item.teams();
            var goals  = item.goals();
            var league = item.league();

            LocalDateTime matchDate = null;
            if (item.fixture().date() != null) {
                try {
                    matchDate = OffsetDateTime.parse(item.fixture().date()).toLocalDateTime();
                } catch (Exception ignored) {}
            }

            String statusShort = item.fixture().status() != null
                    ? item.fixture().status().shortCode() : null;

            h2hRecordRepository.save(H2HRecord.create(
                    item.fixture().id(),
                    pair,
                    teams != null && teams.home() != null ? teams.home().id()   : null,
                    teams != null && teams.home() != null ? teams.home().name() : null,
                    teams != null && teams.home() != null ? teams.home().logo() : null,
                    teams != null && teams.away() != null ? teams.away().id()   : null,
                    teams != null && teams.away() != null ? teams.away().name() : null,
                    teams != null && teams.away() != null ? teams.away().logo() : null,
                    goals != null ? goals.home() : null,
                    goals != null ? goals.away() : null,
                    matchDate,
                    statusShort,
                    league != null ? league.name() : null
            ));
            count++;
        }
        return count;
    }
}
