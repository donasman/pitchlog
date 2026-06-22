'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { MatchSummary } from '@/types'
import { API_BASE } from '@/lib/config'
import TeamLogo from '@/components/ui/TeamLogo'
import StatusBadge from '@/components/match/StatusBadge'
import { isLive as isLiveStatus, isFinished as isFinishedStatus } from '@/lib/matchStatus'

// ── KST utils ───────────────────────────────────────────────────
function kstDateStr(iso: string): string {
  const d = new Date(iso)
  return new Date(d.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10)
}
function kstTodayStr(): string { return kstDateStr(new Date().toISOString()) }

// ── Smart match selection (KST) ─────────────────────────────────
function selectMatchesToShow(all: MatchSummary[]): { matches: MatchSummary[], label: string } {
  const today     = kstTodayStr()
  const now       = new Date()
  const yesterday = kstDateStr(new Date(now.getTime() - 86400000).toISOString())
  const tomorrow  = kstDateStr(new Date(now.getTime() + 86400000).toISOString())

  const todayMatches     = all.filter(m => m.matchDate && kstDateStr(m.matchDate) === today)
  const yesterdayMatches = all.filter(m => m.matchDate && kstDateStr(m.matchDate) === yesterday)
  const tomorrowMatches  = all.filter(m => m.matchDate && kstDateStr(m.matchDate) === tomorrow)

  const todayAllDone = todayMatches.length > 0 &&
    todayMatches.every(m => isFinishedStatus(m.statusShort))

  if (todayMatches.length === 0 && yesterdayMatches.length === 0) {
    const upcoming = all
      .filter(m => m.matchDate && m.statusShort === 'NS')
      .sort((a, b) => new Date(a.matchDate!).getTime() - new Date(b.matchDate!).getTime())
      .slice(0, 6)
    return { matches: upcoming, label: '다가오는 경기' }
  }

  const result: MatchSummary[] = []
  result.push(...yesterdayMatches.filter(m => isFinishedStatus(m.statusShort)))
  result.push(...todayMatches)
  if (todayAllDone || todayMatches.length === 0) {
    result.push(...tomorrowMatches.filter(m => m.statusShort === 'NS'))
  }
  result.sort((a, b) => {
    const ta = a.matchDate ? new Date(a.matchDate).getTime() : 0
    const tb = b.matchDate ? new Date(b.matchDate).getTime() : 0
    return ta - tb
  })

  const hasLive = result.some(m => isLiveStatus(m.statusShort) || m.statusShort === 'HT')
  const label = hasLive ? '진행 중인 경기' : '오늘의 경기'
  return { matches: result, label }
}

// ── Mini MatchCard ──────────────────────────────────────────────
function MiniMatchCard({ match }: { match: MatchSummary }) {
  const isFinished = isFinishedStatus(match.statusShort)
  const isLive     = isLiveStatus(match.statusShort) || match.statusShort === 'HT'
  const hasScore   = match.home.goals != null || match.away.goals != null

  const timeStr = match.matchDate
    ? new Date(match.matchDate).toLocaleTimeString('ko-KR', {
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Seoul',
      })
    : '미정'

  const dayStr = match.matchDate
    ? (() => {
        const mDate = kstDateStr(match.matchDate)
        const now   = new Date()
        const today     = kstTodayStr()
        const yesterday = kstDateStr(new Date(now.getTime() - 86400000).toISOString())
        const tomorrow  = kstDateStr(new Date(now.getTime() + 86400000).toISOString())
        if (mDate === today)     return '오늘'
        if (mDate === yesterday) return '어제'
        if (mDate === tomorrow)  return '내일'
        const d = new Date(mDate + 'T00:00:00+09:00')
        return `${d.getMonth() + 1}/${d.getDate()}`
      })()
    : ''

  return (
    <Link
      href={`/matches/${match.fixtureId}`}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 14px',
        background: 'var(--surface)',
        border: `1px solid ${isLive ? 'var(--gold-line)' : 'var(--line)'}`,
        borderRadius: 12,
        textDecoration: 'none',
        transition: 'border-color 0.15s',
      }}
    >
      {/* Left: day + time */}
      <div style={{ width: 48, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <span style={{ fontSize: 10, color: 'var(--ink-3)', fontFamily: 'Space Mono, monospace' }}>{dayStr}</span>
        <span style={{ fontSize: 10, color: 'var(--ink-3)', fontFamily: 'Space Mono, monospace' }}>{timeStr}</span>
      </div>

      {/* Home */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, minWidth: 0 }}>
        <span style={{
          fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          color: isFinished && (match.home.goals ?? 0) > (match.away.goals ?? 0) ? 'var(--ink)' : 'var(--ink-2)',
        }}>{match.home.name ?? '-'}</span>
        <TeamLogo src={match.home.logo} className="w-6 h-6 flex-shrink-0" />
      </div>

      {/* Score */}
      <div style={{ width: 64, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {hasScore ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '3px 8px', borderRadius: 7,
            background: isLive ? 'rgba(39,194,129,0.12)' : 'var(--surface-2)',
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--ink)',
          }}>
            <span>{match.home.goals ?? 0}</span>
            <span style={{ color: 'var(--ink-3)', fontSize: 11 }}>-</span>
            <span>{match.away.goals ?? 0}</span>
          </div>
        ) : (
          <span style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: 'Space Mono, monospace' }}>vs</span>
        )}
        <StatusBadge status={match.statusShort} elapsed={match.elapsed} />
      </div>

      {/* Away */}
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

// ── Section ─────────────────────────────────────────────────────
const REFRESH_MS = 5 * 60 * 1000

export default function HomeMatchSection() {
  const [matches, setMatches]     = useState<MatchSummary[]>([])
  const [loading, setLoading]     = useState(true)
  const [lastUpdated, setUpdated] = useState<Date | null>(null)

  const fetchMatches = () => {
    fetch(`${API_BASE}/api/matches`, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : [])
      .then((data: MatchSummary[]) => { setMatches(data); setUpdated(new Date()) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchMatches()
    const id = setInterval(fetchMatches, REFRESH_MS)
    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { matches: shown, label } = selectMatchesToShow(matches)

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span className="eyebrow">LIVE &amp; RESULTS</span>
        {lastUpdated && (
          <span style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'Space Mono, monospace' }}>
            {lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Seoul' })} 기준
          </span>
        )}
        <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        <Link href="/matches" style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600, textDecoration: 'none' }}>
          전체 보기 →
        </Link>
      </div>

      <h2 style={{
        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800,
        fontSize: 'clamp(22px, 3.5vw, 30px)', letterSpacing: '-0.03em',
        color: 'var(--ink)', marginBottom: 20,
      }}>
        {label}
      </h2>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: 58, borderRadius: 12, background: 'var(--surface-2)', opacity: 0.6 }} />
          ))}
        </div>
      )}

      {!loading && shown.length === 0 && (
        <div style={{ padding: '36px 0', textAlign: 'center', color: 'var(--ink-3)', fontSize: 14 }}>
          오늘 예정된 경기가 없습니다
        </div>
      )}

      {!loading && shown.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {shown.map((m) => <MiniMatchCard key={m.fixtureId} match={m} />)}
        </div>
      )}
    </section>
  )
}
