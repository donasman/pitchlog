package com.pitchlog.domain.repository;

import com.pitchlog.domain.entity.H2HRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface H2HRecordRepository extends JpaRepository<H2HRecord, Long> {

    Optional<H2HRecord> findByFixtureId(Integer fixtureId);

    List<H2HRecord> findByTeamPairOrderByMatchDateDesc(String teamPair);

    boolean existsByTeamPair(String teamPair);
}
