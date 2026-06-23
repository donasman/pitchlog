package com.pitchlog.batch.step;

import com.pitchlog.batch.dto.ApiFootballPlayerStatsResponse;
import com.pitchlog.batch.dto.ApiFootballPlayerStatsResponse.PlayerStatsItem;
import com.pitchlog.batch.dto.ApiFootballPlayerStatsResponse.StatisticsDetail;
import com.pitchlog.domain.entity.PlayerSeasonStats;
import com.pitchlog.domain.repository.PlayerRepository;
import com.pitchlog.domain.repository.PlayerSeasonStatsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.List;

/**
 * 월드컵 시즌 선수 통계를 수집한다.
 *
 * GET /players?league={wcLeagueId}&season={wcSeason}&page={n}
 * 100명 단위로 페이지네이션 — 전체 수집에 약 8콜(736명 기준).
 * 기존 FetchPlayerStatsStep(클럽 시즌, 선수당 1콜)과 달리 리그 단위로 효율적 수집.
 *
 * 수집된 데이터는 player_season_stats 테이블에 (leagueApiId=1, seasonYear=2026) 조건으로 Upsert.
 * 수동 트리거: POST /api/batch/sync-wc-player-stats
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FetchWorldCupPlayerStatsStep {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final WebClient apiFootballClient;
    private final PlayerRepository playerRepository;
    private final PlayerSeasonStatsRepository playerSeasonStatsRepository;

    @Value("${api-football.wc-league-id:1}")
    private Integer wcLeagueId;

    @Value("${api-football.season:2026}")
    private Integer wcSeason;

    /** API 호출 간격 (ms). 기본 6초 */
    @Value("${api-football.call-interval-ms:6000}")
    private long callIntervalMs;

    public Step step() {
        return new StepBuilder("fetchWorldCupPlayerStatsStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    log.info("[FetchWorldCupPlayerStatsStep] 월드컵 선수 통계 수집 시작");
                    fetchAndRefresh();
                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }

    /** 수동 트리거(Controller)에서도 직접 호출 가능 */
    public void fetchAndRefresh() {
        int currentPage = 1;
        int totalPages  = 1; // 첫 응답에서 갱신
        int totalPlayers = 0;
        int upserted    = 0;

        do {
            if (currentPage > 1) {
                try { Thread.sleep(callIntervalMs); }
                catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    log.warn("[FetchWorldCupPlayerStatsStep] 인터럽트 발생 — 중단");
                    break;
                }
            }

            final int page = currentPage;
            ApiFootballPlayerStatsResponse response = apiFootballClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/players")
                            .queryParam("league", wcLeagueId)
                            .queryParam("season", wcSeason)
                            .queryParam("page", page)
                            .build())
                    .retrieve()
                    .bodyToMono(ApiFootballPlayerStatsResponse.class)
                    .block();

            if (response == null || response.response() == null || response.response().isEmpty()) {
                log.debug("[FetchWorldCupPlayerStatsStep] page={} 응답 없음 — 종료", page);
                break;
            }

            // 첫 페이지에서 총 페이지 수 갱신
            if (currentPage == 1 && response.paging() != null && response.paging().total() != null) {
                totalPages = response.paging().total();
                log.info("[FetchWorldCupPlayerStatsStep] 총 {}페이지 예상 (league={}, season={})",
                        totalPages, wcLeagueId, wcSeason);
            }

            for (PlayerStatsItem item : response.response()) {
                if (item.player() == null || item.player().id() == null) continue;
                totalPlayers++;
                try {
                    updatePlayerDetail(item);
                    if (item.statistics() != null) {
                        for (StatisticsDetail stat : item.statistics()) {
                            // 월드컵 리그 통계만 저장 (leagueApiId == wcLeagueId)
                            if (stat.league() == null || !wcLeagueId.equals(stat.league().id())) continue;
                            upsertSeasonStats(item.player().id(), stat);
                            upserted++;
                        }
                    }
                } catch (Exception e) {
                    log.error("[FetchWorldCupPlayerStatsStep] 선수 처리 실패 apiId={}: {}",
                            item.player().id(), e.getMessage());
                }
            }

            log.info("[FetchWorldCupPlayerStatsStep] page={}/{} 처리 완료 (누적 {}명 / Upsert {}건)",
                    currentPage, totalPages, totalPlayers, upserted);
            currentPage++;

        } while (currentPage <= totalPages);

        log.info("[FetchWorldCupPlayerStatsStep] 전체 완료 — {}명 조회, {}건 Upsert", totalPlayers, upserted);
    }

    // ─── Player 상세정보 업데이트 ──────────────────────────────────────────────

    @Transactional
    protected void updatePlayerDetail(PlayerStatsItem item) {
        var d = item.player();
        playerRepository.findByApiPlayerId(d.id()).ifPresent(player -> {
            player.update(
                    d.name(),
                    d.firstname(),
                    d.lastname(),
                    d.nationality(),
                    parseBirthDate(d.birth()),
                    d.height(),
                    d.weight(),
                    d.photo()
            );
        });
    }

    // ─── PlayerSeasonStats Upsert ─────────────────────────────────────────────

    @Transactional
    protected void upsertSeasonStats(Integer apiPlayerId, StatisticsDetail stat) {
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
                            existing -> existing.updateStats(values),
                            () -> {
                                PlayerSeasonStats ns = PlayerSeasonStats.create(
                                        player, teamApiId, stat.team().name(),
                                        leagueApiId, stat.league().name(), season);
                                ns.updateStats(values);
                                playerSeasonStatsRepository.save(ns);
                            }
                    );
        });
    }

    // ─── 통계 추출 ────────────────────────────────────────────────────────────

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
        try { return LocalDate.parse(birth.date()); }
        catch (Exception e) { return null; }
    }

    private Double parseRating(String rating) {
        if (rating == null || rating.isBlank()) return null;
        try { return Double.parseDouble(rating); }
        catch (NumberFormatException e) { return null; }
    }
}
                                          