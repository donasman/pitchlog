package com.pitchlog.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Slf4j
@Configuration
public class ApiFootballConfig {

    @Value("${api-football.base-url}")
    private String baseUrl;

    @Value("${api-football.api-key:}")
    private String apiKey;

    @Bean
    public WebClient apiFootballClient() {
        // 키 자체는 절대 로그에 남기지 않고, 주입 여부만 확인할 수 있게 길이와 마스킹 값만 출력한다.
        // (Api-Football 키는 32자. 0이면 환경변수 미주입, 32가 아니면 복사 오류)
        String masked = (apiKey == null || apiKey.isBlank())
                ? "(비어 있음)"
                : apiKey.substring(0, Math.min(4, apiKey.length()))
                  + "..." + apiKey.substring(Math.max(0, apiKey.length() - 4));
        log.info("[ApiFootballConfig] baseUrl={}, apiKey 길이={}, 값={}",
                baseUrl, apiKey == null ? 0 : apiKey.length(), masked);

        if (apiKey == null || apiKey.isBlank()) {
            log.error("[ApiFootballConfig] API_FOOTBALL_KEY 가 주입되지 않았습니다. "
                    + "IntelliJ Run Configuration 의 Environment variables 또는 application-local.yml 을 확인하세요.");
        } else if (apiKey.length() != 32) {
            log.warn("[ApiFootballConfig] API 키 길이가 32자가 아닙니다({}자). "
                    + "복사 과정에서 잘렸거나 공백/따옴표가 섞였을 수 있습니다.", apiKey.length());
        }

        return WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("x-apisports-key", apiKey)
                .build();
    }
}
