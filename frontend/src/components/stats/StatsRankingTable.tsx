import Link from 'next/link'
import type { StatsRanking } from '@/types'
import { playerSlug } from '@/lib/utils'
import PlayerAvatar from '@/components/ui/PlayerAvatar'

type StatMode = 'goals' | 'assists'

interface Props {
  rankings: StatsRanking[]
  mode: StatMode
}

const rankBadgeClass = (i: number) => {
  if (i === 0) return 'bg-yellow-500/20 text-yellow-500'
  if (i === 1) return 'bg-slate-400/20 text-slate-400'
  return 'bg-amber-700/20 text-amber-700'
}

export default function StatsRankingTable({ rankings, mode }: Props) {
  const primaryLabel = mode === 'goals' ? 'Goals' : 'Assists'
  const secondaryLabel = mode === 'goals' ? 'Assists' : 'Goals'
  const primaryValue = (p: StatsRanking) => mode === 'goals' ? p.goals : p.assists
  const secondaryValue = (p: StatsRanking) => mode === 'goals' ? p.assists : p.goals

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="py-3 pl-4 pr-2 w-10">#</th>
              <th className="py-3 pr-4">Player</th>
              <th className="py-3 pr-4 hidden sm:table-cell">Nation</th>
              <th className="py-3 pr-4 text-right">Apps</th>
              <th className="py-3 pr-4 text-right text-primary">{primaryLabel}</th>
              <th className="py-3 pr-4 text-right">{secondaryLabel}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rankings.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground text-sm">
                  데이터가 없습니다. 배치 실행 후 다시 확인하세요.
                </td>
              </tr>
            ) : (
              rankings.map((p, i) => (
                <tr key={p.playerId} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 pl-4 pr-2 text-muted-foreground font-medium">
                    {i < 3 ? (
                      <span className={[
                        'inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-bold',
                        rankBadgeClass(i),
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
                      <PlayerAvatar
                        src={p.photoUrl}
                        name={p.playerName}
                        className="w-9 h-9 rounded-full flex-shrink-0 border border-border"
                        textClassName="text-xs"
                      />
                      <span className="font-semibold">{p.playerName}</span>
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground text-xs hidden sm:table-cell">
                    {p.nationality ?? '-'}
                  </td>
                  <td className="py-3 pr-4 text-right text-muted-foreground">{p.appearances ?? '-'}</td>
                  <td className="py-3 pr-4 text-right font-bold text-primary text-base">
                    {primaryValue(p) ?? '-'}
                  </td>
                  <td className="py-3 pr-4 text-right text-muted-foreground">
                    {secondaryValue(p) ?? '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
