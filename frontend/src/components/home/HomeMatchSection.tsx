'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { MatchSummary } from '@/types'
import { API_BASE } from '@/lib/config'
import TeamLogo from '@/components/ui/TeamLogo'
import StatusBadge from '@/components/match/StatusBadge'
import { isLive as isLiveStatus, isFinished as isFinishedStatus } from '@/lib/matchStatus'

// ── KST utils ───────────────────────────────────────────────────
function toUtc(iso: string): string {
  return iso.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(iso) ? iso : iso + 'Z'
}
function kstDateStr(iso: string): string {
  const d = new Date(toUtc(iso))
  return new Date(d.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10)
}
function kstTodayStr(): string { return kstDateStr(new Date().toISOString()) }
function kstYesterdayStr(): string {
  return kstDateStr(new Date(Date.now() - 86400000).toISOString())
}
function kstTimeStr(iso: string): string {
  const d = new Date(new Date(toUtc(iso)).getTime() + 9 * 60 * 60 * 1000)
  return String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0')
}

const LIVE_STATUSES = new Set(['1H', '2H', 'HT', 'ET', 'BT', 'P', 'INT', 'LIVE'])

function effectiveStatus(match: MatchSummary): string | null {
  if (!match.statusShort || !LIVE_STATUSES.has(match.statusShort)) return match.statusShort ?? null
  if (!match.matchDate) return match.statusShort
  const kickoff = new Date(toUtc(match.matchDate)).getTime()
  if (Date.now() > kickoff + 2 * 60 * 60 * 1000) return 'FT'
  return match.statusShort
}

interface SplitMatches {
  upcoming: MatchSummary[]
  finished: MatchSummary[]
  hasLive: boolean
  upcomingLabel: string
}

function splitMatches(all: MatchSummary[]): SplitMatches {
  const today     = kstTodayStr()
  const yesterday = kstYesterdayStr()
  const tomorrow  = kstDateStr(new Date(Date.now() + 86400000).toISOString())

  const todayMatches = all.filter(m => m.matchDate && kstDateStr(m.matchDate) === today)
  const yesterdayFT  = all
    .filter(m => m.matchDate && kstDateStr(m.matchDate) === yesterday)
    .filter(m => isFinishedStatus(effectiveStatus(m)))
    .sort((a, b) => new Date(toUtc(a.matchDate!)).getTime() - new Date(toUtc(b.matchDate!)).getTime())

  if (todayMatches.length === 0) {
    const tomorrowNS = all
      .filter(m => m.matchDate && kstDateStr(m.matchDate) === tomorrow && m.statusShort === 'NS')
      .sort((a, b) => new Date(toUtc(a.matchDate!)).getTime() - new Date(toUtc(b.matchDate!)).getTime())
    return { upcoming: tomorrowNS, finished: yesterdayFT, hasLive: false, upcomingLabel: '내일의 경기' }
  }

  const todayNSAndLive = todayMatches
    .filter(m => { const s = effectiveStatus(m); return s === 'NS' || isLiveStatus(s) || s === 'HT' })
    .sort((a, b) => new Date(toUtc(a.matchDate!)).getTime() - new Date(toUtc(b.matchDate!)).getTime())

  const todayFT = todayMatches
    .filter(m => isFinishedStatus(effectiveStatus(m)))
    .sort((a, b) => new Date(toUtc(a.matchDate!)).getTime() - new Date(toUtc(b.matchDate!)).getTime())

  const hasLive = todayNSAndLive.some(m => { const s = effectiveStatus(m); return isLiveStatus(s) || s === 'HT' })

  return {
    upcoming: todayNSAndLive,
    finished: [...todayFT, ...yesterdayFT],
    hasLive,
    upcomingLabel: hasLive ? '진행 중인 경기' : '오늘의 경기',
  }
}

function MiniMatchCard({ match }: { match: MatchSummary }) {
  const status     = effectiveStatus(match)
  const isFinished = isFinishedStatus(status)
  const isLive     = isLiveStatus(status) || status === 'HT'
  const hasScore   = match.home.goals != null || match.away.goals != null
  const timeStr    = match.matchDate ? kstTimeStr(match.matchDate) : '미정'

  return (
    <Link
      href={'/matches/' + match.fixtureId}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 14px',
        background: 'var(--surface)',
        border: '0.5px solid ' + (isLive ? 'var(--gold-line)' : 'var(--line)'),
        borderRadius: 12,
        boxShadow: isLive
          ? '0 0 0 1px var(--gold-line), 0 2px 8px rgba(0,0,0,0.06)'
          : '0 1px 3px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.03)',
        textDecoration: 'none',
        transition: 'box-shadow 0.15s, border-color 0.15s',
      }}
    >
      <div style={{ width: 44, flexShrink: 0, textAlign: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'Space Mono, monospace' }}>{timeStr}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, minWidth: 0 }}>
        <span style={{
          fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          color: isFinished && (match.home.goals ?? 0) > (match.away.goals ?? 0) ? 'var(--ink)' : 'var(--ink-2)',
        }}>{match.home.name ?? '-'}</span>
        <TeamLogo src={match.home.logo} className="w-6 h-6 flex-shrink-0" />
      </div>
      <div style={{ width: 64, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {hasScore ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '3px 8px', borderRadius: 7,
            background: isLive ? 'var(--gold-soft)' : 'var(--surface-2)',
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--ink)',
          }}>
            <span>{match.home.goals ?? 0}</span>
            <span style={{ color: 'var(--ink-3)', fontSize: 11 }}>-</span>
            <span>{match.away.goals ?? 0}</span>
          </div>
        ) : (
          <span style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: 'Space Mono, monospace' }}>vs</span>
        )}
        <StatusBadge status={status} elapsed={match.elapsed} />
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
        <TeamLogo src={match.away.logo} className="w-6 h-6 flex-shrink-0" />
        <span style={{
          fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          color: isFinished && (match.away.goals ?? 0) > (match.home.goals ?? 0) ? 'var(--ink)' : 'var(--ink-2)',
        }}>{match.away.name ?? '-'}</span>
      </div>
    </Link>
  )
}

export default function HomeMatchSection() {
  const [matches, setMatches]     = useState<MatchSummary[]>([])
  const [loading, setLoading]     = useState(true)
  const [lastUpdated, setUpdated] = useState<Date | null>(null)

  const fetchMatches = () => {
    fetch(API_BASE + '/api/matches', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : [])
      .then((data: MatchSummary[]) => { setMatches(data); setUpdated(new Date()) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const fetchRef = useRef(fetchMatches)
  fetchRef.current = fetchMatches

  // 최초 로드
  useEffect(() => { fetchRef.current() }, [])

  const { upcoming, finished, hasLive, upcomingLabel } = splitMatches(matches)

  // 동적 폴링: 라이브 경기 있으면 10초, 없으면 60초
  useEffect(() => {
    if (loading) return
    const interval = hasLive ? 10_000 : 60_000
    const tick = () => { if (document.visibilityState === 'visible') fetchRef.current() }
    const id = setInterval(tick, interval)
    document.addEventListener('visibilitychange', tick)
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', tick) }
  }, [hasLive, loading])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <span className="eyebrow">{hasLive ? 'LIVE' : 'TODAY'}</span>
          {lastUpdated && (
            <span style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'Space Mono, monospace' }}>
              {lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Seoul' })} 기준
            </span>
          )}
          {hasLive && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 10, color: 'var(--live)', fontFamily: 'Space Mono, monospace', fontWeight: 700,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%', background: 'var(--live)',
                animation: 'pulse 1.5s ease-in-out infinite', display: 'inline-block',
              }} />
              실시간
            </span>
          )}
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          <Link href="/matches" style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600, textDecoration: 'none' }}>
            전체 보기 →
          </Link>
        </div>
        <h2 style={{
          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800,
          fontSize: 'clamp(20px, 3vw, 26px)', letterSpacing: '-0.03em', color: 'var(--ink)', marginBottom: 12,
        }}>{upcomingLabel}</h2>
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ height: 56, borderRadius: 12, background: 'var(--surface-2)', opacity: 0.6 }} />
            ))}
          </div>
        )}
        {!loading && upcoming.length === 0 && (
          <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--ink-3)', fontSize: 14 }}>
            오늘 예정된 경기가 없습니다
          </div>
        )}
        {!loading && upcoming.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {upcoming.map(m => <MiniMatchCard key={m.fixtureId} match={m} />)}
          </div>
        )}
      </section>

      {!loading && finished.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span className="eyebrow">RESULTS</span>
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
            <Link href="/matches" style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 500, textDecoration: 'none' }}>
              더 보기 →
            </Link>
          </div>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800,
            fontSize: 'clamp(20px, 3vw, 26px)', letterSpacing: '-0.03em', color: 'var(--ink)', marginBottom: 12,
          }}>완료된 경기</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {finished.map(m => <MiniMatchCard key={m.fixtureId} match={m} />)}
          </div>
        </section>
      )}
    </div>
  )
}
