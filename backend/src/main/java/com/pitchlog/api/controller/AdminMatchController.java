package com.pitchlog.api.controller;

import com.pitchlog.api.dto.AdminMatchRequest;
import com.pitchlog.api.dto.MatchSummaryResponse;
import com.pitchlog.domain.service.AdminMatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 관리자 경기 CRUD API
 * 권한: AdminAuthFilter (admin.token 설정 시 X-Admin-Token 헤더 필요)
 */
@RestController
@RequestMapping("/api/admin/matches")
@RequiredArgsConstructor
public class AdminMatchController {

    private final AdminMatchService adminMatchService;

    /** GET /api/admin/matches/{fixtureId} — 단일 경기 조회 (편집 폼용) */
    @GetMapping("/{fixtureId}")
    public MatchSummaryResponse getMatch(@PathVariable Integer fixtureId) {
        return adminMatchService.getMatch(fixtureId);
    }

    /** POST /api/admin/matches — 경기 생성 */
    @PostMapping
    public ResponseEntity<MatchSummaryResponse> createMatch(@RequestBody AdminMatchRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adminMatchService.createMatch(req));
    }

    /** PUT /api/admin/matches/{fixtureId} — 경기 수정 */
    @PutMapping("/{fixtureId}")
    public MatchSummaryResponse updateMatch(@PathVariable Integer fixtureId,
                                            @RequestBody AdminMatchRequest req) {
        return adminMatchService.updateMatch(fixtureId, req);
    }

    /** DELETE /api/admin/matches/{fixtureId} — 경기 삭제 */
    @DeleteMapping("/{fixtureId}")
    public ResponseEntity<Void> deleteMatch(@PathVariable Integer fixtureId) {
        adminMatchService.deleteMatch(fixtureId);
        return ResponseEntity.noContent().build();
    }
}
