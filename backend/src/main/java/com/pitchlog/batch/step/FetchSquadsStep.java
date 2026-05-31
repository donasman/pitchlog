package com.pitchlog.batch.step;

import com.pitchlog.batch.dto.ApiFootballPlayerStatsResponse;
import com.pitchlog.domain.entity.Country;
import com.pitchlog.domain.entity.Player;
import com.pitchlog.domain.entity.PlayerSeasonStats;
import com.pitchlog.domain.entity.SquadEntry;
import com.pitchlog.domain.repository.CountryRepository;
import com.pitchlog.domain.repository.PlayerRepository;
import com.pitchlog.domain.repository.PlayerSeasonStatsRepository;
import com.pitchlog.domain.repository.SquadEntryRepository;
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

/**
 * Step 2. WC 출전 선수 전체를 리그 기준으로 수집해
 *         players + squad_entries + player_season_stats 테이블에 Upsert.
 *
 * 엔드포인트: GET /players?league={leagueId}&season={wcSeason}&page={n}
 * - 팀 기준(/players?team)은 Free 플랜에서 국가대표팀 데이터 미지원
 * - 리그 기준은 WC 출전 전체 선수를 페이지 단위(20명)로 반환
 * - 각 선수 statistics[].team으로 국가 매핑 가능
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FetchSquadsStep {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final WebClient apiFootballClient;
    private final CountryRepository countryRepository;
    private final PlayerRepository playerRepository;
    private final PlayerSeasonStatsRepository playerSeasonStatsRepository;
    private final SquadEntryRepository squadEntryRepository;

    @Value("${api-football.wc-league-id:1}")
    private Integer leagueId;

    @Value("${api-football.season:2026}")
    private Integer wcSeason;

    /**
     * 최대 수집 페이지 수 (-1 = 전체)
     * Free 플랜 100콜/일 기준 로컬 테스트: 3페이지(60명) 권장
     */
    @Value("${api-football.squad-max-pages:3}")
    private int squadMaxPages;

    public Step step() {
        return new StepBuilder("fetchSquadsStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    log.info("[FetchSquadsStep] 시작 — league={}, season={}, maxPages={}",
                            leagueId, wcSeason, squadMaxPages < 0 ? "전체" : squadMaxPages);

                    int page = 1;
                    int totalSaved = 0;
                    int maxPages = squadMaxPages < 1 ? Integer.MAX_VALUE : squadMaxPages;

                    while (page <= maxPages) {
                        final int currentPage = page;

                        // 호출 간 6초 대기 (Free 플랜 레이트 리밋)
                        try { Thread.sleep(6_000); } catch (InterruptedException e) {
                            Thread.currentThread().interrupt();
                            break;
                        }

                        ApiFootballPlayerStatsResponse response = apiFootballClient.get()
                                .uri(uriBuilder -> uriBuilder
                                        .path("/players")
                                        .queryParam("league", leagueId)
                                        .queryParam("season", wcSeason)
                                        .queryParam("page", currentPage)
                                        .build())
                                .retrieve()
                                .bodyToMono(ApiFootballPlayerStatsResponse.class)
                                .block();

                        if (response == null || response.response() == null || response.response().isEmpty()) {
                            log.info("[FetchSquadsStep] page={} 응답 없음 — 수집 종료", page);
                            break;
                        }

                        log.info("[FetchSquadsStep] page={} — {}명 수신", page, response.response().size());

                        for (ApiFootballPlayerStatsResponse.PlayerStatsItem item : response.response()) {
                            if (item.player() == null || item.player().id() == null) continue;

                            Player player = upsertPlayer(item.player());

                            if (item.statistics() != null) {
                                for (ApiFootballPlayerStatsResponse.StatisticsDetail stat : item.statistics()) {
                                    upsertStats(player, stat);
                                    upsertSquadEntry(player, stat);
                                }
                            }
                            totalSaved++;
                        }

                        // 응답이 20명 미만이면 마지막 페이지
                        if (response.response().size() < 20) break;
                        page++;
                    }

                    log.info("[FetchSquadsStep] 완료 — 총 {}명 처리 ({}페이지)", totalSaved, page);
                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }

    // ─── 헬퍼 ────────────────────────────────────────────────────────────────

    private Player upsertPlayer(ApiFootballPlayerStatsResponse.PlayerDetail detail) {
        return playerRepository.findByApiPlayerId(detail.id())
                .orElseGet(() -> playerRepository.save(
                        Player.create(
                                detail.id(),
                                detail.name(),
                                detail.firstname(),
                                detail.lastname(),
                                detail.nationality(),
                                null,
                                detail.height(),
                                detail.weight(),
                                detail.photo()
                        )
                ));
    }

    private void upsertSquadEntry(Player player, ApiFootballPlayerStatsResponse.StatisticsDetail stat) {
        if (stat.team() == null || stat.team().id() == null) return;

        countryRepository.findByTeamApiId(stat.team().id()).ifPresent(country ->
                squadEntryRepository.findByPlayerIdAndCountryId(player.getId(), country.getId())
                        .ifPresentOrElse(
                                existing -> existing.update(existing.getJerseyNumber(), existing.getPosition(), true),
                                () -> squadEntryRepository.save(SquadEntry.create(player, country, null, null))
                        )
        );
    }

    private void upsertStats(Player player, ApiFootballPlayerStatsResponse.StatisticsDetail stat) {
        if (stat.team() == null || stat.league() == null) return;
        Integer teamApiId   = stat.team().id();
        Integer leagueApiId = stat.league().id();
        Integer season      = stat.league().season();
        if (teamApiId == null || leagueApiId == null || season == null) return;

        Double  rating           = parseRating(stat.games() != null ? stat.games().rating() : null);
        Integer appearances      = stat.games()    != null ? stat.games().appearances()        : null;
        Integer lineups          = stat.games()    != null ? stat.games().lineups()            : null;
        Integer minutes          = stat.games()    != null ? stat.games().minutes()            : null;
        Integer goals            = stat.goals()    != null ? stat.goals().total()              : null;
        Integer assists          = stat.goals()    != null ? stat.goals().assists()            : null;
        Integer saves            = stat.goals()    != null ? stat.goals().saves()              : null;
        Integer yellow           = stat.cards()    != null ? stat.cards().yellow()             : null;
        Integer red              = stat.cards()    != null ? stat.cards().red()                : null;
        Integer passesTotal      = stat.passes()   != null ? stat.passes().total()             : null;
        Integer passesAccuracy   = stat.passes()   != null ? stat.passes().accuracy()          : null;
        Integer shotsTotal       = stat.shots()    != null ? stat.shots().total()              : null;
        Integer shotsOn          = stat.shots()    != null ? stat.shots().on()                 : null;
        Integer dribblesAttempts = stat.dribbles() != null ? stat.dribbles().attempts()        : null;
        Integer dribblesSuccess  = stat.dribbles() != null ? stat.dribbles().success()         : null;
        Integer tacklesTotal     = stat.tackles()  != null ? stat.tackles().total()            : null;
        Integer interceptions    = stat.tackles()  != null ? stat.tackles().interceptions()    : null;
        Integer duelsTotal       = stat.duels()    != null ? stat.duels().total()              : null;
        Integer duelsWon         = stat.duels()    != null ? stat.duels().won()                : null;
        Integer foulsCommitted   = stat.fouls()    != null ? stat.fouls().committed()          : null;
        Integer foulsDrawn       = stat.fouls()    != null ? stat.fouls().drawn()              : null;

        playerSeasonStatsRepository
                .findByPlayerIdAndTeamApiIdAndLeagueApiIdAndSeasonYear(
                        player.getId(), teamApiId, leagueApiId, season)
                .ifPresentOrElse(
                        existing -> existing.updateStats(
                                appearances, lineups, minutes, goals, assists, saves,
                                yellow, red, rating,
                                passesTotal, passesAccuracy, shotsTotal, shotsOn,
                                dribblesAttempts, dribblesSuccess, tacklesTotal, interceptions,
                                duelsTotal, duelsWon, foulsCommitted, foulsDrawn),
                        () -> {
                            PlayerSeasonStats s = PlayerSeasonStats.create(
                                    player, teamApiId, stat.team().name(),
                                    leagueApiId, stat.league().name(), season);
                            s.updateStats(
                                    appearances, lineups, minutes, goals, assists, saves,
                                    yellow, red, rating,
                                    passesTotal, passesAccuracy, shotsTotal, shotsOn,
                                    dribblesAttempts, dribblesSuccess, tacklesTotal, interceptions,
                                    duelsTotal, duelsWon, foulsCommitted, foulsDrawn);
                            playerSeasonStatsRepository.save(s);
                        }
                );
    }

    private Double parseRating(String rating) {
        if (rating == null || rating.isBlank()) return null;
        try { return Double.parseDouble(rating); } catch (NumberFormatException e) { return null; }
    }
}
