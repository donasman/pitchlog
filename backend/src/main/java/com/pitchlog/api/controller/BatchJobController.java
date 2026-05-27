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

    /**
     * 월드컵 선수 데이터 전체 수집 잡 실행
     * - Step1: 참가국 수집
     * - Step2: 스쿼드 수집
     * - Step3: 선수 통계 수집
     */
    @PostMapping("/sync-players")
    public ResponseEntity<Map<String, String>> syncPlayers() {
        try {
            // 매 실행마다 새 JobInstance 생성을 위해 타임스탬프 파라미터 추가
            JobParameters params = new JobParametersBuilder()
                    .addLong("startedAt", System.currentTimeMillis())
                    .toJobParameters();

            log.info("[BatchJobController] syncWorldCupPlayersJob 실행 요청");
            jobLauncher.run(syncWorldCupPlayers, params);

            return ResponseEntity.ok(Map.of(
                    "status", "STARTED",
                    "message", "syncWorldCupPlayersJob 이 시작됐습니다. 로그를 확인하세요."
            ));
        } catch (Exception e) {
            log.error("[BatchJobController] 잡 실행 실패", e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "FAILED",
                    "message", e.getMessage()
            ));
        }
    }
}
