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

    @Query("SELECT s FROM PlayerSeasonStats s WHERE s.player.id = :playerId " +
           "ORDER BY s.seasonYear DESC")
    List<PlayerSeasonStats> findByPlayerId(@Param("playerId") Long playerId);

    /**
     * 월드컵 최종 엔트리(active=true) 선수의 통계를 DB에서 집계해 반환.
     * Java 스트림 집계 대신 DB GROUP BY를 사용해 성능 개선.
     */
    @Query("""
           SELECT p.id          AS playerId,
                  p.name        AS playerName,
                  p.photoUrl    AS photoUrl,
                  p.nationality AS nationality,
                  COALESCE(SUM(s.goals),       0) AS goals,
                  COALESCE(SUM(s.assists),     0) AS assists,
                  COALESCE(SUM(s.appearances), 0) AS appearances,
                  COALESCE(SUM(s.yellowCards), 0) AS yellowCards,
                  COALESCE(SUM(s.redCards),    0) AS redCards
           FROM PlayerSeasonStats s
           JOIN s.player p
           WHERE EXISTS (
               SELECT 1 FROM SquadEntry se
               WHERE se.player = p AND se.active = true
           )
           GROUP BY p.id, p.name, p.photoUrl, p.nationality
           """)
    List<PlayerStatsProjection> aggregateStatsByActivePlayers();

    /** DB 집계 결과 projection */
    interface PlayerStatsProjection {
        Long   getPlayerId();
        String getPlayerName();
        String getPhotoUrl();
        String getNationality();
        int    getGoals();
        int    getAssists();
        int    getAppearances();
        int    getYellowCards();
        int    getRedCards();
    }
}
