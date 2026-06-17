package com.pitchlog.domain.service;

import com.pitchlog.api.dto.StandingGroupResponse;
import com.pitchlog.domain.entity.GroupStanding;
import com.pitchlog.domain.repository.GroupStandingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StandingsService {

    private final GroupStandingRepository groupStandingRepository;

    /** 12개 조 전체 순위 반환 */
    public List<StandingGroupResponse> getAllGroups() {
        List<GroupStanding> all = groupStandingRepository.findAllOrderedByGroupAndRank();

        Map<String, List<GroupStanding>> byGroup = all.stream()
                .collect(Collectors.groupingBy(
                        GroupStanding::getGroupName,
                        LinkedHashMap::new,         // 삽입 순서(알파벳순) 유지
                        Collectors.toList()
                ));

        return byGroup.entrySet().stream()
                .map(e -> new StandingGroupResponse(
                        e.getKey(),
                        e.getValue().stream()
                                .map(StandingGroupResponse.StandingEntryResponse::from)
                                .toList()
                ))
                .toList();
    }

    /** 특정 조 순위 반환 (예: group="Group A" 또는 "A") */
    public StandingGroupResponse getGroup(String group) {
        String groupName = group.length() == 1
                ? "Group " + group.toUpperCase()
                : group;

        List<GroupStanding> entries =
                groupStandingRepository.findByGroupNameOrderByRankAsc(groupName);

        return new StandingGroupResponse(
                groupName,
                entries.stream()
                        .map(StandingGroupResponse.StandingEntryResponse::from)
                        .toList()
        );
    }
}
