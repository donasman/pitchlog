package com.pitchlog.batch.step;

import com.pitchlog.batch.dto.ApiFootballStandingsResponse;
import com.pitchlog.domain.entity.GroupStanding;
import com.pitchlog.domain.repository.GroupStandingRepository;
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
 * Step 5. 2026 FIFA 월드컵 12개 조 순위를 수집해 group_standings 테이블에 Upsert.
 *
 * GET /standings?league=1&season=2026 — 1회 호출로 전체 48팀 순위 수집.
 * teamApiId 기준 Upsert.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FetchStandingsStep {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final WebClient apiFootballClient;
    private final GroupStandingRepository groupStandingRepository;

    @Value("${api-football.wc-league-id:1}")
    private Integer leagueId;

    @Value("${api-football.season:2026}")
    private Integer season;

    public Step step() {
        return new StepBuilder("fetchStandingsStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    log.info("[FetchStandingsStep] 조 순위 수집 시작 — league={}, season={}",
                            leagueId, season);

                    ApiFootballStandingsResponse response = apiFootballClient.get()
                            .uri(uriBuilder -> uriBuilder
                                    .path("/standings")
                                    .queryParam("league", leagueId)
                                    .queryParam("season", season)
                                    .build())
                            .retrieve()
                            .bodyToMono(ApiFootballStandingsResponse.class)
                            .block();

                    if (response == null || response.response() == null || response.response().isEmpty()) {
                        log.warn("[FetchStandingsStep] 응답 없음 — 플랜 또는 파라미터 확인 필요");
                        return RepeatStatus.FINISHED;
                    }

                    var leagueData = response.response().get(0).league();
                    if (leagueData == null || leagueData.standings() == null) {
                        log.warn("[FetchStandingsStep] standings 데이터 없음");
                        return RepeatStatus.FINISHED;
                    }

                    int saved = 0;
                    for (var group : leagueData.standings()) {
                        for (var entry : group) {
                            if (entry.team() == null || entry.team().id() == null) continue;
                            upsertStanding(entry);
                            saved++;
                        }
                    }

                    log.info("[FetchStandingsStep] 완료 — {}개 항목 저장", saved);
                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }

    public void upsertStanding(ApiFootballStandingsResponse.StandingEntry entry) {
        var team    = entry.team();
        var all     = entry.all();
        var goals   = all != null ? all.goals() : null;

        Integer goalsFor     = goals != null ? goals.goalsFor() : null;
        Integer goalsAgainst = goals != null ? goals.against()  : null;
        Integer played       = all != null ? all.played() : null;
        Integer win          = all != null ? all.win()    : null;
        Integer draw         = all != null ? all.draw()   : null;
        Integer lose         = all != null ? all.lose()   : null;

        groupStandingRepository.findByTeamApiId(team.id()).ifPresentOrElse(
                existing -> existing.update(
                        entry.group(), team.name(), team.logo(),
                        entry.rank(), played, win, draw, lose,
                        goalsFor, goalsAgainst, entry.goalsDiff(),
                        entry.points(), entry.form(), entry.description()),
                () -> groupStandingRepository.save(GroupStanding.create(
                        entry.group(), team.id(), team.name(), team.logo(),
                        entry.rank(), played, win, draw, lose,
                        goalsFor, goalsAgainst, entry.goalsDiff(),
                        entry.points(), entry.form(), entry.description()))
        );
    }
}
