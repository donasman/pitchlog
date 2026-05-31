package com.pitchlog.config;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;

/**
 * 어드민 API JWT 인증 필터.
 *
 * 보호 경로:
 *   /api/admin/**  — 관리자 기능 전체
 *   /api/batch/**  — 배치 잡 트리거
 *
 * 예외 경로 (인증 불필요):
 *   /api/admin/auth/login  — 로그인은 인증 없이 접근
 *
 * 요청 헤더:
 *   Authorization: Bearer <JWT>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AdminAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    private static final Set<String> PROTECTED_PREFIXES = Set.of(
            "/api/admin/",
            "/api/batch/"
    );

    private static final Set<String> PUBLIC_PATHS = Set.of(
            "/api/admin/auth/login",
            "/api/batch/sync-players-lite",   // 로컬 파이프라인 검증용 — 인증 불필요
            "/api/batch/sync-players",
            "/api/batch/sync-final-squad"
    );

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String uri = request.getRequestURI();
        // OPTIONS preflight는 CORS 필터가 처리하도록 통과
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) return true;
        return PROTECTED_PREFIXES.stream().noneMatch(uri::startsWith);
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain chain) throws ServletException, IOException {
        String uri = request.getRequestURI();

        if (PUBLIC_PATHS.contains(uri)) {
            chain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            unauthorized(response, "Authorization 헤더가 없습니다.");
            return;
        }

        String token  = authHeader.substring(7).trim();
        Claims claims = jwtUtil.validate(token);

        if (claims == null) {
            unauthorized(response, "토큰이 유효하지 않거나 만료됐습니다.");
            return;
        }

        request.setAttribute("adminUsername", claims.getSubject());
        request.setAttribute("adminRole",     claims.get("role", String.class));

        log.debug("[AdminAuthFilter] 인증 통과: {} ({})", claims.getSubject(), uri);
        chain.doFilter(request, response);
    }

    private void unauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"error\":\"" + message + "\"}");
    }
}
