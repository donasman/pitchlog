package com.pitchlog.api.controller;

import com.pitchlog.api.dto.InjuryResponse;
import com.pitchlog.domain.service.InjuryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/injuries")
@RequiredArgsConstructor
public class InjuryController {

    private final InjuryService injuryService;

    /**
     * GET /api/injuries
     * 현재 부상/출전정지 전체 목록 (다가오는 경기 기준)
     *
     * 쿼리파라미터:
     *   team (optional): teamApiId 필터
     */
    @GetMapping
    public ResponseEntity<List<InjuryResponse>> getInjuries(
            @RequestParam(required = false) Integer team) {

        if (team != null) {
            return ResponseEntity.ok(injuryService.getUpcomingByTeam(team));
        }
        return ResponseEntity.ok(injuryService.getUpcoming());
    }

    /**
     * GET /api/injuries/player/{playerApiId}
     * 특정 선수의 부상/정지 목록
     */
    @GetMapping("/player/{playerApiId}")
    public ResponseEntity<List<InjuryResponse>> getByPlayer(@PathVariable Integer playerApiId) {
        return ResponseEntity.ok(injuryService.getByPlayerApiId(playerApiId));
    }
}
