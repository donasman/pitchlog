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
     * 월드컵 최종 엔트리(squad_entries.active = true)에 포함된 선수만
     * 득점 순으로 정렬하여 반환합니다.
     */
    @Query("""
           SELECT s FROM PlayerSeasonStats s
           JOIN FETCH s.player p
           WHERE EXISTS (
               SELECT 1 FROM SquadEntry se
               WHERE se.player = p AND se.active = true
           )
           ORDER BY s.goals DESC NULLS LAST
           """)
    List<PlayerSeasonStats> findTopScorers();

    /**
     * 월드컵 최종 엔트리(squad_entries.active = true)에 포함된 선수만
     * 도움 순으로 정렬하여 반환합니다.
     */
    @Query("""
           SELECT s FROM PlayerSeasonStats s
           JOIN FETCH s.player p
           WHERE EXISTS (
               SELECT 1 FROM SquadEntry se
               WHERE se.player = p AND se.active = true
           )
           ORDER BY s.assists DESC NULLS LAST
           """)
    List<PlayerSeasonStats> findTopAssisters();

    @Query("SELECT s FROM PlayerSeasonStats s WHERE s.player.id = :playerId " +
           "ORDER BY s.seasonYear DESC")
    List<PlayerSeasonStats> findByPlayerId(@Param("playerId") Long playerId);
}
