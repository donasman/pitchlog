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
public class PlayerController {

    private final PlayerService playerService;

    @GetMapping("/{id}")
    public ResponseEntity<PlayerDetailResponse> getPlayer(@PathVariable Long id) {
        return ResponseEntity.ok(playerService.findById(id));
    }

    /**
     * source=worldcup → FIFA 월드컵(leagueApiId=1) 통계만
     * source=season   → 25-26 클럽 시즌 전체 합산 (기본값)
     */
    @GetMapping("/top-scorers")
    public ResponseEntity<List<StatsRankingResponse>> getTopScorers(
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "season") String source) {
        return ResponseEntity.ok("worldcup".equals(source)
                ? playerService.getTopScorersWorldCup(limit)
                : playerService.getTopScorers(limit));
    }

    @GetMapping("/top-assists")
    public ResponseEntity<List<StatsRankingResponse>> getTopAssists(
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "season") String source) {
        return ResponseEntity.ok("worldcup".equals(source)
                ? playerService.getTopAssistsWorldCup(limit)
                : playerService.getTopAssists(limit));
    }

    @GetMapping("/top-yellowcards")
    public ResponseEntity<List<StatsRankingResponse>> getTopYellowCards(
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "season") String source) {
        return ResponseEntity.ok("worldcup".equals(source)
                ? playerService.getTopYellowCardsWorldCup(limit)
                : playerService.getTopYellowCards(limit));
    }

    @GetMapping("/top-redcards")
    public ResponseEntity<List<StatsRankingResponse>> getTopRedCards(
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "season") String source) {
        return ResponseEntity.ok("worldcup".equals(source)
                ? playerService.getTopRedCardsWorldCup(limit)
                : playerService.getTopRedCards(limit));
    }
}
