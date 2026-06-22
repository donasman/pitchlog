'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import type { MatchSummary } from '@/types'
import { API_BASE } from '@/lib/config'
import TeamLogo from '@/components/ui/TeamLogo'
import PageHeader from '@/components/ui/PageHeader'
import StatusBadge from '@/components/match/StatusBadge'
import { isLive as isLiveStatus, isFinished as isFinishedStatus } from '@/lib/matchStatus'

// ── KST date utils ──────────────────────────────────────────────
function toKSTISO(iso: string): string {
  const d = new Date(iso)
  return new Date(d.getTime() + 9 * 60 * 60 * 1000).toISOString()
}
function kstDateStr(iso: string): string { return toKSTISO(iso).slice(0, 10) }
function kstTodayStr(): string { return kstDateStr(new Date().toISOString()) }

function relativeLabel(dateStr: string): string | null {
  const today = kstTodayStr()
  const now = new Date()
  const yesterday = kstDateStr(new Date(now.getTime() - 86400000).toISOString())
  const tomorrow  = kstDateStr(new Date(now.getTime() + 86400000).toISOString())
  if (dateStr === today)     return '오늘'
  if (dateStr === yesterday) return '어제'
  if (dateStr === tomorrow)  return '내일'
  return null
}

function formatDateHeader(dateStr: string): string {
  const rel = relativeLabel(dateStr)
  const d = new Date(dateStr + 'T00:00:00+09:00')
  const dayNames = ['일', '월', '화', '수', '목', '금', '토']
  const base = `${d.getMonth() + 1}월 ${d.getDate()}일 (${dayNames[d.getDay()]})`
  return rel ? `${rel} · ${base}` : base
}

// ── Group letter helper ─────────────────────────────────────────
function groupLetter(groupName: string | null): string | null {
  if (!groupName) return null
  const m = groupName.match(/Group\s+([A-L])\b/i)
  return m ? m[1].toUpperCase() : null
}

// ── MatchCard ───────────────────────────────────────────────────
function MatchCard({ match }: { match: MatchSummary }) {
  const isFinished = isFinishedStatus(match.statusShort)
  const isLive     = isLiveStatus(match.statusShort) || match.statusShort === 'HT'
  const hasScore   = match.home.goals != null || match.away.goals != null
  const letter     = groupLetter(match.groupName)

  const timeStr = match.matchDate
    ? new Date(match.matchDate).toLocaleTimeString('ko-KR', {
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Seoul',
      })
    : '미정'

  return (
    <Link
      href={`/matches/${match.fixtureId}`}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '13px 16px',
        background: 'var(--surface)',
        border: `1px solid ${isLive ? 'var(--gold-line)' : 'var(--line)'}`,
        borderRadius: 12,
        textDecoration: 'none',
        transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      {/* Group badge + time */}
      <div style={{ width: 60, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        {letter ? (
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 22, height: 20, borderRadius: 5,
            background: 'var(--gold)', color: 'var(--gold-fg)',
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 11,
            letterSpacing: '0.02em',
          }}>
            {letter}
          </span>
        ) : (
          <span style={{ fontSize: 10, color: 'var(--ink-3)', fontFamily: 'Space Mono, monospace', textAlign: 'center' }}>
            {(match.round ?? '').replace('Group Stage - ', '').slice(0, 8)}
          </span>
        )}
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--ink-3)' }}>
          {timeStr}
        </span>
      </div>

      {/* Home */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 7, minWidth: 0 }}>
        <span style={{
          fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          color: isFinished && (match.home.goals ?? 0) > (match.away.goals ?? 0) ? 'var(--ink)' : 'var(--ink-2)',
        }}>{match.home.name ?? '-'}</span>
        <TeamLogo src={match.home.logo} className="w-7 h-7 flex-shrink-0" />
      </div>

      {/* Score */}
      <div style={{ width: 72, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        {hasScore ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 8,
            background: isLive ? 'rgba(39,194,129,0.12)' : 'var(--surface-2)',
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 17, color: 'var(--ink)',
          }}>
            <span>{match.home.goals ?? 0}</span>
            <span style={{ color: 'var(--ink-3)', fontSize: 12 }}>-</span>
            <span>{match.away.goals ?? 0}</span>
          </div>
        ) : (
          <span style={{ fontSize: 13, color: 'var(--ink-3)', fontFamily: 'Space Mono, monospace' }}>vs</span>
        )}
        <StatusBadge status={match.statusShort} elapsed={match.elapsed} />
      </div>

      {/* Away */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
        <TeamLogo src={match.away.logo} className="w-7 h-7 flex-shrink-0" />
        <span style={{
          fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          color: isFinished && (match.away.goals ?? 0) > (match.home.goals ?? 0) ? 'var(--ink)' : 'var(--ink-2)',
        }}>{match.away.name ?? '-'}</span>
      </div>

      <svg style={{ width: 14, height: 14, color: 'var(--ink-3)', flexShrink: 0 }}
           fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}

// ── Page ────────────────────────────────────────────────────────
export default function MatchesPage() {
  const [matches, setMatches]   = useState<MatchSummary[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(false)
  const todayRef                = useRef<HTMLElement | null>(null)

  const load = useCallback(async () => {
    setLoading(true); setError(false)
    try {
      const res = await fetch(`${API_BASE}/api/matches`, { cache: 'no-store' })
      if (!res.ok) throw new Error()
      setMatches(await res.json())
    } catch { setError(true) }
    finally   { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  // Scroll to today section after data loads
  useEffect(() => {
    if (!loading && todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [loading])

  // Group by KST date
  const today = kstTodayStr()
  const dateOrder: string[] = []
  const byDate = new Map<string, MatchSummary[]>()
  for (const m of matches) {
    if (!m.matchDate) continue
    const d = kstDateStr(m.matchDate)
    if (!byDate.has(d)) { byDate.set(d, []); dateOrder.push(d) }
    byDate.get(d)!.push(m)
  }
  dateOrder.sort()

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px 64px' }}>
      <PageHeader
        eyebrow="경기 일정"
        title={<>🏟️ 경기 일정</>}
        subtitle="2026 FIFA 월드컵 · 미국 / 캐나다 / 멕시코"
      />

      {/* 날짜 퀵점프 */}
      {!loading && !error && dateOrder.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 24, marginBottom: 4 }}>
          {dateOrder.map((d) => {
            const rel = relativeLabel(d)
            const label = rel ?? (() => {
              const dt = new Date(d + 'T00:00:00+09:00')
              return `${dt.getMonth() + 1}/${dt.getDate()}`
            })()
            const isToday = d === today
            return (
              <button
                key={d}
                onClick={() => document.getElementById(`date-${d}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                style={{
                  padding: '5px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
                  border: `1px solid ${isToday ? 'var(--gold)' : 'var(--line)'}`,
                  background: isToday ? 'var(--gold-soft)' : 'var(--surface)',
                  color: isToday ? 'var(--gold)' : 'var(--ink-2)',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: isToday ? 700 : 500,
                  transition: 'all 0.15s',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ height: 62, borderRadius: 12, background: 'var(--surface-2)', opacity: 0.6 }} />
          ))}
        </div>
      )}

      {error && !loading && (
        <div style={{ padding: '60px 0', textAlign: 'center' }}>
          <p style={{ color: 'var(--ink-3)', marginBottom: 12 }}>경기 일정을 불러오지 못했습니다</p>
          <button onClick={load} style={{
            padding: '8px 20px', borderRadius: 8, border: '1px solid var(--line)',
            background: 'var(--surface)', color: 'var(--ink)', cursor: 'pointer', fontSize: 14,
          }}>다시 시도</button>
        </div>
      )}

      {!loading && !error && matches.length === 0 && (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--ink-3)' }}>
          등록된 경기가 없습니다
        </div>
      )}

      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginTop: 24 }}>
          {dateOrder.map((dateStr) => {
            const isToday = dateStr === today
            return (
              <section
                key={dateStr}
                id={`date-${dateStr}`}
                ref={isToday ? (el) => { todayRef.current = el } : undefined}
              >
                {/* 날짜 헤더 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14,
                    color: isToday ? 'var(--gold)' : 'var(--ink)',
                  }}>
                    {formatDateHeader(dateStr)}
                  </span>
                  {isToday && (
                    <span style={{
                      padding: '2px 8px', borderRadius: 999,
                      background: 'var(--gold)', color: 'var(--gold-fg)',
                      fontSize: 10, fontFamily: 'Space Mono, monospace',
                      fontWeight: 700, letterSpacing: '0.08em',
                    }}>TODAY</span>
                  )}
                  <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
                  <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                    {byDate.get(dateStr)!.length}경기
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {byDate.get(dateStr)!.map((match) => (
                    <MatchCard key={match.fixtureId} match={match} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
