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

    /** 전 리그 합산 득점 기준 상위 선수 목록 (DB GROUP BY 집계) */
    public List<StatsRankingResponse> getTopScorers(int limit) {
        return playerSeasonStatsRepository.aggregateStatsByActivePlayers()
                .stream()
                .map(StatsRankingResponse::from)
                .sorted(Comparator.comparingInt(StatsRankingResponse::goals).reversed())
                .limit(limit)
                .toList();
    }

    /** 전 리그 합산 도움 기준 상위 선수 목록 (DB GROUP BY 집계) */
    public List<StatsRankingResponse> getTopAssists(int limit) {
        return playerSeasonStatsRepository.aggregateStatsByActivePlayers()
                .stream()
                .map(StatsRankingResponse::from)
                .sorted(Comparator.comparingInt(StatsRankingResponse::assists).reversed())
                .limit(limit)
                .toList();
    }

    /** 전 리그 합산 경고 누적 기준 상위 선수 목록 */
    public List<StatsRankingResponse> getTopYellowCards(int limit) {
        return playerSeasonStatsRepository.aggregateStatsByActivePlayers()
                .stream()
                .map(StatsRankingResponse::from)
                .sorted(Comparator.comparingInt(StatsRankingResponse::yellowCards).reversed())
                .limit(limit)
                .toList();
    }

    /** 전 리그 합산 퇴장 기준 상위 선수 목록 */
    public List<StatsRankingResponse> getTopRedCards(int limit) {
        return playerSeasonStatsRepository.aggregateStatsByActivePlayers()
                .stream()
                .map(StatsRankingResponse::from)
                .sorted(Comparator.comparingInt(StatsRankingResponse::redCards).reversed())
                .limit(limit)
                .toList();
    }
}
