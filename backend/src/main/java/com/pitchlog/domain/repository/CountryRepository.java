package com.pitchlog.domain.repository;

import com.pitchlog.domain.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CountryRepository extends JpaRepository<Country, Long> {

    Optional<Country> findByCode(String code);

    Optional<Country> findByCodeIgnoreCase(String code);

    Optional<Country> findFirstByTeamApiId(Integer teamApiId);

    boolean existsByCode(String code);
}
