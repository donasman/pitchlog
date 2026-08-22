package com.pitchlog.domain.repository;

import com.pitchlog.domain.entity.Country;
import com.pitchlog.domain.entity.Player;
import com.pitchlog.domain.entity.PlayerSeasonStats;
import com.pitchlog.domain.entity.PlayerSeasonStats.StatsValues;
import com.pitchlog.domain.entity.SquadEntry;
import com.pitchlog.domain.repository.PlayerSeasonStatsRepository.PlayerStatsProjection;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class PlayerSeasonStatsRepositoryTest {

    @Autowired private PlayerSeasonStatsRepository statsRepository;
    @Autowired private PlayerRepository playerRepository;
    @Autowired private SquadEntryRepository squadEntryRepository;
    @Autowired private CountryRepository countryRepository;

    private Player activePlayer;

    /** 필요한 값만 채운 StatsValues (나머지는 null) */
    private static StatsValues stats(int appearances, int goals, int assists,
                                     int yellow, int red) {
        return new StatsValues(
                appearances, appearances, appearances * 90,
                goals, assists, null,
                yellow, red, 7.5,
                null, null, null, null, null, null,
                null, null, null, null, null, null
        );
    }

    @BeforeEach
    void setUp() {
        Country country = countryRepository.save(
                Country.create("BRA", "Brazil", null, null, null));

        activePlayer = playerRepository.save(
                Player.create(1001, "Active Player", null, null,
                        "Brazil", null, null, null, null));
        Player inactivePlayer = playerRepository.save(
                Player.create(1002, "Inactive Player", null, null,
                        "France", null, null, null, null));

        // activePlayer 는 최종 엔트리(active=true)
        squadEntryRepository.save(
                SquadEntry.create(activePlayer, country, 10, SquadEntry.Position.FWD));

        // inactivePlayer 는 엔트리에서 제외(active=false)
        SquadEntry inactiveEntry = SquadEntry.create(
                inactivePlayer, country, 11, SquadEntry.Position.MID);
        inactiveEntry.update(11, SquadEntry.Position.MID, false);
        squadEntryRepository.save(inactiveEntry);

        // activePlayer — 서로 다른 두 리그의 통계 (집계 합산 검증용)
        PlayerSeasonStats pl = PlayerSeasonStats.create(
                activePlayer, 200, "Club A", 39, "Premier League", 2025);
        pl.updateStats(stats(30, 12, 7, 2, 0));
        statsRepository.save(pl);

        PlayerSeasonStats ucl = PlayerSeasonStats.create(
                activePlayer, 200, "Club A", 2, "Champions League", 2025);
        ucl.updateStats(stats(10, 5, 2, 1, 0));
        statsRepository.save(ucl);

        // inactivePlayer — 집계에서 빠져야 한다
        PlayerSeasonStats other = PlayerSeasonStats.create(
                inactivePlayer, 201, "Club B", 61, "Ligue 1", 2025);
        other.updateStats(stats(20, 9, 3, 1, 0));
        statsRepository.save(other);
    }

    @Test
    @DisplayName("aggregateStatsByActivePlayers: 최종 엔트리 선수만, 리그 합산으로 집계된다")
    void aggregate_onlyActivePlayers_andSumsAcrossLeagues() {
        List<PlayerStatsProjection> result = statsRepository.aggregateStatsByActivePlayers();

        assertThat(result).hasSize(1);
        PlayerStatsProjection p = result.get(0);
        assertThat(p.getPlayerName()).isEqualTo("Active Player");
        assertThat(p.getGoals()).isEqualTo(17);        // 12 + 5
        assertThat(p.getAssists()).isEqualTo(9);       // 7 + 2
        assertThat(p.getAppearances()).isEqualTo(40);  // 30 + 10
        assertThat(p.getYellowCards()).isEqualTo(3);   // 2 + 1
    }

    @Test
    @DisplayName("findByPlayerId: 선수 ID로 시즌 통계 목록 조회")
    void findByPlayerId_returnsStatsForPlayer() {
        List<PlayerSeasonStats> result = statsRepository.findByPlayerId(activePlayer.getId());

        assertThat(result).hasSize(2);
        assertThat(result).extracting(PlayerSeasonStats::getLeagueName)
                .containsExactlyInAnyOrder("Premier League", "Champions League");
    }

    @Test
    @DisplayName("복합키(선수·팀·리그·시즌)로 단건 조회")
    void findByCompositeKey_returnsExactMatch() {
        var result = statsRepository.findByPlayerIdAndTeamApiIdAndLeagueApiIdAndSeasonYear(
                activePlayer.getId(), 200, 39, 2025);

        assertThat(result).isPresent();
        assertThat(result.get().getTeamName()).isEqualTo("Club A");
        assertThat(result.get().getGoals()).isEqualTo(12);
    }
}
