package com.pitchlog.domain.repository;

import com.pitchlog.domain.entity.Coach;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CoachRepository extends JpaRepository<Coach, Long> {

    Optional<Coach> findByTeamApiId(Integer teamApiId);

    List<Coach> findAllByOrderByTeamNameAsc();
}
