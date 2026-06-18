package com.pitchlog.api.controller;

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
     * syncWorldCupPlayersJob 재시작 — 429 등으로 중단된 경우 Step3부터 이어서 실행.
     * Spring Batch가 COMPLETED Step은 건너뛰고 FAILED Step부터 재개한다.
     *
     * 사용 예:
     *   POST http://localhost:8080/api/batch/restart-sync-players
     */
    @PostMapping("/restart-sync-players")
    public ResponseEntity<Map<String, String>> restartSyncPlayers() {
        try {
            List<JobInstance> instances = jobExplorer.getJobInstances("syncWorldCupPlayersJob", 0, 10);
            if (instances.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "status", "NOT_FOUND",
                        "message", "syncWorldCupPlayersJob 실행 이력이 없습니다. 먼저 /sync-players를 실행하세요."
                ));
            }

            // 가장 최근 FAILED 실행 찾기
            Optional<JobExecution> failedExecution = instances.stream()
                    .flatMap(instance -> jobExplorer.getJobExecutions(instance).stream())
                    .filter(exec -> exec.getStatus() == BatchStatus.FAILED)
                    .findFirst();

            if (failedExecution.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "status", "NO_FAILED_JOB",
                        "message", "재시작할 FAILED 상태의 Job이 없습니다."
                ));
            }

            long executionId = failedExecution.get().getId();
            log.info("[BatchJobController] syncWorldCupPlayersJob 재시작 요청 (executionId={})", executionId);
            Long newExecutionId = jobOperator.restart(executionId);

            return ResponseEntity.ok(Map.of(
                    "status", "RESTARTED",
                    "message", "Job이 재시작됐습니다. 완료된 Step은 건너뜁니다.",
                    "newExecutionId", String.valueOf(newExecutionId)
            ));
        } catch (Exception e) {
            log.error("[BatchJobController] syncWorldCupPlayersJob 재시작 실패", e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "FAILED",
                    "message", e.getMessage()
            ));
        }
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
