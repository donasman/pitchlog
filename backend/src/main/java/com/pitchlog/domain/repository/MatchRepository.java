package com.pitchlog.domain.repository;

import com.pitchlog.domain.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface MatchRepository extends JpaRepository<Match, Long> {

    Optional<Match> findByFixtureId(Integer fixtureId);

    /** 전체 경기를 날짜 순으로 조회 */
    List<Match> findAllByOrderByMatchDateAsc();

    /** 특정 라운드 경기 */
    List<Match> findByRoundOrderByMatchDateAsc(String round);

    /** 라이브 또는 곧 시작할 경기 (스케줄러용) */
    @Query("""
            SELECT m FROM Match m
            WHERE m.statusShort IN ('NS', '1H', 'HT', '2H', 'ET', 'BT', 'P')
              OR (m.statusShort = 'FT' AND m.updatedAt >= :since)
            ORDER BY m.matchDate ASC
            """)
    List<Match> findActiveOrRecentMatches(LocalDateTime since);
}
