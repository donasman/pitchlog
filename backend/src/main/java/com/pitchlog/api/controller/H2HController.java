package com.pitchlog.api.controller;

import com.pitchlog.api.dto.H2HRecordResponse;
import com.pitchlog.domain.service.H2HService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/h2h")
@RequiredArgsConstructor
public class H2HController {

    private final H2HService h2hService;

    /**
     * GET /api/h2h/{team1}/{team2}
     * 예: /api/h2h/10/20
     */
    @GetMapping("/{team1}/{team2}")
    public ResponseEntity<List<H2HRecordResponse>> getH2H(
            @PathVariable Integer team1,
            @PathVariable Integer team2) {
        return ResponseEntity.ok(h2hService.getH2H(team1, team2));
    }
}
