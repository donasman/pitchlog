'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { MatchSummary } from '@/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

function StatusBadge({ status, elapsed }: { status: string | null; elapsed: number | null }) {
  if (!status) return null
  const live = ['1H', '2H', 'ET', 'BT', 'P', 'INT'].includes(status)
  const finished = ['FT', 'AET', 'PEN', 'AWD', 'WO'].includes(status)

  if (live) return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-green-400 bg-green-400/10 border border-green-400/30 px-2 py-0.5 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      {elapsed != null ? `${elapsed}'` : '진행중'}
    </span>
  )
  if (finished) return (
    <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">종료</span>
  )
  if (status === 'HT') return (
    <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-2 py-0.5 rounded-full">HT</span>
  )
  return null
}

function MatchCard({ match }: { match: MatchSummary }) {
  const date = match.matchDate ? new Date(match.matchDate) : null
  const isFinished = match.statusShort && ['FT', 'AET', 'PEN', 'AWD', 'WO'].includes(match.statusShort)
  const isLive = match.statusShort && ['1H', '2H', 'HT', 'ET', 'BT', 'P', 'INT'].includes(match.statusShort)
  const hasScore = match.home.goals != null || match.away.goals != null

  return (
    <Link
      href={`/matches/${match.fixtureId}`}
      className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/60 hover:bg-primary/5 transition-all"
    >
      {/* 날짜/시간 */}
      <div className="w-14 text-center flex-shrink-0">
        {date ? (
          <>
            <p className="text-xs text-muted-foreground">
              {date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
            </p>
            <p className="text-xs font-semibold">
              {date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </p>
          </>
        ) : (
          <span className="text-xs text-muted-foreground">미정</span>
        )}
      </div>

      {/* 홈팀 */}
      <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
        <span className={['font-semibold text-sm truncate',
          isFinished && (match.home.goals ?? 0) > (match.away.goals ?? 0)
            ? 'text-foreground' : 'text-muted-foreground',
        ].join(' ')}>{match.home.name ?? '-'}</span>
        {match.home.logo
          ? <img src={match.home.logo} alt="" className="w-7 h-7 object-contain flex-shrink-0" /> // eslint-disable-line @next/next/no-img-element
          : <div className="w-7 h-7 rounded bg-muted flex-shrink-0" />}
      </div>

      {/* 스코어 */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0 w-20">
        {hasScore ? (
          <div className={['flex items-center gap-2 px-3 py-1 rounded-lg font-bold text-lg',
            isLive ? 'bg-green-400/10' : isFinished ? 'bg-muted/60' : 'bg-muted/30',
          ].join(' ')}>
            <span>{match.home.goals ?? 0}</span>
            <span className="text-muted-foreground/60 text-sm">-</span>
            <span>{match.away.goals ?? 0}</span>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">vs</span>
        )}
        <StatusBadge status={match.statusShort} elapsed={match.elapsed} />
        {match.hasLineup && !isLive && !isFinished && (
          <span className="text-[10px] text-primary/70">라인업</span>
        )}
      </div>

      {/* 어웨이팀 */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        {match.away.logo
          ? <img src={match.away.logo} alt="" className="w-7 h-7 object-contain flex-shrink-0" /> // eslint-disable-line @next/next/no-img-element
          : <div className="w-7 h-7 rounded bg-muted flex-shrink-0" />}
        <span className={['font-semibold text-sm truncate',
          isFinished && (match.away.goals ?? 0) > (match.home.goals ?? 0)
            ? 'text-foreground' : 'text-muted-foreground',
        ].join(' ')}>{match.away.name ?? '-'}</span>
      </div>

      <svg className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors flex-shrink-0"
           fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(`${API_BASE}/api/matches`, { cache: 'no-store' })
      if (!res.ok) throw new Error()
      setMatches(await res.json())
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const roundOrder: string[] = []
  const byRound = new Map<string, MatchSummary[]>()
  for (const m of matches) {
    const r = m.round ?? '기타'
    if (!byRound.has(r)) { byRound.set(r, []); roundOrder.push(r) }
    byRound.get(r)!.push(m)
  }

  return (
    <div className="wrap space-y-10 py-8 max-w-4xl mx-auto">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">경기 일정</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          &#x1F3DF;&#xFE0F; 경기 일정
        </h1>
        <p className="text-muted-foreground text-sm">2026 FIFA 월드컵 &middot; 미국 / 캐나다 / 멕시코</p>
      </div>

      {/* 로딩 */}
      {loading && (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-muted/40 animate-pulse" />
          ))}
        </div>
      )}

      {/* 에러 */}
      {error && !loading && (
        <div className="rounded-xl border border-border bg-card p-12 text-center space-y-3">
          <div className="text-4xl">&#x26BD;</div>
          <p className="font-semibold">경기 일정을 불러오지 못했습니다</p>
          <p className="text-sm text-muted-foreground">서버에 연결할 수 없습니다.</p>
          <button onClick={load}
            className="mt-2 px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
            다시 시도
          </button>
        </div>
      )}

      {/* 경기 없음 */}
      {!loading && !error && matches.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-12 text-center space-y-2">
          <div className="text-4xl">&#x26BD;</div>
          <p className="font-semibold">등록된 경기가 없습니다</p>
          <p className="text-sm text-muted-foreground">
            <Link href="/admin" className="text-primary underline underline-offset-2">관리자 패널</Link>에서 경기를 추가해주세요.
          </p>
        </div>
      )}

      {/* 라운드별 목록 */}
      {!loading && !error && roundOrder.map((round) => (
        <section key={round}>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary">{round}</h2>
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">{byRound.get(round)!.length}경기</span>
          </div>
          <div className="space-y-2">
            {byRound.get(round)!.map((match) => (
              <MatchCard key={match.fixtureId} match={match} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
