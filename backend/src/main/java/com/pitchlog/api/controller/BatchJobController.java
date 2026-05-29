package com.pitchlog.api.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
    private final Job syncWorldCupPlayers;
    private final Job syncFinalSquad;

    /**
     * 월드컵 선수 데이터 전체 수집 잡 실행
     * - Step1: 참가국 수집
     * - Step2: 스쿼드 수집
     * - Step3: 선수 통계 수집
     * - Step4: 경기 일정 수집
     */
    @PostMapping("/sync-players")
    public ResponseEntity<Map<String, String>> syncPlayers() {
        return runJob(syncWorldCupPlayers, "syncWorldCupPlayersJob");
    }

    /**
     * 최종 엔트리 동기화 잡 실행
     * 월드컵 최종 명단 발표 후 1회 수동 트리거.
     * 기존 squad_entries 를 비활성화 후 최신 26인만 active=true 로 갱신.
     */
    @PostMapping("/sync-final-squad")
    public ResponseEntity<Map<String, String>> syncFinalSquad() {
        return runJob(syncFinalSquad, "syncFinalSquadJob");
    }

    // ─── 공통 헬퍼 ────────────────────────────────────────────────────────────

    private ResponseEntity<Map<String, String>> runJob(Job job, String jobName) {
        try {
            JobParameters params = new JobParametersBuilder()
                    .addLong("startedAt", System.currentTimeMillis())
                    .toJobParameters();

            log.info("[BatchJobController] {} 실행 요청", jobName);
            jobLauncher.run(job, params);

            return ResponseEntity.ok(Map.of(
                    "status", "STARTED",
                    "message", jobName + " 이 시작됐습니다. 로그를 확인하세요."
            ));
        } catch (Exception e) {
            log.error("[BatchJobController] {} 실행 실패", jobName, e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "FAILED",
                    "message", e.getMessage()
            ));
        }
    }
}
