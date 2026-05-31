package com.pitchlog.domain.exception;

/**
 * 요청한 리소스(선수, 국가, 경기 등)를 찾을 수 없을 때 발생하는 예외.
 * GlobalExceptionHandler 에서 HTTP 404 로 처리된다.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public static ResourceNotFoundException player(Long id) {
        return new ResourceNotFoundException("선수를 찾을 수 없습니다: " + id);
    }

    public static ResourceNotFoundException country(String code) {
        return new ResourceNotFoundException("국가를 찾을 수 없습니다: " + code);
    }

    public static ResourceNotFoundException match(Integer fixtureId) {
        return new ResourceNotFoundException("경기를 찾을 수 없습니다: " + fixtureId);
    }
}
