import type { Metadata } from 'next'
import Link from 'next/link'
import { api } from '@/lib/api'
import type { MatchSummary } from '@/types'

export const metadata: Metadata = {
  title: '2026 World Cup Match Schedule',
  description: '2026 FIFA World Cup full match schedule, results and group stage fixtures',
}

// 경기 상태 배지
function StatusBadge({ status, elapsed }: { status: string | null; elapsed: number | null }) {
  if (!status) return null

  const live = ['1H', '2H', 'ET', 'BT', 'P', 'INT'].includes(status)
  const finished = ['FT', 'AET', 'PEN', 'AWD', 'WO'].includes(status)

  if (live) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-green-400 bg-green-400/10 border border-green-400/30 px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        {elapsed != null ? `${elapsed}'` : 'LIVE'}
      </span>
    )
  }
  if (finished) {
    return (
      <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
        FT
      </span>
    )
  }
  if (status === 'HT') {
    return (
      <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-2 py-0.5 rounded-full">
        HT
      </span>
    )
  }
  // NS - Not Started
  return null
}

function MatchCard({ match }: { match: MatchSummary }) {
  const date = match.matchDate ? new Date(match.matchDate) : null
  const isFinished = match.statusShort && ['FT', 'AET', 'PEN', 'AWD', 'WO'].includes(match.statusShort)
  const isLive = match.statusShort && ['1H', '2H', 'HT', 'ET', 'BT', 'P', 'INT'].includes(match.statusShort)
  const hasScore = match.home.goals != null || match.away.goals != null

  return (
    <Link
      href={`/matches/${match.fixtureId}`}
      className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/60 hover:bg-primary/5 transition-all"
    >
      {/* 날짜/시간 */}
      <div className="w-14 text-center flex-shrink-0">
        {date ? (
          <>
            <p className="text-xs text-muted-foreground">
              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
            <p className="text-xs font-semibold">
              {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </p>
          </>
        ) : (
          <span className="text-xs text-muted-foreground">TBD</span>
        )}
      </div>

      {/* 홈팀 */}
      <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
        <span className={[
          'font-semibold text-sm truncate',
          isFinished && match.home.goals != null && match.away.goals != null && match.home.goals > match.away.goals
            ? 'text-foreground' : 'text-muted-foreground',
        ].join(' ')}>
          {match.home.name ?? '-'}
        </span>
        {match.home.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={match.home.logo} alt="" className="w-7 h-7 object-contain flex-shrink-0" />
        ) : (
          <div className="w-7 h-7 rounded bg-muted flex-shrink-0" />
        )}
      </div>

      {/* 스코어 / 상태 */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0 w-20">
        {hasScore ? (
          <div className={[
            'flex items-center gap-2 px-3 py-1 rounded-lg font-bold text-lg',
            isLive ? 'bg-green-400/10' : isFinished ? 'bg-muted/60' : 'bg-muted/30',
          ].join(' ')}>
            <span>{match.home.goals ?? 0}</span>
            <span className="text-muted-foreground/60 text-sm">-</span>
            <span>{match.away.goals ?? 0}</span>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">vs</span>
        )}
        <StatusBadge status={match.statusShort} elapsed={match.elapsed} />
        {match.hasLineup && !isLive && !isFinished && (
          <span className="text-[10px] text-primary/70">Lineup</span>
        )}
      </div>

      {/* 어웨이팀 */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        {match.away.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={match.away.logo} alt="" className="w-7 h-7 object-contain flex-shrink-0" />
        ) : (
          <div className="w-7 h-7 rounded bg-muted flex-shrink-0" />
        )}
        <span className={[
          'font-semibold text-sm truncate',
          isFinished && match.home.goals != null && match.away.goals != null && match.away.goals > match.home.goals
            ? 'text-foreground' : 'text-muted-foreground',
        ].join(' ')}>
          {match.away.name ?? '-'}
        </span>
      </div>

      {/* 화살표 */}
      <svg className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors flex-shrink-0"
           fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}

export default async function MatchesPage() {
  let matches: MatchSummary[] = []
  try {
    matches = await api.getMatches()
  } catch {
    // API unavailable at build time — empty state
  }

  // 라운드별 그룹핑 (순서 유지)
  const roundOrder: string[] = []
  const byRound = new Map<string, MatchSummary[]>()
  for (const m of matches) {
    const round = m.round ?? 'Unknown'
    if (!byRound.has(round)) {
      byRound.set(round, [])
      roundOrder.push(round)
    }
    byRound.get(round)!.push(m)
  }

  return (
    <div className="space-y-10 max-w-4xl">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Fixtures</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          &#x1F3DF;&#xFE0F; Match Schedule
        </h1>
        <p className="text-muted-foreground text-sm">2026 FIFA World Cup &middot; USA / Canada / Mexico</p>
      </div>

      {matches.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <div className="text-4xl mb-3">&#x26BD;</div>
          <p className="font-semibold mb-1">No fixtures available yet</p>
          <p className="text-sm text-muted-foreground">Run the batch job to fetch match data.</p>
        </div>
      ) : (
        roundOrder.map((round) => (
          <section key={round}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-primary">{round}</h2>
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">{byRound.get(round)!.length} matches</span>
            </div>
            <div className="space-y-2">
              {byRound.get(round)!.map((match) => (
                <MatchCard key={match.fixtureId} match={match} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  )
}
