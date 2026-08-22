import type { Metadata } from 'next'
import Link from 'next/link'
import type { MatchSummary } from '@/types'
import { api } from '@/lib/api'
import { SITE_URL } from '@/lib/config'
import TeamLogo from '@/components/ui/TeamLogo'
import PageHeader from '@/components/ui/PageHeader'
import StatusBadge from '@/components/match/StatusBadge'
import DateJumpNav from '@/components/match/DateJumpNav'
import { isFinished as isFinishedStatus } from '@/lib/matchStatus'
import { formatMatchTime, kstDateKey, formatDateHeaderKST } from '@/lib/format'
import { getRoundLabel, isKnockoutRound } from '@/lib/round'

export const metadata: Metadata = {
  title: '2026 월드컵 전체 경기 결과',
  description:
    '2026 FIFA 월드컵 전 경기 결과를 날짜별로 확인하세요. 조별리그부터 결승까지 스코어와 라인업 제공.',
  alternates: { canonical: `${SITE_URL}/matches` },
  openGraph: {
    title: '2026 월드컵 전체 경기 결과 | PitchLog',
    description: '조별리그부터 결승까지 2026 FIFA 월드컵 전 경기 결과.',
    url: `${SITE_URL}/matches`,
    type: 'website',
  },
}

function groupLetter(groupName: string | null): string | null {
  if (!groupName) return null
  const m = groupName.match(/Group\s+([A-L])\b/i)
  return m ? m[1].toUpperCase() : null
}

function MatchCard({ match }: { match: MatchSummary }) {
  const status = match.statusShort
  const finished = isFinishedStatus(status)
  const hasScore = match.home.goals != null || match.away.goals != null
  const letter = groupLetter(match.groupName)
  const knockout = isKnockoutRound(match.round)
  const timeStr = match.matchDate ? formatMatchTime(match.matchDate) : '미정'

  return (
    <Link
      href={'/matches/' + match.fixtureId}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '13px 16px',
        background: 'var(--surface)',
        border: '0.5px solid var(--line)',
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.03)',
        textDecoration: 'none',
        transition: 'box-shadow 0.15s, border-color 0.15s',
      }}
    >
      <div
        style={{
          width: 60,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        {knockout && match.round ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2px 6px',
              borderRadius: 5,
              background: 'var(--gold-soft)',
              color: 'var(--gold)',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 800,
              fontSize: 10,
              whiteSpace: 'nowrap',
            }}
          >
            {getRoundLabel(match.round)}
          </span>
        ) : letter ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 22,
              height: 20,
              borderRadius: 5,
              background: 'var(--gold)',
              color: 'var(--gold-fg)',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 800,
              fontSize: 11,
              letterSpacing: '0.02em',
            }}
          >
            {letter}
          </span>
        ) : (
          <span
            style={{
              fontSize: 10,
              color: 'var(--ink-3)',
              fontFamily: 'Space Mono, monospace',
              textAlign: 'center',
            }}
          >
            {(match.round ?? '').replace('Group Stage - ', '').slice(0, 8)}
          </span>
        )}
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--ink-3)' }}>
          {timeStr}
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 7,
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color:
              finished && (match.home.goals ?? 0) > (match.away.goals ?? 0)
                ? 'var(--ink)'
                : 'var(--ink-2)',
          }}
        >
          {match.home.name ?? '-'}
        </span>
        <TeamLogo src={match.home.logo} className="w-7 h-7 flex-shrink-0" />
      </div>

      <div
        style={{
          width: 72,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        {hasScore ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 8,
              background: 'var(--surface-2)',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: 17,
              color: 'var(--ink)',
            }}
          >
            <span>{match.home.goals ?? 0}</span>
            <span style={{ color: 'var(--ink-3)', fontSize: 12 }}>-</span>
            <span>{match.away.goals ?? 0}</span>
          </div>
        ) : (
          <span style={{ fontSize: 13, color: 'var(--ink-3)', fontFamily: 'Space Mono, monospace' }}>
            vs
          </span>
        )}
        <StatusBadge status={status} elapsed={match.elapsed} />
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
        <TeamLogo src={match.away.logo} className="w-7 h-7 flex-shrink-0" />
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color:
              finished && (match.away.goals ?? 0) > (match.home.goals ?? 0)
                ? 'var(--ink)'
                : 'var(--ink-2)',
          }}
        >
          {match.away.name ?? '-'}
        </span>
      </div>

      <svg
        style={{ width: 14, height: 14, color: 'var(--ink-3)', flexShrink: 0 }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}

/**
 * 전체 경기 목록 (서버 컴포넌트).
 *
 * 대회 종료로 실시간 폴링이 불필요해져 클라이언트 fetch를 걷어내고
 * 빌드 시점에 데이터를 렌더한다. 날짜 점프 스크롤만 DateJumpNav(client)가 담당.
 */
export default async function MatchesPage() {
  let matches: MatchSummary[] = []
  let failed = false
  try {
    matches = await api.getMatches()
  } catch {
    failed = true
  }

  const dateOrder: string[] = []
  const byDate = new Map<string, MatchSummary[]>()
  for (const m of matches) {
    if (!m.matchDate) continue
    const d = kstDateKey(m.matchDate)
    if (!byDate.has(d)) {
      byDate.set(d, [])
      dateOrder.push(d)
    }
    byDate.get(d)!.push(m)
  }
  dateOrder.sort()

  const navDates = dateOrder.map((key) => {
    const dt = new Date(key + 'T00:00:00+09:00')
    return { key, label: `${dt.getMonth() + 1}/${dt.getDate()}` }
  })

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px 64px' }}>
      <PageHeader
        eyebrow="경기 결과"
        title={<>🏟️ 전체 경기</>}
        subtitle="2026 FIFA 월드컵 · 미국 / 캐나다 / 멕시코"
      />

      <DateJumpNav dates={navDates} />

      {failed && (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--ink-3)' }}>
          경기 데이터를 불러오지 못했습니다. 백엔드를 확인한 뒤 다시 빌드해 주세요.
        </div>
      )}

      {!failed && dateOrder.length === 0 && (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--ink-3)' }}>
          등록된 경기가 없습니다
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginTop: 24 }}>
        {dateOrder.map((dateStr) => (
          <section key={dateStr} id={'date-' + dateStr}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: 14,
                  color: 'var(--ink)',
                }}
              >
                {formatDateHeaderKST(dateStr)}
              </span>
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
        ))}
      </div>
    </div>
  )
}
