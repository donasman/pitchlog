'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { MatchSummary } from '@/types'
import { fetchMe, adminFetch, logout, type AdminUser } from '@/lib/adminAuth'
import { API_BASE } from '@/lib/config'
import { formatDateTime } from '@/lib/format'

export default function AdminPage() {
  const router = useRouter()
  const [admin, setAdmin]       = useState<AdminUser | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [matches, setMatches]   = useState<MatchSummary[]>([])
  const [loading, setLoading]   = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [error, setError]       = useState<string | null>(null)

  // ── 인증 확인 ──────────────────────────────────────────────────
  useEffect(() => {
    fetchMe().then((user) => {
      if (!user) {
        router.replace('/admin/login')
      } else {
        setAdmin(user)
        setAuthChecked(true)
      }
    })
  }, [router])

  // ── 경기 목록 로드 ─────────────────────────────────────────────
  const loadMatches = useCallback(async () => {
    try {
      // 경기 목록은 공개 API
      const res = await fetch(
        `${API_BASE}/api/matches`,
        { cache: 'no-store' },
      )
      if (!res.ok) throw new Error('불러오기 실패')
      setMatches(await res.json())
    } catch {
      setError('경기 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authChecked) loadMatches()
  }, [authChecked, loadMatches])

  // ── 경기 삭제 ──────────────────────────────────────────────────
  const handleDelete = async (fixtureId: number) => {
    if (!confirm('이 경기를 삭제하시겠습니까?')) return
    setDeleting(fixtureId)
    try {
      const res = await adminFetch(`/api/admin/matches/${fixtureId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('삭제 실패')
      setMatches((prev) => prev.filter((m) => m.fixtureId !== fixtureId))
    } catch {
      alert('경기 삭제에 실패했습니다.')
    } finally {
      setDeleting(null)
    }
  }

  // ── 로그아웃 ───────────────────────────────────────────────────
  const handleLogout = () => {
    logout()
    router.replace('/admin/login')
  }

  // 인증 확인 전 로딩
  if (!authChecked) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const roundOrder: string[] = []
  const byRound = new Map<string, MatchSummary[]>()
  for (const m of matches) {
    const r = m.round ?? '기타'
    if (!byRound.has(r)) { byRound.set(r, []); roundOrder.push(r) }
    byRound.get(r)!.push(m)
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* 헤더 */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-0.5">Admin</p>
          <h1 className="text-2xl font-extrabold tracking-tight">경기 관리</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{matches.length}개 경기 등록됨</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/matches/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            <span className="text-lg leading-none">+</span>
            경기 추가
          </Link>
        </div>
      </div>

      {/* 어드민 정보 + 로그아웃 */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2.5 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          <span className="font-medium text-foreground">{admin?.username}</span>
          <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">
            {admin?.role}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          로그아웃
        </button>
      </div>

      <div className="flex gap-4 text-sm">
        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">&#x2190; 홈</Link>
        <Link href="/matches" className="text-muted-foreground hover:text-foreground transition-colors">경기 일정 보기 &#x2192;</Link>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3">{error}</div>
      )}

      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-muted/40 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && matches.length === 0 && !error && (
        <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-3">
          <div className="text-4xl">&#x26BD;</div>
          <p className="font-semibold">등록된 경기가 없습니다</p>
          <Link href="/admin/matches/new"
            className="inline-block mt-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
            첫 경기 추가
          </Link>
        </div>
      )}

      {!loading && roundOrder.map((round) => (
        <section key={round}>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary">{round}</h2>
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">{byRound.get(round)!.length}경기</span>
          </div>

          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-2.5 pl-4 pr-2 text-left w-28">날짜</th>
                  <th className="py-2.5 pr-3 text-left">홈팀</th>
                  <th className="py-2.5 pr-3 text-center w-20">스코어</th>
                  <th className="py-2.5 pr-3 text-left">원정팀</th>
                  <th className="py-2.5 pr-3 text-left hidden sm:table-cell">경기장</th>
                  <th className="py-2.5 pr-4 text-center w-24">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {byRound.get(round)!.map((m) => (
                  <tr key={m.fixtureId} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 pl-4 pr-2 text-xs text-muted-foreground">{formatDateTime(m.matchDate)}</td>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        {m.home.logo && <img src={m.home.logo} alt="" className="w-5 h-4 object-cover rounded-sm" />}{/* eslint-disable-line @next/next/no-img-element */}
                        <span className="font-medium truncate max-w-[100px]">{m.home.name ?? '-'}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-center font-bold">
                      {m.home.goals != null && m.away.goals != null
                        ? `${m.home.goals} - ${m.away.goals}`
                        : <span className="text-muted-foreground font-normal text-xs">vs</span>}
                    </td>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        {m.away.logo && <img src={m.away.logo} alt="" className="w-5 h-4 object-cover rounded-sm" />}{/* eslint-disable-line @next/next/no-img-element */}
                        <span className="font-medium truncate max-w-[100px]">{m.away.name ?? '-'}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-xs text-muted-foreground hidden sm:table-cell truncate max-w-[120px]">
                      {m.venueName ?? '-'}
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/matches/edit?id=${m.fixtureId}`}
                          className="text-xs px-2.5 py-1 rounded border border-border hover:border-primary/50 hover:text-primary transition-colors">
                          수정
                        </Link>
                        <button onClick={() => handleDelete(m.fixtureId)} disabled={deleting === m.fixtureId}
                          className="text-xs px-2.5 py-1 rounded border border-border hover:border-red-500/50 hover:text-red-400 disabled:opacity-50 transition-colors">
                          {deleting === m.fixtureId ? '...' : '삭제'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  )
}
