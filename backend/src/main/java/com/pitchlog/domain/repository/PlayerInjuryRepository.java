package com.pitchlog.domain.repository;

import com.pitchlog.domain.entity.PlayerInjury;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface PlayerInjuryRepository extends JpaRepository<PlayerInjury, Long> {

    /** 현재 시각 이후 경기에 해당하는 부상/정지 (날짜순) */
    @Query("SELECT i FROM PlayerInjury i WHERE i.fixtureDate >= :from ORDER BY i.fixtureDate ASC")
    List<PlayerInjury> findUpcoming(LocalDateTime from);

    /** 특정 팀의 현재 부상/정지 */
    @Query("SELECT i FROM PlayerInjury i WHERE i.teamApiId = :teamApiId AND i.fixtureDate >= :from ORDER BY i.fixtureDate ASC")
    List<PlayerInjury> findUpcomingByTeam(Integer teamApiId, LocalDateTime from);

    /** 특정 선수의 부상 여부 확인 (선수 상세 페이지용) */
    @Query("SELECT COUNT(i) > 0 FROM PlayerInjury i WHERE i.playerApiId = :playerApiId AND i.fixtureDate >= :from")
    boolean existsUpcomingByPlayerApiId(Integer playerApiId, LocalDateTime from);

    /** 특정 선수의 현재 부상 정보 */
    @Query("SELECT i FROM PlayerInjury i WHERE i.playerApiId = :playerApiId AND i.fixtureDate >= :from ORDER BY i.fixtureDate ASC")
    List<PlayerInjury> findUpcomingByPlayerApiId(Integer playerApiId, LocalDateTime from);

    /** 전체 부상 데이터 삭제 (갱신 전 클리어용) */
    @Modifying
    @Query("DELETE FROM PlayerInjury")
    void deleteAll();
}
