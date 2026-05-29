package com.pitchlog.domain.repository;

import com.pitchlog.domain.entity.Country;
import com.pitchlog.domain.entity.Player;
import com.pitchlog.domain.entity.PlayerSeasonStats;
import com.pitchlog.domain.entity.SquadEntry;
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
    private Player inactivePlayer;

    @BeforeEach
    void setUp() {
        Country country = countryRepository.save(
                Country.create("BRA", "Brazil", null, null, null));

        activePlayer = playerRepository.save(
                Player.create(1001, "Active Player", null, null,
                        "Brazil", null, null, null, null));
        inactivePlayer = playerRepository.save(
                Player.create(1002, "Inactive Player", null, null,
                        "France", null, null, null, null));

        // activePlayer 는 squad_entry active=true
        squadEntryRepository.save(
                SquadEntry.create(activePlayer, country, 10, SquadEntry.Position.FWD));

        // inactivePlayer 는 squad_entry active=false
        SquadEntry inactiveEntry = SquadEntry.create(
                inactivePlayer, country, 11, SquadEntry.Position.MID);
        inactiveEntry.update(11, SquadEntry.Position.MID, false);
        squadEntryRepository.save(inactiveEntry);

        // 시즌 통계 저장
        PlayerSeasonStats activeStats = PlayerSeasonStats.create(
                activePlayer, 200, "Club A", 39, "Premier League", 2025);
        activeStats.updateStats(30, 12, 7, 2, 0, 8.1);
        statsRepository.save(activeStats);

        PlayerSeasonStats inactiveStats = PlayerSeasonStats.create(
                inactivePlayer, 201, "Club B", 61, "Ligue 1", 2025);
        inactiveStats.updateStats(20, 5, 3, 1, 0, 7.5);
        statsRepository.save(inactiveStats);
    }

    @Test
    @DisplayName("findAllByActivePlayers: active=true 선수의 통계만 반환")
    void findAllByActivePlayers_onlyReturnsActivePlayerStats() {
        List<PlayerSeasonStats> result = statsRepository.findAllByActivePlayers();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getPlayer().getName()).isEqualTo("Active Player");
        assertThat(result.get(0).getGoals()).isEqualTo(12);
    }

    @Test
    @DisplayName("findByPlayerId: 선수 ID로 시즌 통계 목록 조회")
    void findByPlayerId_returnsStatsForPlayer() {
        List<PlayerSeasonStats> result = statsRepository.findByPlayerId(activePlayer.getId());

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getLeagueName()).isEqualTo("Premier League");
        assertThat(result.get(0).getAssists()).isEqualTo(7);
    }

    @Test
    @DisplayName("findByPlayerIdAndTeamApiIdAndLeagueApiIdAndSeasonYear: 복합키로 단건 조회")
    void findByCompositeKey_returnsExactMatch() {
        var result = statsRepository.findByPlayerIdAndTeamApiIdAndLeagueApiIdAndSeasonYear(
                activePlayer.getId(), 200, 39, 2025);

        assertThat(result).isPresent();
        assertThat(result.get().getTeamName()).isEqualTo("Club A");
    }
}
