package com.pitchlog.api.controller;

import com.pitchlog.domain.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** 리소스를 찾을 수 없을 때 → 404 */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException e) {
        log.warn("[API] 리소스 없음: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "status", 404,
                "error", "Not Found",
                "message", e.getMessage(),
                "timestamp", LocalDateTime.now().toString()
        ));
    }

    /** 잘못된 요청 파라미터 → 400 */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleBadRequest(IllegalArgumentException e) {
        log.warn("[API] 잘못된 요청: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "status", 400,
                "error", "Bad Request",
                "message", e.getMessage(),
                "timestamp", LocalDateTime.now().toString()
        ));
    }

    /** 정적 리소스 없음 (favicon.ico 등) → 404, 로그 없이 처리 */
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Void> handleNoResource(NoResourceFoundException e) {
        return ResponseEntity.notFound().build();
    }

    /** 핸들러 없음 → 404 */
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNoHandler(NoHandlerFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "status", 404,
                "error", "Not Found",
                "message", e.getMessage(),
                "timestamp", LocalDateTime.now().toString()
        ));
    }

    /** 지원하지 않는 HTTP 메서드 → 405 */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<Map<String, Object>> handleMethodNotSupported(HttpRequestMethodNotSupportedException e) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(Map.of(
                "status", 405,
                "error", "Method Not Allowed",
                "message", e.getMessage(),
                "timestamp", LocalDateTime.now().toString()
        ));
    }

    /** 그 외 예상치 못한 서버 에러 → 500 */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleServerError(Exception e) {
        log.error("[API] 서버 오류: {}", e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "status", 500,
                "error", "Internal Server Error",
                "message", "서버 내부 오류가 발생했습니다.",
                "timestamp", LocalDateTime.now().toString()
        ));
    }
}
