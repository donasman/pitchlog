package com.pitchlog.domain.repository;

import com.pitchlog.domain.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlayerRepository extends JpaRepository<Player, Long> {

    Optional<Player> findByApiPlayerId(Integer apiPlayerId);

    boolean existsByApiPlayerId(Integer apiPlayerId);
}
