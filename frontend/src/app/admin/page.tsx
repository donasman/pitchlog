'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { MatchSummary } from '@/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

function formatDate(iso: string | null) {
  if (!iso) return 'TBD'
  const d = new Date(iso)
  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AdminPage() {
  const [matches, setMatches] = useState<MatchSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadMatches = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/matches`)
      if (!res.ok) throw new Error('Failed to load')
      setMatches(await res.json())
    } catch {
      setError('경기 목록을 불러오지 못했습니다. 백엔드 서버 상태를 확인해주세요.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadMatches() }, [loadMatches])

  const handleDelete = async (fixtureId: number) => {
    if (!confirm('이 경기를 삭제하시겠습니까?')) return
    setDeleting(fixtureId)
    try {
      const res = await fetch(`${API_BASE}/api/admin/matches/${fixtureId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setMatches((prev) => prev.filter((m) => m.fixtureId !== fixtureId))
    } catch {
      alert('삭제 중 오류가 발생했습니다.')
    } finally {
      setDeleting(null)
    }
  }

  // 라운드별 그룹핑
  const roundOrder: string[] = []
  const byRound = new Map<string, MatchSummary[]>()
  for (const m of matches) {
    const r = m.round ?? 'Unknown'
    if (!byRound.has(r)) { byRound.set(r, []); roundOrder.push(r) }
    byRound.get(r)!.push(m)
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* 헤더 */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-0.5">Admin</p>
          <h1 className="text-2xl font-extrabold tracking-tight">경기 일정 관리</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            총 {matches.length}경기
          </p>
        </div>
        <Link
          href="/admin/matches/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <span className="text-lg leading-none">+</span>
          경기 추가
        </Link>
      </div>

      {/* 메인 페이지 링크 */}
      <div className="flex gap-4 text-sm">
        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">&#x2190; 홈으로</Link>
        <Link href="/matches" className="text-muted-foreground hover:text-foreground transition-colors">경기 일정 보기 &rarr;</Link>
      </div>

      {/* 에러 */}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3">
          {error}
        </div>
      )}

      {/* 로딩 */}
      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-muted/40 animate-pulse" />
          ))}
        </div>
      )}

      {/* 경기 목록 없음 */}
      {!loading && matches.length === 0 && !error && (
        <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-3">
          <div className="text-4xl">&#x26BD;</div>
          <p className="font-semibold">등록된 경기가 없습니다</p>
          <p className="text-sm text-muted-foreground">위의 &ldquo;경기 추가&rdquo; 버튼으로 첫 경기를 추가해보세요.</p>
          <Link href="/admin/matches/new"
            className="inline-block mt-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
            경기 추가하기
          </Link>
        </div>
      )}

      {/* 라운드별 경기 목록 */}
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
                  <th className="py-2.5 pl-4 pr-2 text-left w-32">날짜/시간</th>
                  <th className="py-2.5 pr-3 text-left">홈팀</th>
                  <th className="py-2.5 pr-3 text-center w-20">스코어</th>
                  <th className="py-2.5 pr-3 text-left">어웨이팀</th>
                  <th className="py-2.5 pr-3 text-left hidden sm:table-cell">경기장</th>
                  <th className="py-2.5 pr-4 text-center w-24">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {byRound.get(round)!.map((m) => (
                  <tr key={m.fixtureId} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 pl-4 pr-2 text-xs text-muted-foreground">
                      {formatDate(m.matchDate)}
                    </td>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        {m.home.logo && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.home.logo} alt="" className="w-5 h-4 object-cover rounded-sm" />
                        )}
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
                        {m.away.logo && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.away.logo} alt="" className="w-5 h-4 object-cover rounded-sm" />
                        )}
                        <span className="font-medium truncate max-w-[100px]">{m.away.name ?? '-'}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-xs text-muted-foreground hidden sm:table-cell truncate max-w-[120px]">
                      {m.venueName ?? '-'}
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/matches/edit?id=${m.fixtureId}`}
                          className="text-xs px-2.5 py-1 rounded border border-border hover:border-primary/50 hover:text-primary transition-colors"
                        >
                          수정
                        </Link>
                        <button
                          onClick={() => handleDelete(m.fixtureId)}
                          disabled={deleting === m.fixtureId}
                          className="text-xs px-2.5 py-1 rounded border border-border hover:border-red-500/50 hover:text-red-400 disabled:opacity-50 transition-colors"
                        >
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

      {/* 권한 안내 */}
      <div className="rounded-lg border border-border/50 bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
        &#x26A0;&#xFE0F; 현재 관리자 인증 없이 접근 가능합니다. 운영 배포 전에{' '}
        <code className="bg-muted px-1 py-0.5 rounded">application.yml</code>의{' '}
        <code className="bg-muted px-1 py-0.5 rounded">admin.token</code> 값을 설정해주세요.
      </div>
    </div>
  )
}
