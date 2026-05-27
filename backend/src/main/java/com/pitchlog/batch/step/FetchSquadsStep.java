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
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

/**
 * Step 2. 각 참가국 국가대표 스쿼드를 수집해 players + squad_entries 테이블에 Upsert.
 * 청크 크기: 5개국씩 처리 (API 레이트 리밋 고려)
 *
 * ※ NATIONAL_TEAM_ID_MAP 의 팀 ID는 API-Football 국가대표팀 ID 기준.
 *   https://www.api-football.com/documentation-v3 → Teams → National Teams 참고.
 *   확인 API: GET /teams?type=National&country={국가명}
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

    // NATIONAL_TEAM_ID_MAP 제거 — Step1(FetchCountriesStep)에서 team_api_id를 DB에 저장하므로
    // Processor에서 country.getTeamApiId() 로 직접 조회한다.

    public Step step() {
        return new StepBuilder("fetchSquadsStep", jobRepository)
                .<Country, CountrySquadData>chunk(5, transactionManager)
                .reader(lazyCountryReader())
                .processor(squadProcessor())
                .writer(squadWriter())
                .build();
    }

    /**
     * Step 실행 시점에 DB를 조회하는 Lazy Reader.
     * ListItemReader 는 Step 빈 생성 시점(서버 시작 시)에 리스트를 채우므로
     * Step1(FetchCountriesStep) 완료 전에 빈 리스트가 고정되는 문제를 방지한다.
     */
    private ItemReader<Country> lazyCountryReader() {
        return new ItemReader<>() {
            private java.util.Iterator<Country> iterator;

            @Override
            public Country read() {
                if (iterator == null) {
                    List<Country> countries = countryRepository.findAll();
                    log.info("[FetchSquadsStep] 스쿼드 수집 대상 국가: {}개국", countries.size());
                    iterator = countries.iterator();
                }
                return iterator.hasNext() ? iterator.next() : null;
            }
        };
    }

    // ─── Processor ───────────────────────────────────────────────────────────

    private ItemProcessor<Country, CountrySquadData> squadProcessor() {
        return country -> {
            Integer teamId = country.getTeamApiId();
            if (teamId == null) {
                log.warn("[FetchSquadsStep] teamApiId 없음: {} — 건너뜀 (FetchCountriesStep 결과 확인 필요)",
                        country.getCode());
                return null;
            }

            log.info("[FetchSquadsStep] 스쿼드 조회: {} (teamId={})", country.getCode(), teamId);

            // 분당 호출 제한 방지 — 호출 간 6초 대기 (무료 플랜 기준 ~10콜/분)
            try { Thread.sleep(6_000); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }

            ApiFootballSquadResponse response = apiFootballClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/players/squads")
                            .queryParam("team", teamId)
                            .build())
                    .retrieve()
                    .bodyToMono(ApiFootballSquadResponse.class)
                    .block();

            if (response == null || response.response() == null || response.response().isEmpty()) {
                log.warn("[FetchSquadsStep] 스쿼드 응답 없음: {}", country.getCode());
                return null;
            }

            List<ApiFootballSquadResponse.PlayerInfo> players =
                    response.response().get(0).players();

            if (players == null || players.isEmpty()) {
                log.warn("[FetchSquadsStep] 선수 목록 비어있음: {}", country.getCode());
                return null;
            }

            log.info("[FetchSquadsStep] {} 선수 {}명 수집", country.getCode(), players.size());
            return new CountrySquadData(country, players);
        };
    }

    // ─── Writer ──────────────────────────────────────────────────────────────

    private ItemWriter<CountrySquadData> squadWriter() {
        return items -> {
            for (CountrySquadData data : items) {
                log.info("[FetchSquadsStep] {} 저장 시작 ({}명)",
                        data.country().getCode(), data.players().size());

                for (ApiFootballSquadResponse.PlayerInfo info : data.players()) {
                    if (info.id() == null) continue;

                    Player player = upsertPlayer(info);
                    upsertSquadEntry(player, data.country(), info);
                }

                log.info("[FetchSquadsStep] {} 저장 완료", data.country().getCode());
            }
        };
    }

    // ─── Upsert 헬퍼 ─────────────────────────────────────────────────────────

    private Player upsertPlayer(ApiFootballSquadResponse.PlayerInfo info) {
        return playerRepository.findByApiPlayerId(info.id())
                .orElseGet(() -> {
                    log.debug("[FetchSquadsStep] 새 선수 생성: {} (id={})", info.name(), info.id());
                    return playerRepository.save(
                            Player.create(
                                    info.id(),
                                    info.name(),
                                    null,       // firstName — FetchPlayerStatsStep에서 채움
                                    null,       // lastName
                                    null,       // nationality
                                    null,       // birthDate
                                    null,       // height
                                    null,       // weight
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
                        existing -> {
                            existing.update(info.number(), position, true);
                            log.debug("[FetchSquadsStep] SquadEntry 업데이트: player={}",
                                    player.getId());
                        },
                        () -> {
                            squadEntryRepository.save(
                                    SquadEntry.create(player, country, info.number(), position));
                            log.debug("[FetchSquadsStep] SquadEntry 신규 생성: player={}",
                                    player.getId());
                        }
                );
    }

    /**
     * API-Football 포지션 문자열 → SquadEntry.Position 변환
     */
    private SquadEntry.Position mapPosition(String position) {
        if (position == null) return null;
        return switch (position) {
            case "Goalkeeper" -> SquadEntry.Position.GK;
            case "Defender"   -> SquadEntry.Position.DEF;
            case "Midfielder" -> SquadEntry.Position.MID;
            case "Attacker"   -> SquadEntry.Position.FWD;
            default -> {
                log.warn("[FetchSquadsStep] 알 수 없는 포지션: {}", position);
                yield null;
            }
        };
    }
}
