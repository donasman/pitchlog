/**
 * 프론트엔드 전역 설정 값.
 *
 * API_BASE: 백엔드 REST API 베이스 URL.
 * - 운영(Cloudflare Pages)에서는 빌드 시 NEXT_PUBLIC_API_URL 환경변수로 주입한다.
 * - 환경변수가 없으면 로컬 개발 서버(localhost:8080)를 기본값으로 사용한다.
 */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

/**
 * SITE_URL: 배포된 프론트엔드의 공개 주소.
 * canonical / OpenGraph / sitemap 의 기준 URL로 사용한다.
 * 커스텀 도메인을 붙이면 NEXT_PUBLIC_SITE_URL 로 덮어쓴다.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pitchlog.pages.dev'
