package com.pitchlog.api.controller;

import com.pitchlog.batch.step.BackfillLineupsStep;
import com.pitchlog.batch.step.FetchPlayerRatingsStep;
import com.pitchlog.batch.step.FetchWorldCupPlayerStatsStep;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobInstance;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.explore.JobExplorer;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.launch.JobOperator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * 배치 잡 수동 실행 API
 *
 * 운영 환경에서는 이 엔드포인트를 보안 처리하거나 제거할 것.
 * 로컬 / 스테이징에서 데이터 수집 테스트용으로 사용.
 *
 * 사용 예:
 *   POST http://localhost:8080/api/batch/sync-players
 */
@Slf4j
@RestController
@RequestMapping("/api/batch")
@RequiredArgsConstructor
public class BatchJobController {

    private final JobLauncher jobLauncher;
    private final JobOperator jobOperator;
    private final JobExplorer jobExplorer;
    private final Job syncWorldCupPlayers;
    private final Job syncWorldCupPlayersLite;
    private final Job syncFinalSquad;
    private final Job syncMatchResults;
    private final BackfillLineupsStep backfillLineupsStep;
    private final FetchPlayerRatingsStep fetchPlayerRatingsStep;
    private final FetchWorldCupPlayerStatsStep fetchWorldCupPlayerStatsStep;

    /**
     * 전체 파이프라인 실행 (Step1→2→3→4)
     * Step3에서 선수 1명당 API 1콜 소모 — Free 플랜(100콜/일)으로는 실행 불가.
     * 프로덕션 배포 후 사용.
     */
    @PostMapping("/sync-players")
    public ResponseEntity<Map<String, String>> syncPlayers() {
        return runJob(syncWorldCupPlayers, "syncWorldCupPlayersJob");
    }

    /**
     * 검증용 Lite 파이프라인 (Step1→2→4, Step3 선수통계 제외)
     * Free 플랜으로 국가→스쿼드→경기 전체 흐름 검증 시 사용.
     * 총 API 콜: 1(국가) + 국가수(스쿼드) + 1(경기) = ~34콜 (Free 플랜 가능)
     */
    @PostMapping("/sync-players-lite")
    public ResponseEntity<Map<String, String>> syncPlayersLite() {
        return runJob(syncWorldCupPlayersLite, "syncWorldCupPlayersLiteJob");
    }

    /**
     * 최종 엔트리 동기화 잡 실행
     * 월드컵 최종 명단 발표 후 1회 수동 트리거.
     */
    @PostMapping("/sync-final-squad")
    public ResponseEntity<Map<String, String>> syncFinalSquad() {
        return runJob(syncFinalSquad, "syncFinalSquadJob");
    }

    /**
     * 과거 종료 경기 라인업 + 평점 백필 + 월드컵 선수 통계 수집 (3-Step 잡).
     * 월드컵 진행 중 스케줄러 시작 전에 끝난 경기 데이터를 일괄 보완할 때 사용.
     * API 콜 소모가 크므로 Pro 플랜 권장. Free 플랜은 경기 수에 따라 당일 한도 초과 가능.
     */
    @PostMapping("/sync-match-results")
    public ResponseEntity<Map<String, String>> syncMatchResults() {
        return runJob(syncMatchResults, "syncMatchResultsJob");
    }

    /**
     * 라인업 백필만 단독 실행 (평점/통계 수집 제외).
     * lineup_entry가 없는 FT 경기에 대해서만 API 호출.
     */
    @PostMapping("/backfill-lineups")
    public ResponseEntity<Map<String, String>> backfillLineups() {
        try {
            log.info("[BatchJobController] 라인업 백필 단독 실행 요청");
            backfillLineupsStep.backfill();
            return ResponseEntity.ok(Map.of("status", "OK", "message", "라인업 백필 완료. 로그를 확인하세요."));
        } catch (Exception e) {
            log.error("[BatchJobController] 라인업 백필 실패", e);
            return ResponseEntity.internalServerError().body(Map.of("status", "FAILED", "message", e.getMessage()));
        }
    }

    /**
     * 선수 평점 수집만 단독 실행.
     * lineup_entry는 있지만 rating이 없는 경기에 대해 API 호출.
     */
    @PostMapping("/refresh-player-ratings")
    public ResponseEntity<Map<String, String>> refreshPlayerRatings() {
        try {
            log.info("[BatchJobController] 선수 평점 수집 단독 실행 요청");
            fetchPlayerRatingsStep.fetchAndRefresh();
            return ResponseEntity.ok(Map.of("status", "OK", "message", "평점 수집 완료. 로그를 확인하세요."));
        } catch (Exception e) {
            log.error("[BatchJobController] 선수 평점 수집 실패", e);
            return ResponseEntity.internalServerError().body(Map.of("status", "FAILED", "message", e.getMessage()));
        }
    }

    /**
     * 월드컵 시즌 선수 통계 수집만 단독 실행.
     * /players?league=1&season=2026 페이지네이션 (~8콜).
     */
    @PostMapping("/sync-wc-player-stats")
    public ResponseEntity<Map<String, String>> syncWcPlayerStats() {
        try {
            log.info("[BatchJobController] 월드컵 선수 통계 수집 단독 실행 요청");
            fetchWorldCupPlayerStatsStep.fetchAndRefresh();
            return ResponseEntity.ok(Map.of("status", "OK", "message", "월드컵 선수 통계 수집 완료. 로그를 확인하세요."));
        } catch (Exception e) {
            log.error("[BatchJobController] 월드컵 선수 통계 수집 실패", e);
            return ResponseEntity.internalServerError().body(Map.of("status", "FAILED", "message", e.getMessage()));
        }
    }

    /**
     * syncWorldCupPlayersJob 재시작 — 429 등으