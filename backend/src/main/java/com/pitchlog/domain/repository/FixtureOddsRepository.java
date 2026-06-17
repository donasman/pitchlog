package com.pitchlog.domain.repository;

import com.pitchlog.domain.entity.FixtureOdds;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FixtureOddsRepository extends JpaRepository<FixtureOdds, Long> {

    Optional<FixtureOdds> findByFixtureId(Integer fixtureId);

    boolean existsByFixtureId(Integer fixtureId);
}
