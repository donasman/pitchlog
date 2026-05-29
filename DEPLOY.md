# PitchLog 배포 가이드

## 배포 아키텍처

```
GitHub → Railway (Spring Boot + PostgreSQL)
GitHub → Cloudflare Pages (Next.js 정적 빌드)
```

---

## 1. Railway — 백엔드 + DB

### 1-1. PostgreSQL 서비스 생성
1. Railway 대시보드 → New Project → Add PostgreSQL
2. `DATABASE_URL` 자동 생성됨 (Spring Boot에 자동 주입)

### 1-2. 스키마 적용
```bash
# Railway DB에 schema.sql 적용 (최초 1회)
railway connect postgresql
# 접속 후:
\i backend/src/main/resources/db/schema.sql
```

또는 Railway 대시보드 → Database → Query 탭에서 schema.sql 내용 붙여넣기

### 1-3. Spring Boot 서비스 생성
1. New Service → GitHub Repo → pitchlog
2. Root Directory: `backend`
3. 환경변수 설정 (아래 참고)

### 1-4. Railway 환경변수 목록

| 변수명 | 값 | 비고 |
|---|---|---|
| `DATABASE_URL` | (PostgreSQL 서비스에서 자동) | Railway 내부 연결 |
| `API_FOOTBALL_KEY` | `your-api-football-key` | API-Football 발급 |
| `ADMIN_JWT_SECRET` | 랜덤 64자 문자열 | ⚠️ 반드시 강력하게 설정 |
| `CORS_ALLOWED_ORIGINS` | `https://pitchlog.com` | 프로덕션 도메인 |
| `SPRING_PROFILES_ACTIVE` | `prod` | 프로덕션 프로파일 |

> JWT 시크릿 생성: `openssl rand -base64 64`

### 1-5. 배포 후 데이터 수집
```bash
# 월드컵 데이터 배치 실행 (한 번만)
curl -X POST https://pitchlog-backend.up.railway.app/api/batch/sync-players \
  -H "Authorization: Bearer <admin-jwt-token>"
```

---

## 2. Cloudflare Pages — 프론트엔드

### 2-1. Pages 프로젝트 생성
1. Cloudflare Dashboard → Pages → Create Project
2. GitHub 연결 → pitchlog 저장소 선택
3. 설정:
   - **Framework preset**: Next.js (Static HTML Export)
   - **Root directory**: `frontend`
   - **Build command**: `npm run build`
   - **Output directory**: `out`

### 2-2. 환경변수 설정

| 변수명 | 값 |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://pitchlog-backend.up.railway.app` |

### 2-3. 커스텀 도메인 연결
1. Pages → Custom domains → `pitchlog.com` 추가
2. Cloudflare DNS에 CNAME 레코드 자동 추가

---

## 3. 서비스 오픈 체크리스트

- [ ] Railway DB 스키마 적용 완료
- [ ] Railway 환경변수 전체 설정
- [ ] Spring Boot 헬스체크 확인: `GET /actuator/health`
- [ ] 배치 잡 실행 → 데이터 수집 완료
- [ ] Cloudflare Pages 빌드 성공
- [ ] `NEXT_PUBLIC_API_URL` 프로덕션 URL로 설정
- [ ] `pitchlog.com` 도메인 연결
- [ ] 어드민 비밀번호 변경 (admin/admin1234! → 강력한 비밀번호)
- [ ] Google Search Console 등록 + sitemap 제출
- [ ] Google AdSense 신청 + 광고 코드 삽입

---

## 4. 어드민 비밀번호 변경 (배포 직후 필수)

```sql
-- Railway DB에서 직접 실행
-- BCrypt 해시는 https://bcrypt-generator.com 에서 생성 (rounds: 10)
UPDATE admin_users
SET password_hash = '$2a$10$...'  -- 새 BCrypt 해시
WHERE username = 'admin';
```

---

## 5. 예상 월 비용

| 서비스 | 비용 |
|---|---|
| Railway Hobby (백엔드 + DB) | $5~10/월 |
| Cloudflare Pages | $0 |
| **합계** | **$5~10/월** |
