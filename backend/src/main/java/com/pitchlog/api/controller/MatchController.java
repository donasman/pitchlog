package com.pitchlog.api.controller;

import com.pitchlog.api.dto.MatchDetailResponse;
import com.pitchlog.api.dto.MatchSummaryResponse;
import com.pitchlog.domain.service.MatchSchedulerService;
import com.pitchlog.domain.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    // scheduler-enabled=false 프로파일에서 Bean이 없을 수 있으므로 optional
    @Autowired(required = false)
    private MatchSchedulerService matchSchedulerService;

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
     * 스케줄러가 비활성화된 로컬에서는 503 반환.
     */
    @PostMapping("/{fixtureId}/refresh")
    public ResponseEntity<Void> refreshMatch(@PathVariable Integer fixtureId) {
        if (matchSchedulerService == null) {
            return ResponseEntity.status(503).build(); // 로컬: 스케줄러 비활성화 상태
        }
        matchSchedulerService.refreshFixture(fixtureId);
        matchSchedulerService.fetchAndSaveLineups(fixtureId);
        return ResponseEntity.ok().build();
    }
}
