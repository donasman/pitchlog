package com.pitchlog.domain.repository;

import com.pitchlog.domain.entity.PlayerSeasonStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PlayerSeasonStatsRepository extends JpaRepository<PlayerSeasonStats, Long> {

    Optional<PlayerSeasonStats> findByPlayerIdAndTeamApiIdAndLeagueApiIdAndSeasonYear(
            Long playerId, Integer teamApiId, Integer leagueApiId, Integer seasonYear);

    /**
     * 월드컵 최종 엔트리(squad_entries.active = true)에 포함된 선수의
     * 전체 시즌 통계를 반환합니다. (선수별 여러 행 포함)
     * 랭킹 집계는 PlayerService 에서 처리합니다.
     */
    @Query("""
           SELECT s FROM PlayerSeasonStats s
           JOIN FETCH s.player p
           WHERE EXISTS (
               SELECT 1 FROM SquadEntry se
               WHERE se.player = p AND se.active = true
           )
           """)
    List<PlayerSeasonStats> findAllByActivePlayers();

    @Query("SELECT s FROM PlayerSeasonStats s WHERE s.player.id = :playerId " +
           "ORDER BY s.seasonYear DESC")
    List<PlayerSeasonStats> findByPlayerId(@Param("playerId") Long playerId);
}
