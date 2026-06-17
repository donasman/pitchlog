package com.pitchlog.api.controller;

import com.pitchlog.api.dto.CoachResponse;
import com.pitchlog.domain.service.CoachService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coaches")
@RequiredArgsConstructor
public class CoachController {

    private final CoachService coachService;

    /** 전체 감독 목록 */
    @GetMapping
    public ResponseEntity<List<CoachResponse>> getAllCoaches() {
        return ResponseEntity.ok(coachService.getAll());
    }

    /** 국가 코드로 감독 조회 (예: /api/coaches/kor) */
    @GetMapping("/{countryCode}")
    public ResponseEntity<CoachResponse> getCoachByCountry(@PathVariable String countryCode) {
        return coachService.getByCountryCode(countryCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
