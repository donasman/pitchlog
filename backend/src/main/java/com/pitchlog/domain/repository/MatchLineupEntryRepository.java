package com.pitchlog.domain.repository;

import com.pitchlog.domain.entity.MatchLineupEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchLineupEntryRepository extends JpaRepository<MatchLineupEntry, Long> {

    List<MatchLineupEntry> findByFixtureIdOrderByTeamApiIdAscSubstituteAscGridAsc(Integer fixtureId);

    boolean existsByFixtureId(Integer fixtureId);

    void deleteByFixtureId(Integer fixtureId);

    /** 경기별 선수 평점 업데이트용 */
    java.util.Optional<MatchLineupEntry> findByFixtureIdAndPlayerApiId(Integer fixtureId, Integer playerApiId);
}
