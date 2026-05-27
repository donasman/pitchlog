package com.pitchlog.domain.service;

import com.pitchlog.api.dto.PlayerDetailResponse;
import com.pitchlog.api.dto.StatsRankingResponse;
import com.pitchlog.domain.entity.Player;
import com.pitchlog.domain.entity.PlayerSeasonStats;
import com.pitchlog.domain.repository.PlayerRepository;
import com.pitchlog.domain.repository.PlayerSeasonStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final PlayerSeasonStatsRepository playerSeasonStatsRepository;

    public PlayerDetailResponse findById(Long id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("선수를 찾을 수 없습니다: " + id));
        List<PlayerSeasonStats> stats = playerSeasonStatsRepository.findByPlayerId(id);
        return PlayerDetailResponse.from(player, stats);
    }

    public List<StatsRankingResponse> getTopScorers(int limit) {
        return playerSeasonStatsRepository.findTopScorers().stream()
                .limit(limit)
                .map(StatsRankingResponse::from)
                .toList();
    }

    public List<StatsRankingResponse> getTopAssists(int limit) {
        return playerSeasonStatsRepository.findTopAssisters().stream()
                .limit(limit)
                .map(StatsRankingResponse::from)
                .toList();
    }
}
