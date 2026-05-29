package com.pitchlog.domain.service;

import com.pitchlog.config.JwtUtil;
import com.pitchlog.domain.entity.AdminUser;
import com.pitchlog.domain.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 어드민 인증 서비스.
 * - 로그인: username + password 검증 → JWT 발급
 * - 초기 계정 시딩 (애플리케이션 시작 시 호출)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private final AdminUserRepository adminUserRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    // ── 로그인 ────────────────────────────────────────────────────
    /**
     * @return JWT 토큰 (성공) | null (실패)
     */
    @Transactional(readOnly = true)
    public String login(String username, String rawPassword) {
        return adminUserRepository.findByUsernameAndEnabledTrue(username)
                .filter(user -> passwordEncoder.matches(rawPassword, user.getPasswordHash()))
                .map(user -> {
                    log.info("[AdminAuth] 로그인 성공: {}", username);
                    return jwtUtil.generate(user.getUsername(), user.getRole());
                })
                .orElseGet(() -> {
                    log.warn("[AdminAuth] 로그인 실패: {}", username);
                    return null;
                });
    }

    // ── 초기 계정 시딩 ────────────────────────────────────────────
    /**
     * admin 계정이 없으면 admin/admin1234! 로 생성.
     * 애플리케이션 시작 시 AdminDataInitializer 에서 호출.
     */
    @Transactional
    public void seedDefaultAdmin() {
        if (adminUserRepository.existsByUsername("admin")) {
            return;
        }
        AdminUser admin = AdminUser.create(
                "admin",
                passwordEncoder.encode("admin1234!"),
                "ADMIN"
        );
        adminUserRepository.save(admin);
        log.info("[AdminAuth] 기본 어드민 계정 생성 완료 (username: admin)");
    }
}
