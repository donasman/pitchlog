import type { Metadata } from 'next'
import { api } from '@/lib/api'
import type { MatchDetail } from '@/types'
import PitchFormation from '@/components/match/PitchFormation'
import EmptyState from '@/components/ui/EmptyState'
import TeamLogo from '@/components/ui/TeamLogo'
import BackLink from '@/components/ui/BackLink'
import StatusBadge from '@/components/match/StatusBadge'
import { isFinished as isFinishedStatus } from '@/lib/matchStatus'
import { formatMatchDateLong, formatMatchTime } from '@/lib/format'

export async function generateStaticParams() {
  try {
    const matches = await api.getMatches()
    if (!matches || matches.length === 0) {
      return [{ fixtureId: '0' }]
    }

    const ids = new Set<string>()
    matches.forEach((m) => {
      if (m.fixtureId) ids.add(String(m.fixtureId))
    })

    const result = Array.from(ids).map((id) => ({ fixtureId: id }))
    return result.length > 0 ? result : [{ fixtureId: '0' }]
  } catch (error) {
    console.error('Error generating static params for matches:', error)
    return [{ fixtureId: '0' }]
  }
}

interface Props {
  params: { fixtureId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const match = await api.getMatch(Number(params.fixtureId))
    const score =
      match.statusShort && ['FT', 'AET', 'PEN'].includes(match.statusShort)
        ? `${match.home.goals ?? 0}-${match.away.goals ?? 0}`
        : 'vs'
    return {
      title: `${match.home.name} ${score} ${match.away.name} - 2026 World Cup`,
      description: `${match.round ?? '2026 FIFA World Cup'} match: ${match.home.name} vs ${match.away.name}`,
    }
  } catch {
    return { title: 'Match Detail' }
  }
}

export default async function MatchDetailPage({ params }: Props) {
  let match: MatchDetail | null = null
  try {
    match = await api.getMatch(Number(params.fixtureId))
  } catch {
    return (
      <EmptyState
        title="Match not found"
        message="The match data could not be loaded."
        backHref="/matches"
        backLabel="Back to Schedule"
      />
    )
  }
  if (!match)
    return (
      <EmptyState
        title="Match not found"
        message="The match data could not be loaded."
        backHref="/matches"
        backLabel="Back to Schedule"
      />
    )

  const isFinished = isFinishedStatus(match.statusShort)
  const hasStarted  = match.statusShort !== 'NS'
  const matchDate   = match.matchDate ? new Date(match.matchDate) : null

  const homeLineup =
    match.lineups.find((l) => l.teamApiId === match!.home.teamApiId) ??
    match.lineups[0]
  const awayLineup =
    match.lineups.find((l) => l.teamApiId === match!.away.teamApiId) ??
    match.lineups[1]
  const hasLineup = !!(homeLineup?.startXI.length && awayLineup?.startXI.length)

  return (
    <div className="wrap space-y-8 py-8 max-w-3xl mx-auto">
      <BackLink href="/matches" label="All Fixtures" />

      {/* 스코어카드 */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="h-1.5 bg-gold-gradient" />
        <div className="p-6 space-y-4">
          {/* 라운드 + 날짜 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider text-primary text-xs">
              {match.round ?? '2026 FIFA World Cup'}
            </span>
            <span>
              {matchDate ? formatMatchDateLong(match.matchDate) : 'TBD'}
              {matchDate && (
                <span className="ml-2">{formatMatchTime(match.matchDate, 'en-US')}</span>
              )}
            </span>
          </div>

          {/* 팀 vs 스코어 */}
          <div className="flex items-center justify-between gap-4">
            {/* 홈팀 */}
            <div className="flex-1 flex flex-col items-center gap-2 text-center">
              <TeamLogo src={match.home.logo} name={match.home.name} className="w-16 h-16" rounded="rounded-full" textClassName="text-lg" />
              <span className="font-bold text-base sm:text-lg">{match.home.name}</span>
            </div>

            {/* 스코어 */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              {hasStarted ? (
                <div className="flex items-center gap-3">
                  <span className={['text-4xl font-extrabold tabular-nums',
                    isFinished && (match.home.goals ?? 0) > (match.away.goals ?? 0) ? 'text-foreground' : 'text-muted-foreground',
                  ].join(' ')}>
                    {match.home.goals ?? 0}
                  </span>
                  <span className="text-2xl text-muted-foreground/40">-</span>
                  <span className={['text-4xl font-extrabold tabular-nums',
                    isFinished && (match.away.goals ?? 0) > (match.home.goals ?? 0) ? 'text-foreground' : 'text-muted-foreground',
                  ].join(' ')}>
                    {match.away.goals ?? 0}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-muted-foreground/40">vs</span>
              )}
              <StatusBadge status={match.statusShort} elapsed={match.elapsed} size="md" />
            </div>

            {/* 어웨이팀 */}
            <div className="flex-1 flex flex-col items-center gap-2 text-center">
              <TeamLogo src={match.away.logo} name={match.away.name} className="w-16 h-16" rounded="rounded-full" textClassName="text-lg" />
              <span className="font-bold text-base sm:text-lg">{match.away.name}</span>
            </div>
          </div>

          {/* 경기장 */}
          {(match.venueName || match.venueCity) && (
            <p className="text-center text-xs text-muted-foreground">
              &#x1F4CD; {[match.venueName, match.venueCity].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* 라인업 */}
      {hasLineup ? (
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Starting Lineups</h2>
          <PitchFormation home={homeLineup!} away={awayLineup!} />

          {/* 교체 선수 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {[homeLineup!, awayLineup!].map((team) => (
              <div key={team.teamApiId} className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-sm font-bold mb-3 text-muted-foreground uppercase tracking-wider">
                  {team.teamName} &mdash; Subs
                </h3>
                <div className="space-y-1.5">
                  {team.substitutes.map((p) => (
                    <div key={p.playerApiId} className="flex items-center gap-2 text-sm">
                      <span className="w-6 text-right text-xs text-muted-foreground font-mono">
                        {p.number ?? '-'}
                      </span>
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            p.pos === 'G' ? '#f59e0b'
                            : p.pos === 'D' ? '#3b82f6'
                            : p.pos === 'M' ? '#22c55e'
                            : '#ef4444',
                        }}
                      />
                      <span className="truncate">{p.name}</span>
                    </div>
                  ))}
                  {team.substitutes.length === 0 && (
                    <p className="text-xs text-muted-foreground">No substitute data</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="rounded-xl border border-border bg-card p-8 text-center space-y-2">
          <div className="text-3xl">&#x1F4CB;</div>
          <p className="font-semibold">Lineup not available yet</p>
          <p className="text-sm text-muted-foreground">
            {match.statusShort === 'NS'
              ? 'Lineups are usually announced 1 hour before kick-off.'
              : 'Lineup data could not be loaded for this match.'}
          </p>
        </div>
      )}
    </div>
  )
}
