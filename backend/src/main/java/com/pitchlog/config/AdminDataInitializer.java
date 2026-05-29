package com.pitchlog.config;

import com.pitchlog.domain.service.AdminAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * 애플리케이션 시작 시 기본 어드민 계정 시딩.
 * admin 계정이 이미 있으면 아무 동작도 하지 않음.
 *
 * 초기 계정: admin / admin1234!
 * ⚠️ 운영 환경에서는 반드시 비밀번호를 변경하세요.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AdminDataInitializer implements ApplicationRunner {

    private final AdminAuthService adminAuthService;

    @Override
    public void run(ApplicationArguments args) {
        try {
            adminAuthService.seedDefaultAdmin();
        } catch (Exception e) {
            log.error("[AdminDataInitializer] 어드민 계정 시딩 실패: {}", e.getMessage());
        }
    }
}
