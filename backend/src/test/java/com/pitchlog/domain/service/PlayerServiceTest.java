package com.pitchlog.domain.service;

import com.pitchlog.api.dto.StatsRankingResponse;
import com.pitchlog.domain.entity.Player;
import com.pitchlog.domain.entity.PlayerSeasonStats;
import com.pitchlog.domain.repository.PlayerRepository;
import com.pitchlog.domain.repository.PlayerSeasonStatsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class PlayerServiceTest {

    @InjectMocks
    private PlayerService playerService;

    @Mock
    private PlayerRepository playerRepository;

    @Mock
    private PlayerSeasonStatsRepository playerSeasonStatsRepository;

    private Player playerA;
    private Player playerB;

    @BeforeEach
    void setUp() {
        playerA = createPlayer(1L, 1001, "Player A", "Brazil");
        playerB = createPlayer(2L, 1002, "Player B", "France");
    }

    @Test
    @DisplayName("getTopScorers: 여러 리그 통계가 선수별로 합산되어 득점 순 정렬")
    void getTopScorers_aggregatesGoalsAcrossLeagues() {
        // given: playerA는 두 리그에 걸쳐 총 9골, playerB는 한 리그에서 10골
        List<PlayerSeasonStats> stats = List.of(
                createStats(playerA, 1, 5, 3),   // playerA 리그1: 5골
                createStats(playerA, 2, 4, 2),   // playerA 리그2: 4골 → 합산 9골
                createStats(playerB, 3, 10, 7)   // playerB 리그1: 10골
        );
        given(playerSeasonStatsRepository.findAllByActivePlayers()).willReturn(stats);

        // when
        List<StatsRankingResponse> result = playerService.getTopScorers(10);

        // then
        assertThat(result).hasSize(2);
        assertThat(result.get(0).playerName()).isEqualTo("Player B"); // 10골 1위
        assertThat(result.get(0).goals()).isEqualTo(10);
        assertThat(result.get(1).playerName()).isEqualTo("Player A"); // 9골 2위
        assertThat(result.get(1).goals()).isEqualTo(9);
    }

    @Test
    @DisplayName("getTopScorers: limit 이상 선수가 있으면 limit 개수만 반환")
    void getTopScorers_respectsLimit() {
        List<PlayerSeasonStats> stats = List.of(
                createStats(playerA, 1, 5, 2),
                createStats(playerB, 2, 10, 3)
        );
        given(playerSeasonStatsRepository.findAllByActivePlayers()).willReturn(stats);

        List<StatsRankingResponse> result = playerService.getTopScorers(1);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).goals()).isEqualTo(10);
    }

    @Test
    @DisplayName("getTopAssists: 여러 리그 도움이 선수별로 합산되어 도움 순 정렬")
    void getTopAssists_aggregatesAssistsAcrossLeagues() {
        List<PlayerSeasonStats> stats = List.of(
                createStats(playerA, 1, 3, 6),   // playerA 리그1: 6도움
                createStats(playerA, 2, 2, 4),   // playerA 리그2: 4도움 → 합산 10도움
                createStats(playerB, 3, 8, 8)    // playerB: 8도움
        );
        given(playerSeasonStatsRepository.findAllByActivePlayers()).willReturn(stats);

        List<StatsRankingResponse> result = playerService.getTopAssists(10);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).playerName()).isEqualTo("Player A"); // 10도움 1위
        assertThat(result.get(0).assists()).isEqualTo(10);
    }

    @Test
    @DisplayName("getTopScorers: goals 가 null 인 통계는 0으로 처리")
    void getTopScorers_treatsNullGoalsAsZero() {
        List<PlayerSeasonStats> stats = List.of(
                createStats(playerA, 1, null, null)
        );
        given(playerSeasonStatsRepository.findAllByActivePlayers()).willReturn(stats);

        List<StatsRankingResponse> result = playerService.getTopScorers(10);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).goals()).isZero();
        assertThat(result.get(0).assists()).isZero();
    }

    // ─── 테스트 픽스처 헬퍼 ──────────────────────────────────────────────────

    private Player createPlayer(Long id, int apiId, String name, String nationality) {
        Player player = Player.create(apiId, name, null, null, nationality,
                null, null, null, null);
        // 리플렉션으로 ID 주입 (JPA 생성 필드이므로)
        try {
            var field = Player.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(player, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return player;
    }

    private PlayerSeasonStats createStats(Player player, int leagueApiId,
                                          Integer goals, Integer assists) {
        PlayerSeasonStats stats = PlayerSeasonStats.create(
                player, 100, "Team", leagueApiId, "League " + leagueApiId, 2025);
        stats.updateStats(10, goals, assists, 0, 0, null);
        return stats;
    }
}
