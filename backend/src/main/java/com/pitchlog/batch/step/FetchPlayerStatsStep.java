package com.pitchlog.batch.step;

import com.pitchlog.batch.dto.ApiFootballPlayerStatsResponse;
import com.pitchlog.domain.entity.Player;
import com.pitchlog.domain.entity.PlayerSeasonStats;
import com.pitchlog.domain.repository.PlayerRepository;
import com.pitchlog.domain.repository.PlayerSeasonStatsRepository;
import com.pitchlog.domain.repository.SquadEntryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.List;

/**
 * Step 3. 월드컵 스쿼드에 포함된 선수의 클럽 시즌 통계를 수집해
 *         players 정보 보완 + player_season_stats 테이블에 Upsert.
 *
 * - Reader  : squad_entries 에 등록된 선수 목록 (중복 제거)
 * - Processor: GET /players?id={apiPlayerId}&season={SEASON_YEAR}
 * - Writer  : Player 상세정보 업데이트 + PlayerSeasonStats Upsert
 *
 * ※ Free 플랜 100콜/일 제한으로 전체 실행 시 여러 날에 나눠서 실행할 것.
 *   또는 유료 플랜(500콜/일) 이상 권장.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FetchPlayerStatsStep {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final WebClient apiFootballClient;
    private final PlayerRepository playerRepository;
    private final PlayerSeasonStatsRepository playerSeasonStatsRepository;
    private final SquadEntryRepository squadEntryRepository;

    /** 수집 대상 시즌 (2025-26 클럽 시즌 = 2025) */
    private static final int SEASON_YEAR = 2025;

    public Step step() {
        return new StepBuilder("fetchPlayerStatsStep", jobRepository)
                .<Player, ApiFootballPlayerStatsResponse.PlayerStatsItem>chunk(50, transactionManager)
                .reader(lazyPlayerReader())
                .processor(statsProcessor())
                .writer(statsWriter())
                .build();
    }

    /**
     * Step 실행 시점에 DB를 조회하는 Lazy Reader.
     * Step2(FetchSquadsStep) 완료 후 squad_entries 가 채워진 시점에 조회해야 하므로
     * 빈 생성 시점이 아닌 첫 read() 호출 시 초기화한다.
     */
    private ItemReader<Player> lazyPlayerReader() {
        return new ItemReader<>() {
            private java.util.Iterator<Player> iterator;

            @Override
            public Player read() {
                if (iterator == null) {
                    List<Player> players = squadEntryRepository.findAllActive()
                            .stream()
                            .map(entry -> entry.getPlayer())
                            .distinct()
                            .toList();
                    log.info("[FetchPlayerStatsStep] 통계 수집 대상 선수: {}명", players.size());
                    iterator = players.iterator();
                }
                return iterator.hasNext() ? iterator.next() : null;
            }
        };
    }

    // ─── Processor ───────────────────────────────────────────────────────────

    private ItemProcessor<Player, ApiFootballPlayerStatsResponse.PlayerStatsItem> statsProcessor() {
        return player -> {
            log.debug("[FetchPlayerStatsStep] 통계 조회: {} (apiId={})",
                    player.getName(), player.getApiPlayerId());

            // 분당 호출 제한 방지 — 호출 간 6초 대기
            try { Thread.sleep(6_000); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }

            ApiFootballPlayerStatsResponse response = apiFootballClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/players")
                            .queryParam("id", player.getApiPlayerId())
                            .queryParam("season", SEASON_YEAR)
                            .build())
                    .retrieve()
                    .bodyToMono(ApiFootballPlayerStatsResponse.class)
                    .block();

            if (response == null
                    || response.response() == null
                    || response.response().isEmpty()) {
                log.warn("[FetchPlayerStatsStep] 응답 없음: apiId={}", player.getApiPlayerId());
                return null;
            }

            return response.response().get(0);
        };
    }

    // ─── Writer ──────────────────────────────────────────────────────────────

    private ItemWriter<ApiFootballPlayerStatsResponse.PlayerStatsItem> statsWriter() {
        return items -> {
            for (ApiFootballPlayerStatsResponse.PlayerStatsItem item : items) {
                if (item.player() == null || item.player().id() == null) continue;

                // 1. Player 상세정보 보완 (FetchSquadsStep 에서 비워뒀던 필드 채우기)
                updatePlayerDetail(item.player());

                // 2. 시즌별 클럽 통계 Upsert
                if (item.statistics() != null) {
                    for (ApiFootballPlayerStatsResponse.StatisticsDetail stat : item.statistics()) {
                        upsertSeasonStats(item.player().id(), stat);
                    }
                }
            }
        };
    }

    // ─── Player 상세정보 업데이트 ─────────────────────────────────────────────

    private void updatePlayerDetail(ApiFootballPlayerStatsResponse.PlayerDetail detail) {
        playerRepository.findByApiPlayerId(detail.id()).ifPresent(player -> {
            LocalDate birthDate = parseBirthDate(detail.birth());
            player.update(
                    detail.name(),
                    detail.firstname(),
                    detail.lastname(),
                    detail.nationality(),
                    birthDate,
                    detail.height(),
                    detail.weight(),
                    detail.photo()
            );
            log.debug("[FetchPlayerStatsStep] Player 업데이트: {} (id={})",
                    detail.name(), detail.id());
        });
    }

    // ─── PlayerSeasonStats Upsert ─────────────────────────────────────────────

    private void upsertSeasonStats(Integer apiPlayerId,
                                    ApiFootballPlayerStatsResponse.StatisticsDetail stat) {
        if (stat.team() == null || stat.league() == null) return;

        playerRepository.findByApiPlayerId(apiPlayerId).ifPresent(player -> {
            Integer teamApiId   = stat.team().id();
            Integer leagueApiId = stat.league().id();
            Integer season      = stat.league().season();

            if (teamApiId == null || leagueApiId == null || season == null) return;

            Double rating = parseRating(
                    stat.games() != null ? stat.games().rating() : null);

            Integer appearances = stat.games() != null ? stat.games().appearances() : null;
            Integer goals       = stat.goals() != null ? stat.goals().total()       : null;
            Integer assists     = stat.goals() != null ? stat.goals().assists()     : null;
            Integer yellow      = stat.cards() != null ? stat.cards().yellow()      : null;
            Integer red         = stat.cards() != null ? stat.cards().red()         : null;

            playerSeasonStatsRepository
                    .findByPlayerIdAndTeamApiIdAndLeagueApiIdAndSeasonYear(
                            player.getId(), teamApiId, leagueApiId, season)
                    .ifPresentOrElse(
                            existing -> {
                                existing.updateStats(appearances, goals, assists,
                                        yellow, red, rating);
                                log.debug("[FetchPlayerStatsStep] stats 업데이트: player={}, league={}",
                                        player.getId(), stat.league().name());
                            },
                            () -> {
                                PlayerSeasonStats newStats = PlayerSeasonStats.create(
                                        player,
                                        teamApiId,
                                        stat.team().name(),
                                        leagueApiId,
                                        stat.league().name(),
                                        season
                                );
                                newStats.updateStats(appearances, goals, assists,
                                        yellow, red, rating);
                                playerSeasonStatsRepository.save(newStats);
                                log.debug("[FetchPlayerStatsStep] stats 신규 생성: player={}, league={}",
                                        player.getId(), stat.league().name());
                            }
                    );
        });
    }

    // ─── 파싱 헬퍼 ────────────────────────────────────────────────────────────

    private LocalDate parseBirthDate(ApiFootballPlayerStatsResponse.BirthDetail birth) {
        if (birth == null || birth.date() == null || birth.date().isBlank()) return null;
        try {
            return LocalDate.parse(birth.date()); // "YYYY-MM-DD"
        } catch (Exception e) {
            log.warn("[FetchPlayerStatsStep] 생년월일 파싱 실패: {}", birth.date());
            return null;
        }
    }

    private Double parseRating(String rating) {
        if (rating == null || rating.isBlank()) return null;
        try {
            return Double.parseDouble(rating);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
