const TOKEN_KEY = 'pitchlog_admin_token'
const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

export interface AdminUser {
  username: string
  role: string
}

// ── 토큰 저장/조회/삭제 ────────────────────────────────────────────
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

// ── Authorization 헤더 ────────────────────────────────────────────
export function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ── 로그인 ────────────────────────────────────────────────────────
export async function login(
  username: string,
  password: string,
): Promise<{ success: true; user: AdminUser } | { success: false; message: string }> {
  try {
    const res = await fetch(`${BASE}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json()

    if (!res.ok) {
      return { success: false, message: data.error ?? '로그인 실패' }
    }

    setToken(data.token)
    return { success: true, user: { username: data.username, role: data.role } }
  } catch {
    return { success: false, message: '서버에 연결할 수 없습니다.' }
  }
}

// ── 로그아웃 ──────────────────────────────────────────────────────
export function logout(): void {
  removeToken()
}

// ── 현재 사용자 확인 (토큰 검증) ──────────────────────────────────
export async function fetchMe(): Promise<AdminUser | null> {
  const token = getToken()
  if (!token) return null

  try {
    const res = await fetch(`${BASE}/api/admin/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      removeToken()
      return null
    }
    return await res.json()
  } catch {
    return null
  }
}

// ── 어드민 fetch 래퍼 (토큰 자동 주입) ───────────────────────────
export async function adminFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  return fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(init?.headers as Record<string, string> | undefined),
    },
  })
}
