package com.pitchlog.domain.repository;

import com.pitchlog.domain.entity.FixturePrediction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FixturePredictionRepository extends JpaRepository<FixturePrediction, Long> {

    Optional<FixturePrediction> findByFixtureId(Integer fixtureId);
}
