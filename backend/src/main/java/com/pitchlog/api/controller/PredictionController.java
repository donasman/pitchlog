package com.pitchlog.api.controller;

import com.pitchlog.api.dto.PredictionResponse;
import com.pitchlog.domain.service.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/predictions")
@RequiredArgsConstructor
public class PredictionController {

    private final PredictionService predictionService;

    /** GET /api/predictions/{fixtureId} */
    @GetMapping("/{fixtureId}")
    public ResponseEntity<PredictionResponse> getPrediction(@PathVariable Integer fixtureId) {
        return predictionService.getByFixtureId(fixtureId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
