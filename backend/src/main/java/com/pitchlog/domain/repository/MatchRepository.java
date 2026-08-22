package com.pitchlog.domain.repository;

import com.pitchlog.domain.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    /**
     * 수동 입력 경기(fixtureId >= 1_000_000) 중 최댓값.
     * 다음 수동 fixtureId 생성에 사용.
     */
    @Query("SELECT MAX(m.fixtureId) FROM Match m WHERE m.fixtureId >= 9000000")
    Optional<Integer> findMaxManualFixtureId();

    /** 현재 진행 중인 경기가 있는지 확인 (동적 스케줄러 모드 판단용) */
    @Query("SELECT COUNT(m) > 0 FROM Match m WHERE m.statusShort IN ('1H', 'HT', '2H', 'ET', 'BT', 'P')")
    boolean existsLiveMatch();

    /** 킥오프 1시간 이내 대기 중인 경기가 있는지 확인 (라인업 폴링 시작 조건) */
    @Query("SELECT COUNT(m) > 0 FROM Match m WHERE m.statusShort = 'NS' AND m.matchDate BETWEEN :from AND :to")
    boolean existsPreMatchWithin(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    /** 라인업 폴링 대상: 킥오프 1시간 전 ~ 1시간 후 NS 경기 */
    @Query("""
            SELECT m FROM Match m
            WHERE m.statusShort = 'NS'
              AND m.matchDate BETWEEN :from AND :to
            ORDER BY m.matchDate ASC
            """)
    List<Match> findPreMatchOrJustStarted(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    /** 현재 진행 중인 경기 목록 (LIVE 모드 라인업 재시도용) */
    List<Match> findByStatusShortIn(List<String> statuses);

    /**
     * 킥오프 시간이 이미 지났는데 DB 상태가 아직 NS인 경기 존재 여부.
     * cutoff(최대 3시간 전) ~ now 사이에 킥오프 예정이었던 NS 경기를 감지해
     * DB 갱신 전에도 LIVE 모드로 자동 진입하기 위해 사용.
     */
    @Query("""
            SELECT COUNT(m) > 0 FROM Match m
            WHERE m.statusShort = 'NS'
              AND m.matchDate BETWEEN :cutoff AND :now
            """)
    boolean existsMatchShouldHaveStarted(@Param("cutoff") LocalDateTime cutoff,
                                         @Param("now") LocalDateTime now);
}
