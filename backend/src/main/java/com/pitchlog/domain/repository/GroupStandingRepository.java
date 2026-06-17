package com.pitchlog.domain.repository;

import com.pitchlog.domain.entity.GroupStanding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface GroupStandingRepository extends JpaRepository<GroupStanding, Long> {

    Optional<GroupStanding> findByTeamApiId(Integer teamApiId);

    /** 전체 조 순위 — 그룹명 알파벳순, 그룹 내 순위순 */
    @Query("SELECT g FROM GroupStanding g ORDER BY g.groupName ASC, g.rank ASC")
    List<GroupStanding> findAllOrderedByGroupAndRank();

    /** 특정 조 순위 (예: "Group A") */
    List<GroupStanding> findByGroupNameOrderByRankAsc(String groupName);
}
