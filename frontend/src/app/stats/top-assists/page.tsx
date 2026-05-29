import type { Metadata } from 'next'
import Link from 'next/link'
import { api } from '@/lib/api'
import type { StatsRanking } from '@/types'
import { playerSlug } from '@/lib/utils'

export const metadata: Metadata = {
  title: '2026 월드컵 도움 순위 — Top Assists',
  description: '2026 FIFA 월드컵 도움 순위를 확인하세요. 전 리그 합산 시즌 어시스트 기준 랭킹.',
  alternates: { canonical: 'https://pitchlog.com/stats/top-assists' },
  openGraph: {
    title: '2026 월드컵 도움 순위 | PitchLog',
    description: '2026 FIFA 월드컵 도움 순위를 확인하세요. 전 리그 합산 시즌 어시스트 기준 랭킹.',
    url: 'https://pitchlog.com/stats/top-assists',
    type: 'website',
  },
}

export default async function TopAssistsPage() {
  let rankings: StatsRanking[] = []
  try {
    rankings = await api.getTopAssists(30)
  } catch {
    // fallback when API unavailable at build time
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Stats</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-2">
          <span>&#x1F3AF;</span> Top Assists
        </h1>
        <p className="text-muted-foreground text-sm">2025-26 Season - World Cup squads only</p>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 pl-4 pr-2 w-10">#</th>
                <th className="py-3 pr-4">Player</th>
                <th className="py-3 pr-4 hidden sm:table-cell">Nation</th>
                <th className="py-3 pr-4 hidden md:table-cell">Club</th>
                <th className="py-3 pr-4 text-right">Apps</th>
                <th className="py-3 pr-4 text-right text-primary">Assists</th>
                <th className="py-3 pr-4 text-right">Goals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rankings.map((p, i) => (
                <tr key={p.playerId} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 pl-4 pr-2 text-muted-foreground font-medium">
                    {i < 3 ? (
                      <span className={[
                        'inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-bold',
                        i === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                        i === 1 ? 'bg-slate-400/20 text-slate-400' :
                        'bg-amber-700/20 text-amber-700',
                      ].join(' ')}>
                        {i + 1}
                      </span>
                    ) : (
                      <span className="pl-1">{i + 1}</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <Link
                      href={`/players/${playerSlug(p.playerId, p.playerName)}`}
                      className="flex items-center gap-2.5 hover:text-primary transition-colors"
                    >
                      {p.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.photoUrl} alt={p.playerName} className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-border" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {p.playerName.charAt(0)}
                        </div>
                      )}
                      <span className="font-semibold">{p.playerName}</span>
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground text-xs hidden sm:table-cell">{p.nationality ?? '-'}</td>
                  <td className="py-3 pr-4 text-muted-foreground text-xs hidden md:table-cell">{p.teamName ?? '-'}</td>
                  <td className="py-3 pr-4 text-right text-muted-foreground">{p.appearances ?? '-'}</td>
                  <td className="py-3 pr-4 text-right font-bold text-primary text-base">{p.assists ?? '-'}</td>
                  <td className="py-3 pr-4 text-right text-muted-foreground">{p.goals ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center pt-2">
        <Link href="/stats/top-scorers" className="text-sm text-primary hover:underline underline-offset-4">
          Top Scorers &rarr;
        </Link>
      </div>
    </div>
  )
}
