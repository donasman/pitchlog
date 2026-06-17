package com.pitchlog.api.controller;

import com.pitchlog.api.dto.StandingGroupResponse;
import com.pitchlog.domain.service.StandingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/standings")
@RequiredArgsConstructor
public class StandingsController {

    private final StandingsService standingsService;

    /**
     * GET /api/standings
     * 12개 조 전체 순위 반환
     */
    @GetMapping
    public ResponseEntity<List<StandingGroupResponse>> getAllStandings() {
        return ResponseEntity.ok(standingsService.getAllGroups());
    }

    /**
     * GET /api/standings/{group}
     * 특정 조 순위 반환 (예: /api/standings/A 또는 /api/standings/Group%20A)
     */
    @GetMapping("/{group}")
    public ResponseEntity<StandingGroupResponse> getGroup(@PathVariable String group) {
        return ResponseEntity.ok(standingsService.getGroup(group));
    }
}
