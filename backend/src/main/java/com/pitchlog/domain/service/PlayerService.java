package com.pitchlog.domain.service;

import com.pitchlog.api.dto.PlayerDetailResponse;
import com.pitchlog.api.dto.StatsRankingResponse;
import com.pitchlog.domain.entity.Player;
import com.pitchlog.domain.entity.PlayerSeasonStats;
import com.pitchlog.domain.exception.ResourceNotFoundException;
import com.pitchlog.domain.repository.PlayerRepository;
import com.pitchlog.domain.repository.PlayerSeasonStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final PlayerSeasonStatsRepository playerSeasonStatsRepository;

    public PlayerDetailResponse findById(Long id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.player(id));
        List<PlayerSeasonStats> stats = playerSeasonStatsRepository.findByPlayerId(id);
        return PlayerDetailResponse.from(player, stats);
    }

    /** 전 리그 합산 득점 기준 상위 선수 목록 (클럽 시즌) */
    public List<StatsRankingResponse> getTopScorers(int limit) {
        return ranked(playerSeasonStatsRepository.aggregateStatsByActivePlayers(),
                Comparator.comparingInt(StatsRankingResponse::goals).reversed(), limit);
    }

    /** 전 리그 합산 도움 기준 상위 선수 목록 (클럽 시즌) */
    public List<StatsRankingResponse> getTopAssists(int limit) {
        return ranked(playerSeasonStatsRepository.aggregateStatsByActivePlayers(),
                Comparator.comparingInt(StatsRankingResponse::assists).reversed(), limit);
    }

    /** 전 리그 합산 경고 누적 기준 상위 선수 목록 (클럽 시즌) */
    public List<StatsRankingResponse> getTopYellowCards(int limit) {
        return ranked(playerSeasonStatsRepository.aggregateStatsByActivePlayers(),
                Comparator.comparingInt(StatsRankingResponse::yellowCards).reversed(), limit);
    }

    /** 전 리그 합산 퇴장 기준 상위 선수 목록 (클럽 시즌) */
    public List<StatsRankingResponse> getTopRedCards(int limit) {
        return ranked(playerSeasonStatsRepository.aggregateStatsByActivePlayers(),
                Comparator.comparingInt(StatsRankingResponse::redCards).reversed(), limit);
    }

    // ── 월드컵 전용 (leagueApiId = 1) ────────────────────────────────────────

    public List<StatsRankingResponse> getTopScorersWorldCup(int limit) {
        return ranked(playerSeasonStatsRepository.aggregateStatsByActivePlayersAndLeague(1),
                Comparator.comparingInt(StatsRankingResponse::goals).reversed(), limit);
    }

    public List<StatsRankingResponse> getTopAssistsWorldCup(int limit) {
        return ranked(playerSeasonStatsRepository.aggregateStatsByActivePlayersAndLeague(1),
                Comparator.comparingInt(StatsRankingResponse::assists).reversed(), limit);
    }

    public List<StatsRankingResponse> getTopYellowCardsWorldCup(int limit) {
        return ranked(playerSeasonStatsRepository.aggregateStatsByActivePlayersAndLeague(1),
                Comparator.comparingInt(StatsRankingResponse::yellowCards).reversed(), limit);
    }

    public List<StatsRankingResponse> getTopRedCardsWorldCup(int limit) {
        return ranked(playerSeasonStatsRepository.aggregateStatsByActivePlayersAndLeague(1),
                Comparator.comparingInt(StatsRankingResponse::redCards).reversed(), limit);
    }

    // ── 공통 헬퍼 ────────────────────────────────────────────────────────────

    private List<StatsRankingResponse> ranked(
            List<PlayerSeasonStatsRepository.PlayerStatsProjection> projections,
            Comparator<StatsRankingResponse> comparator,
            int limit) {
        return projections.stream()
                .map(StatsRankingResponse::from)
                .sorted(comparator)
                .limit(limit)
                .toList();
    }
}
