package com.pitchlog.batch.step;

import com.pitchlog.batch.dto.ApiFootballSquadResponse;
import com.pitchlog.domain.entity.Player;
import com.pitchlog.domain.entity.SquadEntry;
import com.pitchlog.domain.repository.CountryRepository;
import com.pitchlog.domain.repository.PlayerRepository;
import com.pitchlog.domain.repository.SquadEntryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Step 2. 각 참가국의 등록 스쿼드를 /players/squads?team={teamId} 로 수집.
 *
 * 이전 방식(/players?league=1)은 실제 경기 출전 선수만 반환해
 * 대회 초반에 데이터가 없는 문제가 있었음.
 * /players/squads 는 경기 여부 관계없이 등록 명단 전원을 반환.
 *
 * API 콜 수: 48개국 = 48콜 (Free 플랜 100콜/일 내 처리 가능)
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
    private final SquadEntryRepository squadEntryRepository;

    private SquadEntry.Position parsePosition(String pos) {
        if (pos == null) return null;
        return switch (pos.toLowerCase()) {
            case "goalkeeper"           -> SquadEntry.Position.GK;
            case "defender"             -> SquadEntry.Position.DEF;
            case "midfielder"           -> SquadEntry.Position.MID;
            case "attacker", "forward"  -> SquadEntry.Position.FWD;
            default                     -> null;
        };
    }

    public Step step() {
        return new StepBuilder("fetchSquadsStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    var countries = countryRepository.findAll();
                    log.info("[FetchSquadsStep] 스쿼드 수집 시작 — {}개국", countries.size());

                    int totalPlayers = 0;

                    for (var country : countries) {
                        if (country.getTeamApiId() == null) {
                            log.warn("[FetchSquadsStep] teamApiId 없음, 건너뜀: {}", country.getName());
                            continue;
                        }

                        // Free 플랜 레이트 리밋 대기 (6초)
                        try { Thread.sleep(6_000); } catch (InterruptedException e) {
                            Thread.currentThread().interrupt();
                            break;
                        }

                        try {
                            final Integer teamId = country.getTeamApiId();
                            ApiFootballSquadResponse response = apiFootballClient.get()
                                    .uri(uriBuilder -> uriBuilder
                                            .path("/players/squads")
                                            .queryParam("team", teamId)
                                            .build())
                                    .retrieve()
                                    .bodyToMono(ApiFootballSquadResponse.class)
                                    .block();

                            if (response == null || response.response() == null || response.response().isEmpty()) {
                                log.warn("[FetchSquadsStep] {} — 응답 없음", country.getName());
                                continue;
                            }

                            var squadItem = response.response().get(0);
                            if (squadItem.players() == null || squadItem.players().isEmpty()) {
                                log.warn("[FetchSquadsStep] {} — 선수 없음", country.getName());
                                continue;
                            }

                            int saved = 0;
                            for (ApiFootballSquadResponse.PlayerInfo pi : squadItem.players()) {
                                if (pi.id() == null || pi.name() == null) continue;

                                Player player = playerRepository.findByApiPlayerId(pi.id())
                                        .orElseGet(() -> playerRepository.save(
                                                Player.create(
                                                        pi.id(), pi.name(),
                                                        null, null, null, null,
                                                        null, null, pi.photo()
                                                )
                                        ));

                                SquadEntry.Position pos = parsePosition(pi.position());
                                squadEntryRepository.findByPlayerIdAndCountryId(player.getId(), country.getId())
                                        .ifPresentOrElse(
                                                existing -> existing.update(pi.number(), pos, true),
                                                () -> squadEntryRepository.save(
                                                        SquadEntry.create(player, country, pi.number(), pos)
                                                )
                                        );
                                saved++;
                            }

                            totalPlayers += saved;
                            log.info("[FetchSquadsStep] {} — {}명 저장", country.getName(), saved);

                        } catch (Exception e) {
                            log.error("[FetchSquadsStep] {} 처리 실패: {}", country.getName(), e.getMessage());
                        }
                    }

                    log.info("[FetchSquadsStep] 완료 — 총 {}명 처리", totalPlayers);
                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }
}
