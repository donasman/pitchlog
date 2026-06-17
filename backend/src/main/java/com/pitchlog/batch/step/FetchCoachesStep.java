package com.pitchlog.batch.step;

import com.pitchlog.batch.dto.ApiFootballCoachResponse;
import com.pitchlog.domain.entity.Coach;
import com.pitchlog.domain.entity.Country;
import com.pitchlog.domain.repository.CoachRepository;
import com.pitchlog.domain.repository.CountryRepository;
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

/**
 * Step 7. 2026 FIFA 월드컵 참가국 감독 정보 수집.
 *
 * GET /coachs?team={teamApiId} — 참가국 수만큼 반복 호출.
 * team_api_id UNIQUE 기준 upsert. 호출 간 6초 대기.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FetchCoachesStep {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final WebClient apiFootballClient;
    private final CountryRepository countryRepository;
    private final CoachRepository coachRepository;

    public Step step() {
        return new StepBuilder("fetchCoachesStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    log.info("[FetchCoachesStep] 감독 정보 수집 시작");
                    fetchAndRefresh();
                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }

    /** 스케줄러에서도 호출 가능 */
    public void fetchAndRefresh() {
        List<Country> countries = countryRepository.findAll().stream()
                .filter(c -> c.getTeamApiId() != null)
                .toList();

        log.info("[FetchCoachesStep] 처리 대상 국가 {}개", countries.size());

        int saved = 0;
        for (Country country : countries) {
            try {
                Thread.sleep(6_000); // 레이트 리밋
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }

            ApiFootballCoachResponse response = apiFootballClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/coachs")
                            .queryParam("team", country.getTeamApiId())
                            .build())
                    .retrieve()
                    .bodyToMono(ApiFootballCoachResponse.class)
                    .block();

            if (response == null || response.response() == null || response.response().isEmpty()) {
                log.debug("[FetchCoachesStep] 감독 없음 — team={}", country.getTeamApiId());
                continue;
            }

            // 현역 감독은 첫 번째 항목
            ApiFootballCoachResponse.CoachItem item = response.response().get(0);
            if (item.name() == null) continue;

            String birthDate = item.birth() != null ? item.birth().date() : null;
            String teamName  = item.team()  != null ? item.team().name()  : country.getName();
            String teamLogo  = item.team()  != null ? item.team().logo()  : country.getFlagUrl();

            coachRepository.findByTeamApiId(country.getTeamApiId())
                    .ifPresentOrElse(
                            existing -> existing.update(
                                    item.id(), teamName, teamLogo,
                                    item.name(), item.firstname(), item.lastname(),
                                    item.nationality(), birthDate, item.photo()
                            ),
                            () -> coachRepository.save(Coach.create(
                                    item.id(), country.getTeamApiId(), teamName, teamLogo,
                                    item.name(), item.firstname(), item.lastname(),
                                    item.nationality(), birthDate, item.photo()
                            ))
                    );
            saved++;
            log.debug("[FetchCoachesStep] {} — {} 저장", country.getName(), item.name());
        }

        log.info("[FetchCoachesStep] 완료 — {}개국 감독 저장", saved);
    }
}
