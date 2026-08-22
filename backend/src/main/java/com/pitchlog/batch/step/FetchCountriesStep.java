package com.pitchlog.batch.step;

import com.pitchlog.batch.dto.ApiFootballTeamsResponse;
import com.pitchlog.domain.entity.Country;
import com.pitchlog.domain.repository.CountryRepository;
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
 * Step 1. 2026 FIFA 월드컵 48개 참가국 정보를 수집해 countries 테이블에 Upsert.
 *
 * GET /teams?league=1&season=2026 을 사용한다.
 * - team.code 가 3자리 코드(BEL, KOR 등)이므로 별도 매핑 불필요
 * - team.id 를 team_api_id 로 저장 → FetchSquadsStep 에서 하드코딩 없이 사용
 * - team.logo 를 flag_url 로 저장
 *
 * league=1, season=2026 이 FIFA 월드컵 2026의 공식 식별자.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FetchCountriesStep {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final WebClient apiFootballClient;
    private final CountryRepository countryRepository;

    /** API-Football FIFA 월드컵 식별자
     *  wc-league-id=1, season=2026 (2026 북중미 WC — Pro 플랜 이상 필요)
     *  Free 플랜은 2022~2024 시즌만 접근 가능하다.
     */
    @Value("${api-football.wc-league-id:1}")
    private Integer leagueId;

    @Value("${api-football.season:2026}")
    private Integer season;

    public Step step() {
        return new StepBuilder("fetchCountriesStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    log.info("[FetchCountriesStep] 참가국 수집 시작 — league={}, season={}",
                            leagueId, season);

                    ApiFootballTeamsResponse response = apiFootballClient.get()
                            .uri(uriBuilder -> uriBuilder
                                    .path("/teams")
                                    .queryParam("league", leagueId)
                                    .queryParam("season", season)
                                    .build())
                            .retrieve()
                            .bodyToMono(ApiFootballTeamsResponse.class)
                            .block();

                    if (response == null) {
                        throw new IllegalStateException(
                                "[FetchCountriesStep] API 응답이 null 입니다. 네트워크/엔드포인트를 확인하세요.");
                    }

                    // 에러 확인 (errors 는 [] 또는 {"key":"msg"} 두 형태 모두 가능)
                    if (response.errors() != null) {
                        String errStr = response.errors().toString();
                        if (!errStr.equals("[]") && !errStr.equals("{}")) {
                            // API 키 누락·플랜 제한 등은 여기서 즉시 중단한다.
                            // 예전엔 warn 만 남기고 Job 이 COMPLETED 로 끝나 빈 DB 를 정상으로 착각했다.
                            throw new IllegalStateException(
                                    "[FetchCountriesStep] API 에러: " + errStr
                                    + " — API 키와 구독 플랜(2026 시즌은 Pro 이상)을 확인하세요.");
                        }
                    }
                    log.info("[FetchCountriesStep] results={}, response 크기={}",
                            response.results(),
                            response.response() != null ? response.response().size() : "null");

                    if (response.response() == null || response.response().isEmpty()) {
                        // 참가국 0개로 이후 Step 이 전부 빈손으로 '성공'하는 것을 막는다.
                        throw new IllegalStateException(
                                "[FetchCountriesStep] 참가국을 한 팀도 받지 못했습니다 — "
                                + "league=" + leagueId + ", season=" + season
                                + " 조합과 구독 플랜을 확인하세요.");
                    }

                    log.info("[FetchCountriesStep] API 응답 팀 수: {}", response.response().size());

                    int saved = 0;
                    for (ApiFootballTeamsResponse.TeamEntry entry : response.response()) {
                        ApiFootballTeamsResponse.TeamInfo team = entry.team();
                        if (team == null || team.code() == null || team.code().isBlank()) {
                            log.warn("[FetchCountriesStep] 코드 없는 팀 건너뜀: id={}, name={}",
                                    team != null ? team.id() : "null",
                                    team != null ? team.name() : "null");
                            continue;
                        }
                        upsertCountry(team.code(), team.name(), team.logo(), team.id());
                        saved++;
                    }

                    log.info("[FetchCountriesStep] 완료 — {}개국 저장", saved);
                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }

    private void upsertCountry(String code, String name, String logoUrl, Integer teamApiId) {
        // 1순위: code로 찾기
        var byCode = countryRepository.findByCode(code);
        if (byCode.isPresent()) {
            byCode.get().update(name, logoUrl, null, teamApiId);
            log.debug("[FetchCountriesStep] 업데이트(code): {} (code={}, teamId={})", name, code, teamApiId);
            return;
        }

        // 2순위: team_api_id로 찾기 (code가 변경된 경우 대비)
        if (teamApiId != null) {
            var byTeamId = countryRepository.findFirstByTeamApiId(teamApiId);
            if (byTeamId.isPresent()) {
                byTeamId.get().update(name, logoUrl, null, teamApiId);
                log.debug("[FetchCountriesStep] 업데이트(teamApiId): {} (code={}, teamId={})", name, code, teamApiId);
                return;
            }
        }

        // 신규 저장
        countryRepository.save(Country.create(code, name, logoUrl, null, teamApiId));
        log.debug("[FetchCountriesStep] 신규 저장: {} (code={}, teamId={})", name, code, teamApiId);
    }
}
