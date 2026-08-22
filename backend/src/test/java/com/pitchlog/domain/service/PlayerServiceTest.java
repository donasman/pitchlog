package com.pitchlog.domain.service;

import com.pitchlog.api.dto.StatsRankingResponse;
import com.pitchlog.domain.exception.ResourceNotFoundException;
import com.pitchlog.domain.repository.PlayerRepository;
import com.pitchlog.domain.repository.PlayerSeasonStatsRepository;
import com.pitchlog.domain.repository.PlayerSeasonStatsRepository.PlayerStatsProjection;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

/**
 * 집계는 DB(aggregateStatsByActivePlayers)가 담당하므로,
 * 이 테스트는 서비스의 책임인 "정렬 + limit 적용"만 검증한다.
 */
@ExtendWith(MockitoExtension.class)
class PlayerServiceTest {

    @InjectMocks
    private PlayerService playerService;

    @Mock
    private PlayerRepository playerRepository;

    @Mock
    private PlayerSeasonStatsRepository playerSeasonStatsRepository;

    /** PlayerStatsProjection 스텁 생성 */
    private static PlayerStatsProjection proj(long id, String name, String nationality,
                                              int goals, int assists, int apps,
                                              int yellow, int red) {
        return new PlayerStatsProjection() {
            @Override public Long   getPlayerId()    { return id; }
            @Override public String getPlayerName()  { return name; }
            @Override public String getPhotoUrl()    { return null; }
            @Override public String getNationality() { return nationality; }
            @Override public int    getGoals()       { return goals; }
            @Override public int    getAssists()     { return assists; }
            @Override public int    getAppearances() { return apps; }
            @Override public int    getYellowCards() { return yellow; }
            @Override public int    getRedCards()    { return red; }
        };
    }

    private static final List<PlayerStatsProjection> SAMPLE = List.of(
            proj(1L, "Player A", "Brazil",  12, 3, 30, 2, 0),
            proj(2L, "Player B", "France",   5, 9, 28, 1, 0),
            proj(3L, "Player C", "Spain",    8, 1, 25, 4, 1)
    );

    @Test
    @DisplayName("getTopScorers: 득점 내림차순으로 정렬된다")
    void getTopScorers_sortsByGoalsDesc() {
        given(playerSeasonStatsRepository.aggregateStatsByActivePlayers()).willReturn(SAMPLE);

        List<StatsRankingResponse> result = playerService.getTopScorers(10);

        assertThat(result).extracting(StatsRankingResponse::playerName)
                .containsExactly("Player A", "Player C", "Player B");
        assertThat(result.get(0).goals()).isEqualTo(12);
    }

    @Test
    @DisplayName("getTopScorers: limit 개수만 반환한다")
    void getTopScorers_respectsLimit() {
        given(playerSeasonStatsRepository.aggregateStatsByActivePlayers()).willReturn(SAMPLE);

        List<StatsRankingResponse> result = playerService.getTopScorers(2);

        assertThat(result).hasSize(2);
        assertThat(result.get(1).playerName()).isEqualTo("Player C");
    }

    @Test
    @DisplayName("getTopAssists: 도움 내림차순으로 정렬된다")
    void getTopAssists_sortsByAssistsDesc() {
        given(playerSeasonStatsRepository.aggregateStatsByActivePlayers()).willReturn(SAMPLE);

        List<StatsRankingResponse> result = playerService.getTopAssists(10);

        assertThat(result).extracting(StatsRankingResponse::playerName)
                .containsExactly("Player B", "Player A", "Player C");
    }

    @Test
    @DisplayName("getTopYellowCards: 경고 내림차순으로 정렬된다")
    void getTopYellowCards_sortsByYellowDesc() {
        given(playerSeasonStatsRepository.aggregateStatsByActivePlayers()).willReturn(SAMPLE);

        List<StatsRankingResponse> result = playerService.getTopYellowCards(10);

        assertThat(result.get(0).playerName()).isEqualTo("Player C");
        assertThat(result.get(0).yellowCards()).isEqualTo(4);
    }

    @Test
    @DisplayName("getTopScorers: 집계 결과가 비면 빈 목록을 반환한다")
    void getTopScorers_emptyAggregation() {
        given(playerSeasonStatsRepository.aggregateStatsByActivePlayers()).willReturn(List.of());

        assertThat(playerService.getTopScorers(10)).isEmpty();
    }

    @Test
    @DisplayName("findById: 존재하지 않는 선수면 ResourceNotFoundException")
    void findById_notFound() {
        given(playerRepository.findById(999L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> playerService.findById(999L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
