package com.pitchlog.domain.repository;

import com.pitchlog.domain.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CountryRepository extends JpaRepository<Country, Long> {

    Optional<Country> findByCode(String code);

    boolean existsByCode(String code);
}
