package com.pitchlog.batch.step;

import com.pitchlog.batch.dto.ApiFootballFixturesResponse;
import com.pitchlog.domain.entity.Match;
import com.pitchlog.domain.repository.MatchRepository;
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

import java.time.OffsetDateTime;
import java.util.List;

/**
 * API-Football에서 2026 FIFA World Cup 전체 경기 일정을 수집해 DB에 저장한다.
 * <p>
 * API 엔드포인트: GET /fixtures?league={leagueId}&season=2026
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FetchMatchesStep {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager txManager;
    private final WebClient apiFootballClient;
    private final MatchRepository matchRepository;

    @Value("${api-football.wc-league-id:1}")
    private Integer wcLeagueId;

    @Value("${api-football.season:2026}")
    private Integer season;

    public Step step() {
        return new StepBuilder("fetchMatchesStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    log.info("[FetchMatchesStep] Fetching WC fixtures league={} season={}", wcLeagueId, season);

                    ApiFootballFixturesResponse response = apiFootballClient.get()
                            .uri("/fixtures?league={l}&season={s}", wcLeagueId, season)
                            .retrieve()
                            .bodyToMono(ApiFootballFixturesResponse.class)
                            .block();

                    if (response == null || response.response() == null) {
                        log.warn("[FetchMatchesStep] Empty response from API");
                        return RepeatStatus.FINISHED;
                    }

                    List<ApiFootballFixturesResponse.FixtureItem> items = response.response();
                    log.info("[FetchMatchesStep] Received {} fixtures", items.size());

                    int saved = 0, updated = 0;
                    for (ApiFootballFixturesResponse.FixtureItem item : items) {
                        try {
                            upsertMatch(item);
                            saved++;
                        } catch (Exception e) {
                            log.error("[FetchMatchesStep] Error saving fixture {}: {}",
                                    item.fixture().id(), e.getMessage());
                        }
                    }

                    log.info("[FetchMatchesStep] Done. saved/updated={}", saved);
                    return RepeatStatus.FINISHED;
                }, txManager)
                .build();
    }

    private void upsertMatch(ApiFootballFixturesResponse.FixtureItem item) {
        var fixture = item.fixture();
        var league  = item.league();
        var teams   = item.teams();
        var goals   = item.goals();
        var status  = fixture.status();
        var venue   = fixture.venue();

        // ISO 8601 날짜 파싱 (effectively final — 람다 캡처 가능)
        final java.time.LocalDateTime matchDate = fixture.date() != null
                ? OffsetDateTime.parse(fixture.date()).toLocalDateTime()
                : null;

        // round에서 groupName 추출: "Group Stage - 1" → group은 별도 없음, DB에 round 그대로 저장
        // groupName은 country.groupName과 매핑하거나 null 처리
        String groupName = extractGroupName(league.round());

        matchRepository.findByFixtureId(fixture.id()).ifPresentOrElse(
                existing -> existing.updateResult(
                        status.shortCode(), status.longDesc(), status.elapsed(),
                        goals != null ? goals.home() : null,
                        goals != null ? goals.away() : null
                ),
                () -> matchRepository.save(Match.create(
                        fixture.id(),
                        league.round(),
                        matchDate,
                        venue != null ? venue.name() : null,
                        venue != null ? venue.city() : null,
                        status.shortCode(),
                        status.longDesc(),
                        status.elapsed(),
                        teams.home().id(), teams.home().name(), teams.home().logo(),
                        goals != null ? goals.home() : null,
                        teams.away().id(), teams.away().name(), teams.away().logo(),
                        goals != null ? goals.away() : null,
                        groupName
                ))
        );
    }

    /** "Group Stage - 1" → null (그룹 정보는 round 컬럼으로 충분) */
    private String extractGroupName(String round) {
        if (round == null) return null;
        if (round.startsWith("Group")) return round;
        return null;
    }
}
