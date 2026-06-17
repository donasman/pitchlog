package com.pitchlog.api.controller;

import com.pitchlog.api.dto.OddsResponse;
import com.pitchlog.domain.service.OddsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/odds")
@RequiredArgsConstructor
public class OddsController {

    private final OddsService oddsService;

    /**
     * GET /api/odds/{fixtureId}
     * 배당 없으면 404
     */
    @GetMapping("/{fixtureId}")
    public ResponseEntity<OddsResponse> getOdds(@PathVariable Integer fixtureId) {
        return oddsService.getByFixtureId(fixtureId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
