import Link from 'next/link'
import type { MatchSummary } from '@/types'
import TeamLogo from '@/components/ui/TeamLogo'
import { formatMatchDateShort } from '@/lib/format'
import { getTournamentResult, groupFinishedByRound, recentFinished, getRoundLabel } from '@/lib/round'

/**
 * 대회 종료 후 홈 상단 섹션.
 *
 * 이전 HomeMatchSection은 "오늘/어제/내일" 기준 클라이언트 폴링이었다.
 * 대회가 끝나 해당 기준으로는 항상 빈 배열이 나오므로,
 * 우승 하이라이트 + 토너먼트 라운드별 결과를 서버에서 렌더한다.
 */

function ResultRow({ match }: { match: MatchSummary }) {
  const hg = match.home.goals ?? 0
  const ag = match.away.goals ?? 0
  const homeWin = hg > ag
  const awayWin = ag > hg

  return (
    <Link
      href={`/matches/${match.fixtureId}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '11px 14px',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 12,
        textDecoration: 'none',
      }}
    >
      <span
        style={{
          width: 52,
          flexShrink: 0,
          fontSize: 11,
          color: 'var(--ink-3)',
          fontFamily: 'Space Mono, monospace',
        }}
      >
        {formatMatchDateShort(match.matchDate)}
      </span>

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
            fontSize: 13,
            fontWeight: homeWin ? 700 : 500,
            color: homeWin ? 'var(--ink)' : 'var(--ink-2)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {match.home.name ?? '—'}
        </span>
        <TeamLogo src={match.home.logo} className="w-6 h-6 flex-shrink-0" />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '3px 9px',
          borderRadius: 7,
          background: 'var(--surface-2)',
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          fontSize: 15,
          color: 'var(--ink)',
          flexShrink: 0,
        }}
      >
        <span>{hg}</span>
        <span style={{ color: 'var(--ink-3)', fontSize: 11 }}>-</span>
        <span>{ag}</span>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
        <TeamLogo src={match.away.logo} className="w-6 h-6 flex-shrink-0" />
        <span
          style={{
            fontSize: 13,
            fontWeight: awayWin ? 700 : 500,
            color: awayWin ? 'var(--ink)' : 'var(--ink-2)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {match.away.name ?? '—'}
        </span>
      </div>
    </Link>
  )
}

function ChampionBanner({ matches }: { matches: MatchSummary[] }) {
  const result = getTournamentResult(matches)
  if (!result) return null

  const { final, champion, runnerUp, undecidedByScore } = result

  // 승부차기 등으로 스코어만으로 승자를 판별할 수 없는 경우
  if (undecidedByScore || !champion) {
    return (
      <div
        style={{
          padding: '24px 26px',
          borderRadius: 16,
          background: 'var(--surface)',
          border: '1px solid var(--gold-line)',
          marginBottom: 28,
        }}
      >
        <p className="eyebrow" style={{ marginBottom: 8 }}>Final</p>
        <p style={{ fontSize: 15, color: 'var(--ink-2)', margin: 0 }}>
          {final.home.name} {final.home.goals ?? 0} – {final.away.goals ?? 0} {final.away.name}
          <span style={{ marginLeft: 8, fontSize: 13, color: 'var(--ink-3)' }}>
            (승부차기로 우승 결정)
          </span>
        </p>
        <Link
          href={`/matches/${final.fixtureId}`}
          style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600, textDecoration: 'none' }}
        >
          경기 상세 보기 →
        </Link>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        flexWrap: 'wrap',
        padding: '28px 30px',
        borderRadius: 16,
        background: 'var(--gold-soft)',
        border: '1px solid var(--gold-line)',
        marginBottom: 28,
      }}
    >
      <TeamLogo src={champion.logo} className="w-16 h-16 flex-shrink-0" />

      <div style={{ minWidth: 0, flex: 1 }}>
        <p className="eyebrow" style={{ marginBottom: 6, color: 'var(--gold)' }}>
          Champion · 2026 FIFA World Cup
        </p>
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(24px, 3.2vw, 34px)',
            letterSpacing: '-0.02em',
            color: 'var(--ink)',
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          {champion.name}
        </h2>
        <p style={{ marginTop: 8, fontSize: 14, color: 'var(--ink-2)' }}>
          결승 {champion.goals ?? 0}–{runnerUp?.goals ?? 0} {runnerUp?.name} ·{' '}
          {formatMatchDateShort(final.matchDate)}
        </p>
        <Link
          href={`/matches/${final.fixtureId}`}
          style={{
            display: 'inline-block',
            marginTop: 10,
            fontSize: 13,
            color: 'var(--gold)',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          결승 경기 상세 →
        </Link>
      </div>
    </div>
  )
}

export default function HomeResultsSection({ matches }: { matches: MatchSummary[] }) {
  const rounds = groupFinishedByRound(matches)
  // 결승·3·4위전·4강까지만 홈에 노출 (그 아래는 /matches 에서)
  const highlighted = rounds.slice(0, 3)
  const fallback = highlighted.length === 0 ? recentFinished(matches, 6) : []

  return (
    <div>
      <ChampionBanner matches={matches} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span className="eyebrow">Results</span>
        <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        <Link
          href="/matches"
          style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600, textDecoration: 'none' }}
        >
          전체 경기 →
        </Link>
      </div>

      {highlighted.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {highlighted.map((group) => (
            <section key={group.round}>
              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: 'var(--ink-2)',
                  marginBottom: 10,
                }}
              >
                {group.label}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {group.matches.map((m) => (
                  <ResultRow key={m.fixtureId} match={m} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : fallback.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {fallback.map((m) => (
            <ResultRow key={m.fixtureId} match={m} />
          ))}
        </div>
      ) : (
        <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--ink-3)', fontSize: 14 }}>
          경기 데이터를 불러오지 못했습니다. 배치 실행 후 다시 빌드해 주세요.
        </div>
      )}
    </div>
  )
}

/** 라운드 라벨을 외부에서도 쓸 수 있게 재노출 */
export { getRoundLabel }
