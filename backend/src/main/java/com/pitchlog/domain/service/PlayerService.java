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

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    /**
     * 전 리그 합산 득점 기준 상위 선수 목록.
     * 같은 선수가 여러 리그에 통계가 있을 수 있으므로 player_id 로 집계 후 정렬.
     */
    public List<StatsRankingResponse> getTopScorers(int limit) {
        return aggregateByPlayer(playerSeasonStatsRepository.findAllByActivePlayers())
                .stream()
                .sorted(Comparator.comparingInt(StatsRankingResponse::goals).reversed())
                .limit(limit)
                .toList();
    }

    /**
     * 전 리그 합산 도움 기준 상위 선수 목록.
     */
    public List<StatsRankingResponse> getTopAssists(int limit) {
        return aggregateByPlayer(playerSeasonStatsRepository.findAllByActivePlayers())
                .stream()
                .sorted(Comparator.comparingInt(StatsRankingResponse::assists).reversed())
                .limit(limit)
                .toList();
    }

    // ─── 내부 헬퍼 ────────────────────────────────────────────────────────────

    /**
     * PlayerSeasonStats 목록을 선수 단위로 집계해 반환합니다.
     * goals, assists, appearances 는 전 리그 합산값입니다.
     */
    private List<StatsRankingResponse> aggregateByPlayer(List<PlayerSeasonStats> statsList) {
        Map<Player, List<PlayerSeasonStats>> grouped =
                statsList.stream().collect(Collectors.groupingBy(PlayerSeasonStats::getPlayer));

        return grouped.entrySet().stream()
                .map(entry -> {
                    Player player = entry.getKey();
                    List<PlayerSeasonStats> rows = entry.getValue();
                    int goals = rows.stream()
                            .mapToInt(s -> s.getGoals() != null ? s.getGoals() : 0).sum();
                    int assists = rows.stream()
                            .mapToInt(s -> s.getAssists() != null ? s.getAssists() : 0).sum();
                    int appearances = rows.stream()
                            .mapToInt(s -> s.getAppearances() != null ? s.getAppearances() : 0).sum();
                    return StatsRankingResponse.of(player, goals, assists, appearances);
                })
                .toList();
    }
}
