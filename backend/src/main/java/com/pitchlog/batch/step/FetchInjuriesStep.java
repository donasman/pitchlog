package com.pitchlog.batch.step;

import com.pitchlog.batch.dto.ApiFootballInjuriesResponse;
import com.pitchlog.domain.entity.PlayerInjury;
import com.pitchlog.domain.repository.PlayerInjuryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

/**
 * Step 6. 2026 FIFA 월드컵 부상/출전정지 선수 수집.
 *
 * GET /injuries?league=1&season=2026 — 1회 호출로 전체 수집.
 * 전체 삭제 후 재삽입 방식으로 항상 최신 상태 유지.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FetchInjuriesStep {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final WebClient apiFootballClient;
    private final PlayerInjuryRepository playerInjuryRepository;

    @Value("${api-football.wc-league-id:1}")
    private Integer leagueId;

    @Value("${api-football.season:2026}")
    private Integer season;

    public Step step() {
        return new StepBuilder("fetchInjuriesStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    log.info("[FetchInjuriesStep] 부상/출전정지 수집 시작 — league={}, season={}",
                            leagueId, season);

                    List<ApiFootballInjuriesResponse.InjuryItem> items = fetchFromApi();
                    if (items == null) return RepeatStatus.FINISHED;

                    saveAll(items);
                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }

    /** 스케줄러에서도 호출 가능한 공개 메서드 */
    public void fetchAndRefresh() {
        List<ApiFootballInjuriesResponse.InjuryItem> items = fetchFromApi();
        if (items == null) return;
        saveAll(items);
    }

    // ── 내부 메서드 ───────────────────────────────────────────────────────

    private List<ApiFootballInjuriesResponse.InjuryItem> fetchFromApi() {
        ApiFootballInjuriesResponse response = apiFootballClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/injuries")
                        .queryParam("league", leagueId)
                        .queryParam("season", season)
                        .build())
                .retrieve()
                .bodyToMono(ApiFootballInjuriesResponse.class)
                .block();

        if (response == null || response.response() == null) {
            log.warn("[FetchInjuriesStep] 응답 없음");
            return null;
        }

        if (response.errors() != null) {
            String errStr = response.errors().toString();
            if (!errStr.equals("[]") && !errStr.equals("{}")) {
                log.warn("[FetchInjuriesStep] API 에러: {}", errStr);
            }
        }

        log.info("[FetchInjuriesStep] 수신 {}건", response.response().size());
        return response.response();
    }

    private void saveAll(List<ApiFootballInjuriesResponse.InjuryItem> items) {
        // 전체 삭제 후 재삽입 — 항상 현재 상태 반영
        playerInjuryRepository.deleteAll();

        int saved = 0;
        for (var item : items) {
            var player  = item.player();
            var team    = item.team();
            var fixture = item.fixture();

            if (player == null || player.id() == null) continue;

            Integer    fixtureId   = fixture != null ? fixture.id()        : null;
            LocalDateTime fixtureDate = fixture != null && fixture.timestamp() != null
                    ? LocalDateTime.ofInstant(Instant.ofEpochSecond(fixture.timestamp()), ZoneOffset.UTC)
                    : null;

            playerInjuryRepository.save(PlayerInjury.create(
                    player.id(),
                    player.name(),
                    player.photo(),
                    team != null ? team.id()   : null,
                    team != null ? team.name() : null,
                    team != null ? team.logo() : null,
                    fixtureId,
                    fixtureDate,
                    player.type(),
                    player.reason()
            ));
            saved++;
        }
        log.info("[FetchInjuriesStep] 저장 완료 — {}건", saved);
    }
}
