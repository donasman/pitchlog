package com.pitchlog.domain.repository;

import com.pitchlog.domain.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlayerRepository extends JpaRepository<Player, Long> {

    Optional<Player> findByApiPlayerId(Integer apiPlayerId);

    /** 라인업의 apiPlayerId 목록으로 Player 를 일괄 조회 (N+1 방지) */
    List<Player> findByApiPlayerIdIn(java.util.Collection<Integer> apiPlayerIds);

    boolean existsByApiPlayerId(Integer apiPlayerId);
}
