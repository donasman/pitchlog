import Link from 'next/link'
import type { MatchSummary } from '@/types'
import { api } from '@/lib/api'
import { getRoundLabel, groupFinishedByRound, recentFinished } from '@/lib/round'

/** 팀 이름 → 최대 3글자 약어 (MEX, BRA, KOR …) */
function abbr(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return name.slice(0, 3).toUpperCase()
  return words
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()
}

interface Item {
  match: MatchSummary
  roundLabel: string
}

/**
 * 대회 종료 후 상단 티커.
 *
 * 이전 LiveTicker는 "오늘 경기" 기준 클라이언트 폴링이었으나,
 * 대회가 종료되어 폴링 대상이 없고 오늘 경기도 없으므로
 * 토너먼트(16강~결승) 결과를 서버에서 한 번 렌더해 고정한다.
 */
export default async function ResultsTicker() {
  let matches: MatchSummary[] = []
  try {
    matches = await api.getMatches()
  } catch {
    return null
  }

  // 토너먼트 결과를 결승 → 이른 라운드 순으로 나열
  const grouped = groupFinishedByRound(matches)
  let items: Item[] = grouped.flatMap((g) =>
    g.matches.map((m) => ({ match: m, roundLabel: g.label })),
  )

  // 토너먼트 데이터가 아직 없으면 최근 종료 경기로 대체
  if (items.length === 0) {
    items = recentFinished(matches, 8).map((m) => ({
      match: m,
      roundLabel: m.round ? getRoundLabel(m.round) : '',
    }))
  }

  if (items.length === 0) return null

  // CSS 무한 스크롤 애니메이션을 위해 2배 복제
  const doubled = [...items, ...items]

  return (
    <div className="ticker-track">
      {doubled.map((item, i) => {
        const { match, roundLabel } = item
        const homeGoals = match.home.goals ?? 0
        const awayGoals = match.away.goals ?? 0
        const homeWin = homeGoals > awayGoals
        const awayWin = awayGoals > homeGoals

        return (
          <Link
            key={i}
            href={`/matches/${match.fixtureId}`}
            className="tk"
            style={{ textDecoration: 'none', cursor: 'pointer' }}
          >
            {roundLabel && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'var(--gold)',
                  fontFamily: 'Space Mono, monospace',
                }}
              >
                {roundLabel}
              </span>
            )}

            {match.home.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={match.home.logo}
                alt=""
                width={16}
                height={16}
                style={{ objectFit: 'contain', borderRadius: 2 }}
              />
            )}
            <b style={{ opacity: awayWin ? 0.55 : 1 }}>{abbr(match.home.name ?? '')}</b>

            <span className="sc">
              {homeGoals} – {awayGoals}
            </span>

            {match.away.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={match.away.logo}
                alt=""
                width={16}
                height={16}
                style={{ objectFit: 'contain', borderRadius: 2 }}
              />
            )}
            <b style={{ opacity: homeWin ? 0.55 : 1 }}>{abbr(match.away.name ?? '')}</b>
          </Link>
        )
      })}
    </div>
  )
}
