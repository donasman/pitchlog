package com.pitchlog.api.controller;

import com.pitchlog.api.dto.PlayerDetailResponse;
import com.pitchlog.api.dto.StatsRankingResponse;
import com.pitchlog.domain.service.PlayerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "https://pitchlog.com"})
public class PlayerController {

    private final PlayerService playerService;

    @GetMapping("/{id}")
    public ResponseEntity<PlayerDetailResponse> getPlayer(@PathVariable Long id) {
        return ResponseEntity.ok(playerService.findById(id));
    }

    @GetMapping("/top-scorers")
    public ResponseEntity<List<StatsRankingResponse>> getTopScorers(
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(playerService.getTopScorers(limit));
    }

    @GetMapping("/top-assists")
    public ResponseEntity<List<StatsRankingResponse>> getTopAssists(
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(playerService.getTopAssists(limit));
    }
}
