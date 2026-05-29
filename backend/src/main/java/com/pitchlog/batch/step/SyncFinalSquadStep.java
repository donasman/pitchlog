package com.pitchlog.batch.step;

import com.pitchlog.batch.dto.ApiFootballSquadResponse;
import com.pitchlog.batch.dto.CountrySquadData;
import com.pitchlog.domain.entity.Country;
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
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

/**
 * 최종 엔트리 동기화 Step.
 *
 * 동작 순서 (국가별):
 *  1. 해당 국가의 모든 squad_entry 를 active=false 로 초기화
 *  2. API-Football 에서 최신 스쿼드(최종 26인) 재수집
 *  3. 수집된 선수만 active=true 로 Upsert
 *
 * 월드컵 최종 명단 확정 후(대개 개막 1~2주 전) 1회 실행을 목적으로 합니다.
 * SyncFinalSquadJob 에 단독으로 연결됩니다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SyncFinalSquadStep {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final WebClient apiFootballClient;
    private final CountryRepository countryRepository;
    private final PlayerRepository playerRepository;
    private final SquadEntryRepository squadEntryRepository;

    public Step step() {
        return new StepBuilder("syncFinalSquadStep", jobRepository)
                .<Country, CountrySquadData>chunk(5, transactionManager)
                .reader(lazyCountryReader())
                .processor(finalSquadProcessor())
                .writer(finalSquadWriter())
                .build();
    }

    // ─── Reader ───────────────────────────────────────────────────────────────

    private ItemReader<Country> lazyCountryReader() {
        return new ItemReader<>() {
            private java.util.Iterator<Country> iterator;

            @Override
            public Country read() {
                if (iterator == null) {
                    List<Country> countries = countryRepository.findAll();
                    log.info("[SyncFinalSquadStep] 최종 엔트리 동기화 대상: {}개국", countries.size());
                    iterator = countries.iterator();
                }
                return iterator.hasNext() ? iterator.next() : null;
            }
        };
    }

    // ─── Processor ────────────────────────────────────────────────────────────

    private ItemProcessor<Country, CountrySquadData> finalSquadProcessor() {
        return country -> {
            Integer teamId = country.getTeamApiId();
            if (teamId == null) {
                log.warn("[SyncFinalSquadStep] teamApiId 없음: {} — 건너뜀", country.getCode());
                return null;
            }

            log.info("[SyncFinalSquadStep] 최종 스쿼드 조회: {} (teamId={})",
                    country.getCode(), teamId);

            try { Thread.sleep(6_000); } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }

            ApiFootballSquadResponse response = apiFootballClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/players/squads")
                            .queryParam("team", teamId)
                            .build())
                    .retrieve()
                    .bodyToMono(ApiFootballSquadResponse.class)
                    .block();

            if (response == null
                    || response.response() == null
                    || response.response().isEmpty()) {
                log.warn("[SyncFinalSquadStep] 스쿼드 응답 없음: {}", country.getCode());
                return null;
            }

            List<ApiFootballSquadResponse.PlayerInfo> players =
                    response.response().get(0).players();

            if (players == null || players.isEmpty()) {
                log.warn("[SyncFinalSquadStep] 선수 목록 비어있음: {}", country.getCode());
                return null;
            }

            log.info("[SyncFinalSquadStep] {} 최종 선수 {}명 수집", country.getCode(), players.size());
            return new CountrySquadData(country, players);
        };
    }

    // ─── Writer ───────────────────────────────────────────────────────────────

    private ItemWriter<CountrySquadData> finalSquadWriter() {
        return items -> {
            for (CountrySquadData data : items) {
                Country country = data.country();

                // 1. 해당 국가 전체 squad_entry 비활성화
                squadEntryRepository.deactivateAllByCountryId(country.getId());
                log.info("[SyncFinalSquadStep] {} 기존 엔트리 비활성화 완료", country.getCode());

                // 2. 최종 명단만 active=true 로 Upsert
                for (ApiFootballSquadResponse.PlayerInfo info : data.players()) {
                    if (info.id() == null) continue;

                    Player player = upsertPlayer(info);
                    upsertSquadEntry(player, country, info);
                }

                log.info("[SyncFinalSquadStep] {} 최종 엔트리 {}명 활성화 완료",
                        country.getCode(), data.players().size());
            }
        };
    }

    // ─── Upsert 헬퍼 ──────────────────────────────────────────────────────────

    private Player upsertPlayer(ApiFootballSquadResponse.PlayerInfo info) {
        return playerRepository.findByApiPlayerId(info.id())
                .orElseGet(() -> {
                    log.debug("[SyncFinalSquadStep] 신규 선수 생성: {} (id={})",
                            info.name(), info.id());
                    return playerRepository.save(
                            Player.create(
                                    info.id(), info.name(),
                                    null, null, null, null, null, null,
                                    info.photo()
                            )
                    );
                });
    }

    private void upsertSquadEntry(Player player, Country country,
                                   ApiFootballSquadResponse.PlayerInfo info) {
        SquadEntry.Position position = mapPosition(info.position());

        squadEntryRepository.findByPlayerIdAndCountryId(player.getId(), country.getId())
                .ifPresentOrElse(
                        existing -> existing.update(info.number(), position, true),
                        () -> squadEntryRepository.save(
                                SquadEntry.create(player, country, info.number(), position))
                );
    }

    private SquadEntry.Position mapPosition(String position) {
        if (position == null) return null;
        return switch (position) {
            case "Goalkeeper" -> SquadEntry.Position.GK;
            case "Defender"   -> SquadEntry.Position.DEF;
            case "Midfielder" -> SquadEntry.Position.MID;
            case "Attacker"   -> SquadEntry.Position.FWD;
            default -> {
                log.warn("[SyncFinalSquadStep] 알 수 없는 포지션: {}", position);
                yield null;
            }
        };
    }
}
