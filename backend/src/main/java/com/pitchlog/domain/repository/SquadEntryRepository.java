package com.pitchlog.domain.repository;

import com.pitchlog.domain.entity.SquadEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SquadEntryRepository extends JpaRepository<SquadEntry, Long> {

    @Query("SELECT se FROM SquadEntry se JOIN FETCH se.player JOIN FETCH se.country " +
           "WHERE se.country.code = :countryCode AND se.active = true " +
           "ORDER BY se.position, se.jerseyNumber")
    List<SquadEntry> findActiveByCountryCode(@Param("countryCode") String countryCode);

    @Query("SELECT se FROM SquadEntry se JOIN FETCH se.player JOIN FETCH se.country " +
           "WHERE se.active = true ORDER BY se.country.name, se.position")
    List<SquadEntry> findAllActive();

    Optional<SquadEntry> findByPlayerIdAndCountryId(Long playerId, Long countryId);

    /** 특정 국가의 모든 squad_entry 를 active=false 로 일괄 초기화 */
    @Modifying
    @Query("UPDATE SquadEntry se SET se.active = false WHERE se.country.id = :countryId")
    void deactivateAllByCountryId(@Param("countryId") Long countryId);
}
