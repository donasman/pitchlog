import type { Metadata } from 'next'
import Link from 'next/link'
import { api } from '@/lib/api'
import type { Country, StatsRanking, MatchSummary, StandingGroup, StandingEntry } from '@/types'
import { playerSlug } from '@/lib/utils'
import HomeMatchSection from '@/components/home/HomeMatchSection'

export async function generateMetadata(): Promise<Metadata> {
  let nationCount = 48
  let playerCount = 736
  try {
    const countries = await api.getCountries()
    if (countries.length > 0) {
      nationCount = countries.length
      playerCount = countries.length * 26
    }
  } catch { /* fallback to defaults */ }
  const desc = `${nationCount}개국 ${playerCount}명의 선수, 실시간 경기 스코어와 심층 통계. PitchLog가 2026 월드컵의 모든 순간을 데이터로 추적합니다.`
  return {
    title: 'PitchLog — 2026 FIFA 월드컵 선수 통계',
    description: desc,
    alternates: { canonical: 'https://pitchlog.com' },
    openGraph: {
      title: 'PitchLog — 2026 FIFA 월드컵 선수 통계',
      description: `${nationCount}개국 ${playerCount}명의 선수, 실시간 경기 스코어와 심층 통계.`,
      url: 'https://pitchlog.com',
      type: 'website',
    },
  }
}

const LIVE_STATUS = new Set(['1H', '2H', 'HT', 'ET', 'BT', 'P', 'INT'])
const FINISHED_STATUS = new Set(['FT', 'AET', 'PEN'])

function getStatusLabel(match: MatchSummary): { label: string; isLive: boolean } {
  const s = match.statusShort ?? 'NS'
  if (LIVE_STATUS.has(s)) return { label: `LIVE ${match.elapsed ?? ''}′`, isLive: true }
  if (s === 'FT') return { label: 'FT', isLive: false }
  if (s === 'AET') return { label: 'AET', isLive: false }
  if (s === 'PEN') return { label: 'PEN', isLive: false }
  return { label: '예정', isLive: false }
}

function MatchCard({ match }: { match: MatchSummary }) {
  const { label, isLive } = getStatusLabel(match)
  const group = match.groupName
    ? match.groupName.replace('Group Stage - ', 'GROUP ')
    : match.round ?? ''
  const homeWin = (match.home.goals ?? 0) > (match.away.goals ?? 0)
  const awayWin = (match.away.goals ?? 0) > (match.home.goals ?? 0)
  const isFinished = ['FT', 'AET', 'PEN'].includes(match.statusShort ?? '')

  return (
    <Link href={`/matches/${match.fixtureId}`} className="score-card" style={{ display: 'block', textDecoration: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span className="sc-stage">{group}</span>
        {isLive ? (
          <span className="sc-live"><span className="d" />{label}</span>
        ) : (
          <span className="sc-stage" style={{ color: isFinished ? 'var(--ink-2)' : 'var(--ink-3)' }}>{label}</span>
        )}
      </div>
      <div className="match-team-row">
        {match.home.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={match.home.logo} alt={match.home.name ?? ''} width={22} height={22} style={{ objectFit: 'contain', flexShrink: 0 }} />
        ) : (
          <div style={{ width: 22, height: 22, borderRadius: 4, background: 'var(--surface-2)', flexShrink: 0 }} />
        )}
        <span className="match-team-name" style={{ fontWeight: homeWin && isFinished ? 700 : 500 }}>{match.home.name ?? '—'}</span>
        {match.home.goals != null && (
          <span className={`match-team-score${homeWin && isFinished ? ' winner' : ''}`}>{match.home.goals}</span>
        )}
      </div>
      <div className="match-team-row" style={{ borderBottom: 'none', paddingTop: 7 }}>
        {match.away.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={match.away.logo} alt={match.away.name ?? ''} width={22} height={22} style={{ objectFit: 'contain', flexShrink: 0 }} />
        ) : (
          <div style={{ width: 22, height: 22, borderRadius: 4, background: 'var(--surface-2)', flexShrink: 0 }} />
        )}
        <span className="match-team-name" style={{ fontWeight: awayWin && isFinished ? 700 : 500, color: 'var(--ink-2)' }}>{match.away.name ?? '—'}</span>
        {match.away.goals != null && (
          <span className={`match-team-score${awayWin && isFinished ? ' winner' : ''}`}>{match.away.goals}</span>
        )}
      </div>
    </Link>
  )
}

// Mini Group Card for GROUP STAGE section
function GroupCard({ group }: { group: StandingGroup }) {
  const letter = group.groupName.replace('Group ', '')
  return (
    <Link
      href={`/standings`}
      style={{
        display: 'block',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 14,
        padding: '14px 16px',
        textDecoration: 'none',
        transition: 'border-color 0.18s, transform 0.18s',
      }}
      className="group-card"
    >
      {/* Group label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{
          width: 26, height: 26,
          borderRadius: 6,
          background: 'var(--gold)',
          color: 'var(--gold-fg)',
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          fontSize: 13,
          display: 'grid', placeItems: 'center',
          flexShrink: 0,
        }}>{letter}</span>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
          GROUP {letter}
        </span>
      </div>

      {/* Teams */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {group.standings.slice(0, 4).map((entry, i) => {
          const ptColor = i < 2 ? 'var(--gold)' : i === 2 ? '#f59e0b' : 'var(--ink-3)'
          const nameColor = i < 2 ? 'var(--ink)' : i === 2 ? 'var(--ink-2)' : 'var(--ink-3)'
          return (
            <div key={entry.teamApiId} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {entry.teamLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={entry.teamLogo} alt={entry.teamName} width={16} height={16} style={{ objectFit: 'contain', flexShrink: 0 }} />
              ) : (
                <div style={{ width: 16, height: 16, borderRadius: 3, background: 'var(--surface-2)', flexShrink: 0 }} />
              )}
              <span style={{ flex: 1, fontSize: 12, fontWeight: i < 2 ? 600 : 400, color: nameColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {entry.teamName}
              </span>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, fontWeight: 700, color: ptColor, flexShrink: 0 }}>
                {entry.points ?? 0}
              </span>
            </div>
          )
        })}
      </div>
    </Link>
  )
}


// standings 페이지와 동일: 각 조에 3위 팀 삽입
function enrichWithThirdPlace(
  groups: StandingGroup[],
  matches: MatchSummary[]
): StandingGroup[] {
  const teamToGroup = new Map<number, string>()
  for (const group of groups) {
    if (!/^Group [A-L]$/.test(group.groupName)) continue
    for (const s of group.standings) {
      if (s.teamApiId != null) teamToGroup.set(s.teamApiId, group.groupName)
    }
  }
  const groupStage = groups.find((g) => g.groupName === 'Group Stage')
  if (!groupStage || groupStage.standings.length === 0)
    return groups.filter(g => g.groupName !== 'Group Stage')

  const groupStageIds = new Set(
    groupStage.standings.map((s) => s.teamApiId).filter((id): id is number => id != null)
  )
  const gsTeamToGroup = new Map<number, string>()
  for (const match of matches) {
    const homeId = match.home?.teamApiId
    const awayId = match.away?.teamApiId
    if (homeId == null || awayId == null) continue
    if (groupStageIds.has(homeId) && teamToGroup.has(awayId) && !gsTeamToGroup.has(homeId))
      gsTeamToGroup.set(homeId, teamToGroup.get(awayId)!)
    if (groupStageIds.has(awayId) && teamToGroup.has(homeId) && !gsTeamToGroup.has(awayId))
      gsTeamToGroup.set(awayId, teamToGroup.get(homeId)!)
  }
  return groups
    .filter((g) => g.groupName !== 'Group Stage')
    .map((group) => {
      const thirdPlaceEntry = groupStage.standings.find((s) => {
        if (s.teamApiId == null) return false
        return gsTeamToGroup.get(s.teamApiId) === group.groupName
      })
      if (!thirdPlaceEntry) return group
      const standings = [...group.standings]
      const insertIdx = standings.findIndex((s) => s.rank >= 3)
      if (insertIdx === -1) standings.push({ ...thirdPlaceEntry, rank: 3 })
      else standings.splice(insertIdx, 0, { ...thirdPlaceEntry, rank: 3 })
      return { ...group, standings }
    })
}

// ── 3위 순위 / 토너먼트 헬퍼 ────────────────────────────────

type ThirdPlaceEntry = StandingEntry & { groupLetter: string }

/**
 * 각 그룹 A-L에서 rank=3 팀을 추출해 pts/GD/GF 기준으로 정렬.
 * "Group Stage" 그룹(API-Football 3위 종합)이 있으면 우선 사용.
 * enrichWithThirdPlace와 동일한 매치 데이터 추론으로 조 알파벳을 결정.
 */
function getThirdPlaceRankings(groups: StandingGroup[], matches: MatchSummary[]): ThirdPlaceEntry[] {
  // teamApiId → 조 알파벳 맵 (Group A-L 직접 소속 팀)
  const teamToLetter = new Map<number, string>()
  for (const group of groups) {
    const m = group.groupName.match(/^Group ([A-L])$/)
    if (!m) continue
    for (const s of group.standings) {
      if (s.teamApiId != null) teamToLetter.set(s.teamApiId, m[1])
    }
  }

  // "Group Stage" 종합 순위 팀의 조를 매치 데이터로 추론 (enrichWithThirdPlace와 동일 로직)
  const groupStage = groups.find(g => g.groupName === 'Group Stage')
  if (groupStage && groupStage.standings.length > 0) {
    const gsIds = new Set(
      groupStage.standings.map(s => s.teamApiId).filter((id): id is number => id != null)
    )
    const gsTeamToLetter = new Map<number, string>()
    for (const match of matches) {
      const homeId = match.home?.teamApiId
      const awayId = match.away?.teamApiId
      if (homeId == null || awayId == null) continue
      if (gsIds.has(homeId) && teamToLetter.has(awayId) && !gsTeamToLetter.has(homeId))
        gsTeamToLetter.set(homeId, teamToLetter.get(awayId)!)
      if (gsIds.has(awayId) && teamToLetter.has(homeId) && !gsTeamToLetter.has(awayId))
        gsTeamToLetter.set(awayId, teamToLetter.get(homeId)!)
    }
    return groupStage.standings.map(entry => ({
      ...entry,
      groupLetter: entry.teamApiId != null
        ? (teamToLetter.get(entry.teamApiId) ?? gsTeamToLetter.get(entry.teamApiId) ?? '?')
        : '?',
    }))
  }

  // 폴백: 각 그룹 rank=3 직접 추출 후 정렬
  const result: ThirdPlaceEntry[] = []
  for (const group of groups) {
    const m = group.groupName.match(/^Group ([A-L])$/)
    if (!m) continue
    const third = group.standings.find(s => s.rank === 3)
    if (third) result.push({ ...third, groupLetter: m[1] })
  }
  return result.sort((a, b) => {
    const pd = (b.points ?? 0) - (a.points ?? 0)
    if (pd !== 0) return pd
    const gd = (b.goalsDiff ?? 0) - (a.goalsDiff ?? 0)
    if (gd !== 0) return gd
    return (b.goalsFor ?? 0) - (a.goalsFor ?? 0)
  })
}

/** 토너먼트 페이즈 감지 — 16강 이상 경기가 존재하면 knockout */
function isKnockoutPhase(matches: MatchSummary[]): boolean {
  return matches.some(m => {
    if (!m.round) return false
    return (
      m.round.includes('Round of') ||
      m.round.includes('Quarter') ||
      m.round.includes('Semi') ||
      (m.round.includes('Final') && !m.round.includes('Group'))
    )
  })
}

const ROUND_PRIORITY = [
  'Round of 32',
  'Round of 16',
  'Quarter-finals',
  'Semi-finals',
  '3rd Place',
  'Final',
]

function getRoundLabel(round: string): string {
  if (round.includes('Round of 32')) return '32강'
  if (round.includes('Round of 16')) return '16강'
  if (round.includes('Quarter')) return '8강'
  if (round.includes('Semi')) return '4강'
  if (round.includes('3rd')) return '3·4위전'
  if (round.includes('Final')) return '결승'
  return round
}

/** 현재 활성 토너먼트 라운드 반환 (NS·라이브가 있는 가장 이른 라운드) */
function getCurrentKnockoutRound(matches: MatchSummary[]): string | null {
  const ko = matches.filter(m => {
    if (!m.round) return false
    return (
      m.round.includes('Round of') ||
      m.round.includes('Quarter') ||
      m.round.includes('Semi') ||
      (m.round.includes('Final') && !m.round.includes('Group'))
    )
  })
  if (ko.length === 0) return null

  for (const kw of ROUND_PRIORITY) {
    const inRound = ko.filter(m => m.round?.includes(kw))
    if (inRound.length === 0) continue
    const active = inRound.some(m =>
      m.statusShort === 'NS' || LIVE_STATUS.has(m.statusShort ?? '')
    )
    if (active) return kw
  }
  // 모두 종료 → 가장 마지막 라운드
  for (let i = ROUND_PRIORITY.length - 1; i >= 0; i--) {
    if (ko.some(m => m.round?.includes(ROUND_PRIORITY[i]))) return ROUND_PRIORITY[i]
  }
  return null
}

// ── 3위 순위 섹션 ────────────────────────────────────────────

function ThirdPlaceSection({ groups, matches }: { groups: StandingGroup[], matches: MatchSummary[] }) {
  const teams = getThirdPlaceRankings(groups, matches)
  if (teams.length === 0) return null

  // 2026 월드컵: 12개 조 중 상위 8팀이 16강 진출
  const ADVANCE_COUNT = 8

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: 4 }}>3rd Place</p>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
            fontSize: 'clamp(20px, 2.4vw, 28px)', letterSpacing: '-0.02em', color: 'var(--ink)',
          }}>조별 3위 순위</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: 'Space Mono, monospace' }}>
            상위 8팀 16강 진출
          </span>
          <Link href="/standings" className="link-more" style={{ fontSize: 11 }}>
            전체 보기
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </Link>
        </div>
      </div>

      {/* 컬럼 헤더 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '28px 32px 1fr 32px 32px 32px 32px 44px 40px 72px',
        gap: 4,
        padding: '0 12px 8px',
        borderBottom: '1px solid var(--line)',
        marginBottom: 4,
      }}>
        {['#', '조', '팀', 'P', 'W', 'D', 'L', '득실', 'Pts', ''].map((h, i) => (
          <span key={i} style={{
            fontSize: 10, fontFamily: 'Space Mono, monospace',
            color: 'var(--ink-3)', letterSpacing: '0.08em',
            textAlign: i >= 3 ? 'center' : 'left',
            textTransform: 'uppercase',
          }}>{h}</span>
        ))}
      </div>

      {/* 팀 행 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {teams.map((team, i) => {
          const advancing = i < ADVANCE_COUNT
          const gdNum = team.goalsDiff ?? 0
          const gdStr = gdNum > 0 ? `+${gdNum}` : `${gdNum}`
          const gdColor = gdNum > 0 ? '#22c55e' : gdNum < 0 ? 'var(--live)' : 'var(--ink-3)'

          return (
            <div
              key={team.teamApiId ?? i}
              style={{
                display: 'grid',
                gridTemplateColumns: '28px 32px 1fr 32px 32px 32px 32px 44px 40px 72px',
                gap: 4,
                alignItems: 'center',
                padding: '9px 12px',
                background: advancing ? 'var(--surface)' : 'transparent',
                border: `0.5px solid ${advancing ? 'var(--gold-line)' : 'var(--line)'}`,
                borderRadius: 10,
                opacity: advancing ? 1 : 0.55,
                transition: 'opacity 0.15s',
              }}
            >
              {/* 순위 */}
              <span style={{
                fontSize: 12, fontWeight: 700, fontFamily: 'Space Mono, monospace',
                color: advancing ? 'var(--gold)' : 'var(--ink-3)',
                textAlign: 'center',
              }}>{i + 1}</span>

              {/* 조 뱃지 */}
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 22, height: 22, borderRadius: 5,
                background: 'var(--gold)', color: 'var(--gold-fg)',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 11,
                flexShrink: 0,
              }}>{team.groupLetter}</span>

              {/* 팀 로고 + 이름 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                {team.teamLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={team.teamLogo} alt={team.teamName} width={18} height={18} style={{ objectFit: 'contain', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 18, height: 18, borderRadius: 3, background: 'var(--surface-2)', flexShrink: 0 }} />
                )}
                <span style={{
                  fontSize: 13, fontWeight: 600, color: 'var(--ink)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{team.teamName}</span>
              </div>

              {/* P W D L */}
              {[team.played, team.win, team.draw, team.lose].map((val, ci) => (
                <span key={ci} style={{
                  fontSize: 12, color: 'var(--ink-2)',
                  textAlign: 'center', fontFamily: 'Space Mono, monospace',
                }}>{val ?? 0}</span>
              ))}

              {/* 득실 */}
              <span style={{
                fontSize: 12, fontFamily: 'Space Mono, monospace',
                color: gdColor, textAlign: 'center', fontWeight: 600,
              }}>{gdStr}</span>

              {/* 승점 */}
              <span style={{
                fontSize: 14, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif',
                color: advancing ? 'var(--gold)' : 'var(--ink-2)',
                textAlign: 'center',
              }}>{team.points ?? 0}</span>

              {/* 진출 뱃지 */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {advancing ? (
                  <span style={{
                    padding: '2px 7px', borderRadius: 999,
                    background: 'var(--gold-soft)', color: 'var(--gold)',
                    fontSize: 10, fontWeight: 700,
                    fontFamily: 'Space Mono, monospace', whiteSpace: 'nowrap',
                  }}>진출 예정</span>
                ) : (
                  <span style={{
                    padding: '2px 7px', borderRadius: 999,
                    background: 'var(--surface-2)', color: 'var(--ink-3)',
                    fontSize: 10, fontFamily: 'Space Mono, monospace', whiteSpace: 'nowrap',
                  }}>탈락</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── 토너먼트 브라켓 섹션 ─────────────────────────────────────

function BracketMatchCard({ match }: { match: MatchSummary }) {
  const s = match.statusShort ?? 'NS'
  const isFinished = FINISHED_STATUS.has(s)
  const isLive = LIVE_STATUS.has(s)
  const hasScore = match.home.goals != null || match.away.goals != null
  const homeWins = isFinished && (match.home.goals ?? 0) > (match.away.goals ?? 0)
  const awayWins = isFinished && (match.away.goals ?? 0) > (match.home.goals ?? 0)

  return (
    <Link href={`/matches/${match.fixtureId}`} style={{ display: 'block', textDecoration: 'none' }}>
      <div style={{
        background: 'var(--surface)',
        border: `0.5px solid ${isLive ? 'var(--gold-line)' : 'var(--line)'}`,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: isLive ? '0 0 0 1px var(--gold-line)' : '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.15s',
      }}>
        {/* 홈 팀 */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 9,
          padding: '11px 14px',
          borderBottom: '0.5px solid var(--line)',
          background: homeWins ? 'var(--gold-soft)' : 'transparent',
        }}>
          {match.home.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={match.home.logo} alt={match.home.name ?? ''} width={20} height={20} style={{ objectFit: 'contain', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--surface-2)', flexShrink: 0 }} />
          )}
          <span style={{
            flex: 1, fontSize: 13, fontWeight: homeWins ? 700 : 500,
            color: match.home.name ? 'var(--ink)' : 'var(--ink-3)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{match.home.name ?? 'TBD'}</span>
          {hasScore ? (
            <span style={{
              fontSize: 16, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif',
              color: homeWins ? 'var(--gold)' : isLive ? 'var(--ink)' : 'var(--ink-2)',
              minWidth: 16, textAlign: 'right',
            }}>{match.home.goals ?? 0}</span>
          ) : (
            <span style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: 'Space Mono, monospace' }}>-</span>
          )}
        </div>

        {/* 원정 팀 */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 9,
          padding: '11px 14px',
          background: awayWins ? 'var(--gold-soft)' : 'transparent',
        }}>
          {match.away.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={match.away.logo} alt={match.away.name ?? ''} width={20} height={20} style={{ objectFit: 'contain', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--surface-2)', flexShrink: 0 }} />
          )}
          <span style={{
            flex: 1, fontSize: 13, fontWeight: awayWins ? 700 : 500,
            color: match.away.name ? 'var(--ink)' : 'var(--ink-3)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{match.away.name ?? 'TBD'}</span>
          {hasScore ? (
            <span style={{
              fontSize: 16, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif',
              color: awayWins ? 'var(--gold)' : isLive ? 'var(--ink)' : 'var(--ink-2)',
              minWidth: 16, textAlign: 'right',
            }}>{match.away.goals ?? 0}</span>
          ) : (
            <span style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: 'Space Mono, monospace' }}>-</span>
          )}
        </div>

        {/* 라이브 표시 */}
        {isLive && (
          <div style={{
            padding: '4px 14px',
            background: 'var(--gold-soft)',
            borderTop: '0.5px solid var(--gold-line)',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--live)', display: 'inline-block' }} />
            <span style={{ fontSize: 10, color: 'var(--live)', fontFamily: 'Space Mono, monospace', fontWeight: 700 }}>
              LIVE {match.elapsed != null ? `${match.elapsed}′` : ''}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}

function TournamentBracketSection({ matches }: { matches: MatchSummary[] }) {
  const currentRound = getCurrentKnockoutRound(matches)
  if (!currentRound) return null

  const roundMatches = matches
    .filter(m => m.round?.includes(currentRound))
    .sort((a, b) => {
      if (!a.matchDate || !b.matchDate) return 0
      return new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime()
    })

  const roundLabel = getRoundLabel(currentRound)
  const totalRounds = ROUND_PRIORITY.filter(r =>
    matches.some(m => m.round?.includes(r))
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: 4 }}>Tournament</p>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
            fontSize: 'clamp(20px, 2.4vw, 28px)', letterSpacing: '-0.02em', color: 'var(--ink)',
          }}>{roundLabel} 대진표</h2>
        </div>
        <Link href="/matches" className="link-more" style={{ fontSize: 11 }}>
          전체 보기
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </Link>
      </div>

      {totalRounds.length > 1 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {totalRounds.map(r => {
            const isActive = r === currentRound
            return (
              <span key={r} style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 12,
                border: `1px solid ${isActive ? 'var(--gold)' : 'var(--line)'}`,
                background: isActive ? 'var(--gold-soft)' : 'var(--surface)',
                color: isActive ? 'var(--gold)' : 'var(--ink-3)',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: isActive ? 700 : 500,
              }}>{getRoundLabel(r)}</span>
            )
          })}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
        {roundMatches.map(m => <BracketMatchCard key={m.fixtureId} match={m} />)}
      </div>
    </div>
  )
}

export default async function HomePage() {
  let countries: Country[] = []
  let topScorers: StatsRanking[] = []
  let matches: MatchSummary[] = []
  let standings: StandingGroup[] = []

  await Promise.allSettled([
    api.getCountries().then(d => { countries = d }),
    api.getTopScorers(5, 'worldcup').then(d => { topScorers = d }),
    api.getMatches().then(d => { matches = d }),
    api.getStandings().then(d => { standings = d }),
  ])

  const groupStandings = enrichWithThirdPlace(standings, matches)
  const liveCount = matches.filter(m => LIVE_STATUS.has(m.statusShort ?? '')).length
  const knockout = isKnockoutPhase(matches)
  const thirdPlaceTeams = getThirdPlaceRankings(standings, matches)
  const showThirdPlace = !knockout && thirdPlaceTeams.length > 0

  return (
    <>
      <header className="hero">
        <div className="wrap" style={{ paddingTop: 72, paddingBottom: 80 }}>
          <div className="hero-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
            <div>
              <div className="hero-tag">
                <span className="pin">LIVE</span>
                2026 FIFA World Cup
              </div>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(34px, 4.8vw, 62px)', lineHeight: 1.0, letterSpacing: '-0.03em', color: 'var(--ink)', marginBottom: 22 }}>
                모든 선수의<br />
                <span style={{ color: 'var(--gold)' }}>데이터</span>가 이곳에<br />
                <span style={{ color: 'var(--gold)' }}>기록</span>된다
              </h1>
              <p style={{ fontSize: 16, color: 'var(--ink-2)', maxWidth: 460, lineHeight: 1.65, marginBottom: 32 }}>
                {countries.length > 0 ? `${countries.length}개국 ${countries.length * 26}명의 선수` : '48개국'}, 실시간 스코어와 심층 통계를 한곳에서.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 44 }}>
                <Link href="/matches" className="btn btn-gold" style={{ padding: '11px 22px', fontSize: 14 }}>
                  라이브 경기 보기
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </Link>
                <Link href="/squads" className="btn btn-ghost" style={{ padding: '11px 22px', fontSize: 14 }}>참가국 스쿼드</Link>
              </div>
              <div className="stats-strip">
                <div className="stat-item">
                  <div className="stat-num">{countries.length > 0 ? countries.length : '48'}</div>
                  <div className="stat-lab">Nations</div>
                </div>
                <div className="stat-item">
                  <div className="stat-num">{countries.length > 0 ? countries.length * 26 : '736'}</div>
                  <div className="stat-lab">Players</div>
                </div>
                {liveCount > 0 && (
                  <div className="stat-item">
                    <div className="stat-num" style={{ color: 'var(--live)' }}>{liveCount}</div>
                    <div className="stat-lab" style={{ color: 'var(--live)', opacity: 0.8 }}>Live Now</div>
                  </div>
                )}
                <div className="stat-item">
                  <div className="stat-num">{matches.length > 0 ? matches.length : '104'}</div>
                  <div className="stat-lab">Matches</div>
                </div>
              </div>
            </div>

            <div className="hero-right-col" style={{ position: 'relative', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="hero-ring" />
              <div style={{ width: 220, height: 220, borderRadius: '50%', background: 'var(--gold-soft)', border: '2px solid var(--gold-line)', display: 'grid', placeItems: 'center', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--gold)', opacity: 0.3 }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              {topScorers.length > 0 && (
                <div className="float-chip" style={{ top: 48, right: 0, animation: 'floaty 4s ease-in-out infinite', zIndex: 2 }}>
                  <div className="fc-ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg></div>
                  <div><div className="fc-num">{topScorers[0].goals ?? 0}골</div><div className="fc-lab">Top Scorer</div></div>
                </div>
              )}
              <div className="float-chip" style={{ bottom: 64, left: 0, animation: 'floaty 5s ease-in-out infinite 1.4s', zIndex: 2 }}>
                <div className="fc-ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></div>
                <div><div className="fc-num">{matches.length > 0 ? matches.length : '—'}</div><div className="fc-lab">Matches</div></div>
              </div>
              {standings.length > 0 && (
                <div className="float-chip" style={{ bottom: 160, right: -10, animation: 'floaty 6s ease-in-out infinite 0.7s', zIndex: 2 }}>
                  <div className="fc-ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
                  <div><div className="fc-num">{standings.length}개조</div><div className="fc-lab">Group Stage</div></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="block">
        <div className="wrap">
          <HomeMatchSection />
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }} className="home-two-col">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <p className="eyebrow" style={{ marginBottom: 4 }}>Leaderboard</p>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(20px, 2.4vw, 28px)', letterSpacing: '-0.02em', color: 'var(--ink)' }}>득점 순위</h2>
                </div>
                <Link href="/stats" className="link-more" style={{ fontSize: 11 }}>전체 보기 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></Link>
              </div>
              {topScorers.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {topScorers.map((p, i) => (
                    <Link key={p.playerId} href={`/players/${playerSlug(p.playerId, p.playerName)}`} className="lb-row" style={{ textDecoration: 'none' }}>
                      <span className={`lb-rank${i === 0 ? ' gold' : ''}`}>{i + 1}</span>
                      {p.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.photoUrl} alt={p.playerName} className="lb-av" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }} />
                      ) : (
                        <div className="lb-av"><span className="ini">{p.playerName.charAt(0)}</span></div>
                      )}
                      <div className="lb-meta">
                        <div className="nm">{p.playerName}</div>
                        <div className="sub">{[p.nationality, p.teamName].filter(Boolean).join(' · ')}</div>
                      </div>
                      <div className="lb-val"><div className="v">{p.goals ?? 0}</div><div className="vl">Goals</div></div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} style={{ height: 62, borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--line)', opacity: 0.6 }} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <p className="eyebrow" style={{ marginBottom: 4 }}>Group Stage</p>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(20px, 2.4vw, 28px)', letterSpacing: '-0.02em', color: 'var(--ink)' }}>조별 순위</h2>
                </div>
                <Link href="/standings" className="link-more" style={{ fontSize: 11 }}>전체 보기 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></Link>
              </div>
              {groupStandings.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {groupStandings.slice(0, 6).map(g => <GroupCard key={g.groupName} group={g} />)}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, padding: '14px 16px', height: 130 }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {(showThirdPlace || knockout) && (
        <section className="block">
          <div className="wrap">
            <div style={{ overflowX: 'auto' }}>
              {knockout
                ? <TournamentBracketSection matches={matches} />
                : <ThirdPlaceSection groups={standings} matches={matches} />
              }
            </div>
          </div>
        </section>
      )}

      <section className="cta-band">
        <div className="wrap">
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>PitchLog</p>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.025em', lineHeight: 1.06, marginBottom: 16, color: 'var(--ink)' }}>
            데이터로 보는 <span style={{ color: 'var(--gold)' }}>월드컵</span>,<br />
            지금 시작하세요
          </h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 15, maxWidth: 420, margin: '0 auto 28px', lineHeight: 1.65 }}>
            좋아하는 선수와 팀을 팔로우하고 경기 알림과 맞춤 통계 리포트를 받아보세요.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/squads" className="btn btn-gold" style={{ padding: '12px 26px', fontSize: 14 }}>스쿼드 탐색하기</Link>
            <Link href="/stats" className="btn btn-ghost" style={{ padding: '12px 26px', fontSize: 14 }}>통계 보기</Link>
          </div>
        </div>
      </section>
    </>
  )
}
