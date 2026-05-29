# ── 1단계: 빌드 ────────────────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Gradle wrapper + 의존성 캐시 레이어
COPY gradlew .
COPY gradle gradle
RUN chmod +x gradlew

COPY build.gradle.kts settings.gradle.kts ./
RUN ./gradlew dependencies --no-daemon -q || true

# 소스 복사 & 빌드
COPY src src
RUN ./gradlew bootJar --no-daemon -x test -q

# ── 2단계: 실행 이미지 ─────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# 보안: non-root 사용자
RUN addgroup -S pitchlog && adduser -S pitchlog -G pitchlog
USER pitchlog

# 빌드 결과물 복사
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

# Railway는 PORT 환경변수로 포트를 주입
ENTRYPOINT ["java", \
  "-Dfile.encoding=UTF-8", \
  "-Dspring.profiles.active=prod", \
  "-jar", "app.jar"]
