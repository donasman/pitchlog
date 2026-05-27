package com.pitchlog.api.controller;

import com.pitchlog.api.dto.MatchDetailResponse;
import com.pitchlog.api.dto.MatchSummaryResponse;
import com.pitchlog.domain.service.MatchSchedulerService;
import com.pitchlog.domain.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;
    private final MatchSchedulerService matchSchedulerService;

    /** GET /api/matches — 전체 경기 목록 */
    @GetMapping
    public List<MatchSummaryResponse> getAllMatches() {
        return matchService.getAllMatches();
    }

    /** GET /api/matches/{fixtureId} — 경기 상세 + 라인업 */
    @GetMapping("/{fixtureId}")
    public MatchDetailResponse getMatch(@PathVariable Integer fixtureId) {
        return matchService.getMatch(fixtureId);
    }

    /**
     * POST /api/matches/{fixtureId}/refresh — 수동 결과 갱신 (관리용)
     * 스케줄러가 놓친 경기나 즉시 갱신이 필요할 때 호출.
     */
    @PostMapping("/{fixtureId}/refresh")
    public ResponseEntity<Void> refreshMatch(@PathVariable Integer fixtureId) {
        matchSchedulerService.refreshFixture(fixtureId);
        matchSchedulerService.fetchAndSaveLineups(fixtureId);
        return ResponseEntity.ok().build();
    }
}
