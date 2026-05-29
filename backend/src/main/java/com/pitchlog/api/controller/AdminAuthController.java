package com.pitchlog.api.controller;

import com.pitchlog.config.JwtUtil;
import com.pitchlog.domain.service.AdminAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 어드민 인증 엔드포인트.
 *
 * POST /api/admin/auth/login  — 로그인 → JWT 발급
 * GET  /api/admin/auth/me     — 현재 사용자 정보 확인 (토큰 검증)
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminAuthService adminAuthService;
    private final JwtUtil jwtUtil;

    public record LoginRequest(String username, String password) {}

    /** 로그인 */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest req) {
        if (req.username() == null || req.password() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "username과 password를 입력하세요."));
        }

        String token = adminAuthService.login(req.username(), req.password());
        if (token == null) {
            return ResponseEntity.status(401).body(Map.of("error", "아이디 또는 비밀번호가 올바르지 않습니다."));
        }

        return ResponseEntity.ok(Map.of(
                "token", token,
                "username", req.username(),
                "role", jwtUtil.extractRole(token)
        ));
    }

    /**
     * 토큰 유효성 확인 + 사용자 정보 반환.
     * Authorization: Bearer <token> 헤더 필요.
     * (AdminAuthFilter 를 통과해야 이 메서드에 도달)
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "").trim();
        String username = jwtUtil.extractUsername(token);
        String role     = jwtUtil.extractRole(token);

        return ResponseEntity.ok(Map.of(
                "username", username,
                "role", role
        ));
    }
}
