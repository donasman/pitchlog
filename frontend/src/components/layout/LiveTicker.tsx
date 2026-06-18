'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { MatchSummary } from '@/types'
import { API_BASE } from '@/lib/config'
import { formatMatchTime } from '@/lib/format'

const LIVE_STATUS  = new Set(['1H', '2H', 'HT', 'ET', 'BT', 'P', 'INT', 'LIVE'])
const DONE_STATUS  = new Set(['FT', 'AET', 'PEN'])

/** 팀 이름 → 최대 3글자 약어 (MEX, SAF, SKO …) */
function abbr(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return name.slice(0, 3).toUpperCase()
  return words.map((w) => w[0]).join('').slice(0, 3).toUpperCase()
}

function isSameDay(iso: string, ref: Date): boolean {
  const d = new Date(iso)
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth()    === ref.getMonth()    &&
    d.getDate()     === ref.getDate()
  )
}

type Kind = 'live' | 'upcoming' | 'finished'
type Item = { kind: Kind; match: MatchSummary }

async function fetchItems(): Promise<Item[]> {
  const res = await fetch(`${API_BASE}/api/matches`, { cache: 'no-store' })
  if (!res.ok) throw new Error('fetch failed')
  const matches: MatchSummary[] = await res.json()
  const now = new Date()

  const live     = matches.filter((m) => m.statusShort && LIVE_STATUS.has(m.statusShort))
  const upcoming = matches.filter((m) => m.statusShort === 'NS' && m.matchDate && isSameDay(m.matchDate, now))
  const finished = matches.filter((m) => m.statusShort && DONE_STATUS.has(m.statusShort)).slice(-6)

  return [
    ...live.map((m)             => ({ kind: 'live'     as Kind, match: m })),
    ...upcoming.slice(0, 4).map((m) => ({ kind: 'upcoming' as Kind, match: m })),
    ...finished.map((m)         => ({ kind: 'finished' as Kind, match: m })),
  ]
}

export default function LiveTicker() {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const result = await fetchItems()
        if (!cancelled && result.length > 0) setItems(result)
      } catch { /* 조용히 실패 */ }
    }
    load()
    const id = setInterval(load, 30_000)
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  if (items.length === 0) return null

  // CSS 애니메이션을 위해 2배 복제
  const doubled = [...items, ...items]

  return (
    <div className="ticker-track">
      {doubled.map((item, i) => {
        const { match, kind } = item
        const homeAbbr = abbr(match.home.name ?? '')
        const awayAbbr = abbr(match.away.name ?? '')

        return (
          <Link
            key={i}
            href={`/matches/${match.fixtureId}`}
            className="tk"
            style={{ textDecoration: 'none', cursor: 'pointer' }}
          >
            {/* 홈팀 로고 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={match.home.logo ?? ''}
              alt=""
              width={16}
              height={16}
              style={{ objectFit: 'contain', borderRadius: 2 }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />

            <b>{homeAbbr}</b>

            {kind === 'upcoming' ? (
              <>
                <span style={{ color: 'var(--ink-3)', fontSize: 11 }}>vs</span>
                <b>{awayAbbr}</b>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--ink-3)' }}>
                  {formatMatchTime(match.matchDate)}
                </span>
              </>
            ) : (
              <>
                <span className="sc">
                  {match.home.goals ?? 0} – {match.away.goals ?? 0}
                </span>
                <b>{awayAbbr}</b>
                {kind === 'live' ? (
                  <span className="min">{match.elapsed}&apos;</span>
                ) : (
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--ink-3)' }}>
                    FT
                  </span>
                )}
              </>
            )}
          </Link>
        )
      })}
    </div>
  )
}
