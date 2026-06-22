import type { Metadata } from 'next'
import Link from 'next/link'
import { api } from '@/lib/api'
import type { Country, StatsRanking, MatchSummary, StandingGroup } from '@/types'
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

  // Group Stage 3위 팀을 각 조에 삽입 후 Group Stage 카드는 제외
  const groupStandings = enrichWithThirdPlace(standings, matches)

  const sortedMatches = [...matches].sort((a, b) => {
    const aLive = LIVE_STATUS.has(a.statusShort ?? '') ? 0 : a.statusShort === 'FT' ? 1 : 2
    const bLive = LIVE_STATUS.has(b.statusShort ?? '') ? 0 : b.statusShort === 'FT' ? 1 : 2
    return aLive - bLive
  })
  const recentMatches = sortedMatches.slice(0, 4)

  return (
    <>
      {/* ── Hero ── 2-column ──────────────────────────────────── */}
      <header className="hero">
        <div className="wrap" style={{ paddingTop: 72, paddingBottom: 80 }}>
          <div className="hero-two-col" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 56,
            alignItems: 'center',
          }}>
            {/* Left: text */}
            <div>
              {/* Pill tag */}
              <div className="hero-tag">
                <span className="pin">LIVE</span>
                2026 FIFA World Cup
              </div>

              {/* Headline */}
              <h1 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(34px, 4.8vw, 62px)',
                lineHeight: 1.0,
                letterSpacing: '-0.03em',
                color: 'var(--ink)',
                marginBottom: 22,
              }}>
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
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                </Link>
                <Link href="/squads" className="btn btn-ghost" style={{ padding: '11px 22px', fontSize: 14 }}>
                  참가국 스쿼드
                </Link>
              </div>

              <div className="stats-strip">
                <div className="stat-item">
                  <div className="stat-num">{countries.length > 0 ? `${countries.length}개국` : '—'}</div>
                  <div className="stat-lab">Nations</div>
                </div>
                <div className="stat-item">
                  <div className="stat-num">{countries.length > 0 ? countries.length * 26 : '—'}</div>
                  <div className="stat-lab">Players</div>
                </div>
                <div className="stat-item">
                  <div className="stat-num">{matches.length > 0 ? matches.length : '—'}</div>
                  <div className="stat-lab">Matches</div>
                </div>
              </div>
            </div>

            {/* Right: ring + float chips */}
            <div className="hero-right-col" style={{ position: 'relative', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Outer ring */}
              <div className="hero-ring" />

              {/* Center: player circle */}
              <div style={{
                width: 220, height: 220,
                borderRadius: '50%',
                background: 'var(--gold-soft)',
                border: '2px solid var(--gold-line)',
                display: 'grid', placeItems: 'center',
                position: 'relative', zIndex: 1,
                overflow: 'hidden',
              }}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--gold)', opacity: 0.3 }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>

              {/* Float chip — top scorer */}
              {topScorers.length > 0 && (
                <div className="float-chip" style={{ top: 48, right: 0, animation: 'floaty 4s ease-in-out infinite', zIndex: 2 }}>
                  <div className="fc-ic">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
                  </div>
                  <div>
                    <div className="fc-num">{topScorers[0].goals ?? 0}골</div>
                    <div className="fc-lab">Top Scorer</div>
                  </div>
                </div>
              )}

              {/* Float chip — matches count */}
              <div className="float-chip" style={{ bottom: 64, left: 0, animation: 'floaty 5s ease-in-out infinite 1.4s', zIndex: 2 }}>
                <div className="fc-ic">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                </div>
                <div>
                  <div className="fc-num">{matches.length > 0 ? matches.length : '—'}</div>
                  <div className="fc-lab">Matches</div>
                </div>
              </div>

              {/* Float chip — standings */}
              {standings.length > 0 && (
                <div className="float-chip" style={{ bottom: 160, right: -10, animation: 'floaty 6s ease-in-out infinite 0.7s', zIndex: 2 }}>
                  <div className="fc-ic">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  </div>
                  <div>
                    <div className="fc-num">{standings.length}개조</div>
                    <div className="fc-lab">Group Stage</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Live & Results ────────────────────────────────────── */}
      <section className="block">
        <div className="wrap">
          <HomeMatchSection />
        </div>
      </section>

      {/* ── Group Stage ───────────────────────────────────────── */}
      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div className="left">
              <p className="eyebrow">Group Stage</p>
              <h2>{countries.length > 0 ? `${countries.length}개국` : "—"} · <span className="kr">{groupStandings.length > 0 ? `${groupStandings.length}개 조` : "—"}</span> 순위표</h2>
              <p>조별 리그 현황과 각 팀의 승점을 확인하세요.</p>
            </div>
            <Link href="/standings" className="link-more">
              전체 순위
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
          </div>

          {groupStandings.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {groupStandings.map(g => <GroupCard key={g.groupName} group={g} />)}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, padding: '14px 16px', height: 140 }} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Leaderboards ──────────────────────────────────────── */}
      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div className="left">
              <p className="eyebrow">Leaderboards</p>
              <h2>대회 통계 <span className="kr">리더보드</span></h2>
              <p>이번 대회 득점 선두를 달리는 선수들.</p>
            </div>
            <Link href="/stats/top-scorers" className="link-more">
              전체 순위
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
          </div>

          {topScorers.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 680 }}>
              {topScorers.map((p, i) => (
                <Link
                  key={p.playerId}
                  href={`/players/${playerSlug(p.playerId, p.playerName)}`}
                  className="lb-row"
                  style={{ textDecoration: 'none' }}
                >
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
                  <div className="lb-val">
                    <div className="v">{p.goals ?? 0}</div>
                    <div className="vl">Goals</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--ink-3)', fontSize: 14 }}>
              월드컵 통계 데이터를 집계 중입니다.
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Band ──────────────────────────────────────────── */}
      <section className="cta-band">
        <div className="wrap">
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
            PitchLog
          </p>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
            fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.025em',
            lineHeight: 1.06, marginBottom: 16, color: 'var(--ink)',
          }}>
            데이터로 보는 <span style={{ color: 'var(--gold)' }}>월드컵</span>,<br />
            지금 시작하세요
          </h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 15, maxWidth: 420, margin: '0 auto 28px', lineHeight: 1.65 }}>
            좋아하는 선수와 팀을 팔로우하고 경기 알림과 맞춤 통계 리포트를 받아보세요.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/squads" className="btn btn-gold" style={{ padding: '12px 26px', fontSize: 14 }}>스쿼드 탐색하기</Link>
            <Link href="/stats/top-scorers" className="btn btn-ghost" style={{ padding: '12px 26px', fontSize: 14 }}>통계 보기</Link>
          </div>
        </div>
      </section>
    </>
  )
}
