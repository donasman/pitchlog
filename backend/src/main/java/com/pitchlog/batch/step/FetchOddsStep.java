package com.pitchlog.batch.step;

import com.pitchlog.batch.dto.ApiFootballOddsResponse;
import com.pitchlog.domain.entity.FixtureOdds;
import com.pitchlog.domain.entity.Match;
import com.pitchlog.domain.repository.FixtureOddsRepository;
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
import java.util.Set;

/**
 * Step 11. 다가오는 경기 배당(Odds) 수집 — Bet365(bookmaker=1), Match Winner(1X2).
 *
 * GET /odds?fixture={fixtureId}&bookmaker=1
 * - 종료/취소 경기 스킵
 * - 이미 저장된 경기 스킵 (배당은 경기 시작 전에만 의미 있음)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FetchOddsStep {

    private static final Set<String> SKIP_STATUSES =
            Set.of("FT", "AET", "PEN", "CANC", "PST", "ABD");

    private static final int BOOKMAKER_BET365 = 1;
    private static final String BET_MATCH_WINNER = "Match Winner";

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final WebClient apiFootballClient;
    private final MatchRepository matchRepository;
    private final FixtureOddsRepository oddsRepository;

    public Step step() {
        return new StepBuilder("fetchOddsStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    log.info("[FetchOddsStep] 배당 수집 시작");
                    fetchAndRefresh();
                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }

    /** 스케줄러에서도 호출 가능 */
    public void fetchAndRefresh() {
        List<Match> targets = matchRepository.findAllByOrderByMatchDateAsc()
                .stream()
                .filter(m -> !SKIP_STATUSES.contains(m.getStatusShort()))
                .filter(m -> m.getFixtureId() != null && m.getFixtureId() < 1_000_000)
                .filter(m -> !oddsRepository.existsByFixtureId(m.getFixtureId()))
                .toList();

        log.info("[FetchOddsStep] 배당 수집 대상 {}경기", targets.size());

        int saved = 0;
        for (Match match : targets) {
            try {
                Thread.sleep(6_000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }

            if (fetchOddsForFixture(match)) saved++;
        }
        log.info("[FetchOddsStep] 완료 — {}경기 배당 저장", saved);
    }

    private boolean fetchOddsForFixture(Match match) {
        ApiFootballOddsResponse response = apiFootballClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/odds")
                        .queryParam("fixture", match.getFixtureId())
                        .queryParam("bookmaker", BOOKMAKER_BET365)
                        .build())
                .retrieve()
                .bodyToMono(ApiFootballOddsResponse.class)
                .block();

        if (response == null || response.response() == null || response.response().isEmpty()) {
            log.debug("[FetchOddsStep] fixtureId={} 응답 없음", match.getFixtureId());
            return false;
        }

        var item = response.response().get(0);
        if (item.bookmakers() == null || item.bookmakers().isEmpty()) return false;

        // Bet365 북메이커 찾기
        var bookmaker = item.bookmakers().stream()
                .filter(b -> Integer.valueOf(BOOKMAKER_BET365).equals(b.id()))
                .findFirst()
                .orElse(null);
        if (bookmaker == null) return false;

        // "Match Winner" 베팅 찾기
        var bet = bookmaker.bets().stream()
                .filter(b -> BET_MATCH_WINNER.equalsIgnoreCase(b.name()))
                .findFirst()
                .orElse(null);
        if (bet == null || bet.values() == null) return false;

        String homeOdd = extractOdd(bet.values(), "Home");
        String drawOdd = extractOdd(bet.values(), "Draw");
        String awayOdd = extractOdd(bet.values(), "Away");

        if (homeOdd == null && drawOdd == null && awayOdd == null) return false;

        oddsRepository.findByFixtureId(match.getFixtureId())
                .ifPresentOrElse(
                        existing -> existing.update(homeOdd, drawOdd, awayOdd),
                        () -> oddsRepository.save(FixtureOdds.create(
                                match.getFixtureId(),
                                bookmaker.id(), bookmaker.name(),
                                BET_MATCH_WINNER,
                                homeOdd, drawOdd, awayOdd))
                );

        log.debug("[FetchOddsStep] fixtureId={} 배당 저장 — 홈:{} 무:{} 원정:{}",
                match.getFixtureId(), homeOdd, drawOdd, awayOdd);
        return true;
    }

    private String extractOdd(List<ApiFootballOddsResponse.OddsValue> values, String label) {
        return values.stream()
                .filter(v -> label.equalsIgnoreCase(v.label()))
                .map(ApiFootballOddsResponse.OddsValue::odd)
                .findFirst()
                .orElse(null);
    }
}
