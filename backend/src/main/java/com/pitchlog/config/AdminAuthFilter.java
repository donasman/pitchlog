package com.pitchlog.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * 관리자 API 권한 필터 스캐폴드
 *
 * 현재 동작:
 *   - admin.token 이 비어있으면 → 인증 없이 통과 (개발 편의)
 *   - admin.token 이 설정되어 있으면 → X-Admin-Token 헤더 검증
 *
 * 나중에 JWT / Spring Security 로 교체하려면:
 *   1. 이 필터를 비활성화하고 SecurityFilterChain 에서 /api/admin/** 경로를 보호
 *   2. application.yml 에 admin.token 삭제
 */
@Component
public class AdminAuthFilter extends OncePerRequestFilter {

    /** application.yml 에 admin.token: 값 설정 시 활성화 */
    @Value("${admin.token:}")
    private String adminToken;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // /api/admin/** 경로만 필터 적용
        return !request.getRequestURI().startsWith("/api/admin");
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain chain) throws ServletException, IOException {
        // 토큰 미설정 시 인증 스킵 (개발 모드)
        if (adminToken == null || adminToken.isBlank()) {
            chain.doFilter(request, response);
            return;
        }

        String provided = request.getHeader("X-Admin-Token");
        if (adminToken.equals(provided)) {
            chain.doFilter(request, response);
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Unauthorized\"}");
        }
    }
}
