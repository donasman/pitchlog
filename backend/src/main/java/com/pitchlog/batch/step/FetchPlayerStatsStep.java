package com.pitchlog.batch.step;

import com.pitchlog.batch.dto.ApiFootballPlayerStatsResponse;
import com.pitchlog.batch.dto.ApiFootballPlayerStatsResponse.StatisticsDetail;
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
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.List;

/**
 * Step 3. 월드컵 스쿼드에 포함된 선수의 클럽 시즌 통계를 수집해
 *         players 정보 보완 + player_season_stats 테이블에 Upsert.
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

    @Value("${api-football.player-stats-season:2025}")
    private int seasonYear;

    @Value("${api-football.player-stats-limit:-1}")
    private int playerStatsLimit;

    /** API 호출 간격 (ms). 기본 6초 — 분당 10콜 제한 대응 */
    @Value("${api-football.call-interval-ms:6000}")
    private long callIntervalMs;

    public Step step() {
        return new StepBuilder("fetchPlayerStatsStep", jobRepository)
                .<Player, ApiFootballPlayerStatsResponse.PlayerStatsItem>chunk(50, transactionManager)
                .reader(lazyPlayerReader())
                .processor(statsProcessor())
                .writer(statsWriter())
                .build();
    }

    // ─── Reader ──────────────────────────────────────────────────────────────

    /**
     * Step 실행 시점에 DB를 조회하는 Lazy Reader.
     * FetchSquadsStep 완료 후 squad_entries가 채워진 시점에 조회한다.
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

                    List<Player> targets = (playerStatsLimit > 0 && playerStatsLimit < players.size())
                            ? players.subList(0, playerStatsLimit)
                            : players;

                    log.info("[FetchPlayerStatsStep] 통계 수집 대상: {}명 (전체: {}명, limit: {})",
                            targets.size(), players.size(), playerStatsLimit < 0 ? "없음" : playerStatsLimit);
                    iterator = targets.iterator();
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

            try {
                Thread.sleep(callIntervalMs);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }

            ApiFootballPlayerStatsResponse response = apiFootballClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/players")
                            .queryParam("id", player.getApiPlayerId())
                            .queryParam("season", seasonYear)
                            .build())
                    .retrieve()
                    .bodyToMono(ApiFootballPlayerStatsResponse.class)
                    .block();

            // 현재 시즌 응답 없으면 이전 시즌으로 fallback (은퇴/미소속 선수 기본정보 보완)
            if (response == null || response.response() == null || response.response().isEmpty()) {
                log.info("[FetchPlayerStatsStep] {} 시즌 응답 없음, {} 시즌으로 재시도: apiId={}",
                        seasonYear, seasonYear - 1, player.getApiPlayerId());
                try {
                    Thread.sleep(callIntervalMs);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                response = apiFootballClient.get()
                        .uri(uriBuilder -> uriBuilder
                                .path("/players")
                                .queryParam("id", player.getApiPlayerId())
                                .queryParam("season", seasonYear - 1)
                                .build())
                        .retrieve()
                        .bodyToMono(ApiFootballPlayerStatsResponse.class)
                        .block();

                if (response == null || response.response() == null || response.response().isEmpty()) {
                    log.warn("[FetchPlayerStatsStep] 응답 없음 (fallback 포함): apiId={}", player.getApiPlayerId());
                    return null;
                }
            }

            return response.response().get(0);
        };
    }

    // ─── Writer ──────────────────────────────────────────────────────────────

    private ItemWriter<ApiFootballPlayerStatsResponse.PlayerStatsItem> statsWriter() {
        return items -> {
            for (ApiFootballPlayerStatsResponse.PlayerStatsItem item : items) {
                if (item.player() == null || item.player().id() == null) continue;
                updatePlayerDetail(item.player());
                if (item.statistics() != null) {
                    item.statistics().forEach(stat -> upsertSeasonStats(item.player().id(), stat));
                }
            }
        };
    }

    // ─── Player 상세정보 업데이트 ─────────────────────────────────────────────

    private void updatePlayerDetail(ApiFootballPlayerStatsResponse.PlayerDetail detail) {
        playerRepository.findByApiPlayerId(detail.id()).ifPresent(player -> {
            player.update(
                    detail.name(),
                    detail.firstname(),
                    detail.lastname(),
                    detail.nationality(),
                    parseBirthDate(detail.birth()),
                    detail.height(),
                    detail.weight(),
                    detail.photo()
            );
            log.debug("[FetchPlayerStatsStep] Player 업데이트: {} (id={})", detail.name(), detail.id());
        });
    }

    // ─── PlayerSeasonStats Upsert ─────────────────────────────────────────────

    private void upsertSeasonStats(Integer apiPlayerId, StatisticsDetail stat) {
        if (stat.team() == null || stat.league() == null) return;

        Integer teamApiId   = stat.team().id();
        Integer leagueApiId = stat.league().id();
        Integer season      = stat.league().season();
        if (teamApiId == null || leagueApiId == null || season == null) return;

        playerRepository.findByApiPlayerId(apiPlayerId).ifPresent(player -> {
            PlayerSeasonStats.StatsValues values = extractStats(stat);

            playerSeasonStatsRepository
                    .findByPlayerIdAndTeamApiIdAndLeagueApiIdAndSeasonYear(
                            player.getId(), teamApiId, leagueApiId, season)
                    .ifPresentOrElse(
                            existing -> {
                                existing.updateStats(values);
                                log.debug("[FetchPlayerStatsStep] stats 업데이트: player={}, league={}",
                                        player.getId(), stat.league().name());
                            },
                            () -> {
                                PlayerSeasonStats newStats = PlayerSeasonStats.create(
                                        player, teamApiId, stat.team().name(),
                                        leagueApiId, stat.league().name(), season);
                                newStats.updateStats(values);
                                playerSeasonStatsRepository.save(newStats);
                                log.debug("[FetchPlayerStatsStep] stats 신규 생성: player={}, league={}",
                                        player.getId(), stat.league().name());
                            }
                    );
        });
    }

    /** API 응답에서 통계 값만 추출해 값 객체로 반환 */
    private PlayerSeasonStats.StatsValues extractStats(StatisticsDetail stat) {
        return new PlayerSeasonStats.StatsValues(
                stat.games()    != null ? stat.games().appearances()     : null,
                stat.games()    != null ? stat.games().lineups()         : null,
                stat.games()    != null ? stat.games().minutes()         : null,
                stat.goals()    != null ? stat.goals().total()           : null,
                stat.goals()    != null ? stat.goals().assists()         : null,
                stat.goals()    != null ? stat.goals().saves()           : null,
                stat.cards()    != null ? stat.cards().yellow()          : null,
                stat.cards()    != null ? stat.cards().red()             : null,
                parseRating(stat.games() != null ? stat.games().rating() : null),
                stat.passes()   != null ? stat.passes().total()          : null,
                stat.passes()   != null ? stat.passes().accuracy()       : null,
                stat.shots()    != null ? stat.shots().total()           : null,
                stat.shots()    != null ? stat.shots().on()              : null,
                stat.dribbles() != null ? stat.dribbles().attempts()     : null,
                stat.dribbles() != null ? stat.dribbles().success()      : null,
                stat.tackles()  != null ? stat.tackles().total()         : null,
                stat.tackles()  != null ? stat.tackles().interceptions() : null,
                stat.duels()    != null ? stat.duels().total()           : null,
                stat.duels()    != null ? stat.duels().won()             : null,
                stat.fouls()    != null ? stat.fouls().committed()       : null,
                stat.fouls()    != null ? stat.fouls().drawn()           : null
        );
    }

    // ─── 파싱 헬퍼 ────────────────────────────────────────────────────────────

    private LocalDate parseBirthDate(ApiFootballPlayerStatsResponse.BirthDetail birth) {
        if (birth == null || birth.date() == null || birth.date().isBlank()) return null;
        try {
            return LocalDate.parse(birth.date());
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
