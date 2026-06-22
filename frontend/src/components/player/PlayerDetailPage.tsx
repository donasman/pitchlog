import type { Metadata } from 'next'
import Link from 'next/link'
import { api } from '@/lib/api'
import { formatBirthDate, playerSlug } from '@/lib/utils'
import type { PlayerDetail } from '@/types'
import EmptyState from '@/components/ui/EmptyState'
import PlayerAvatar from '@/components/ui/PlayerAvatar'
import BackLink from '@/components/ui/BackLink'

export async function generateStaticParams() {
  try {
    const countries = await api.getCountries()
    if (!countries || countries.length === 0) {
      return [{ slug: '0-placeholder' }]
    }

    const slugs = new Set<string>()
    await Promise.all(
      countries.map(async (country) => {
        try {
          const squad = await api.getSquad(country.code)
          if (squad && squad.players) {
            squad.players.forEach((p) => {
              const s = playerSlug(p.id, p.name)
              if (s) slugs.add(s)
            })
          }
        } catch {
          // 개별 국가 에러는 무시
        }
      })
    )

    const result = Array.from(slugs).map((slug) => ({ slug }))
    return result.length > 0 ? result : [{ slug: '0-placeholder' }]
  } catch (error) {
    console.error('Error generating static params for players:', error)
    return [{ slug: '0-placeholder' }]
  }
}

interface Props {
  params: { slug: string }
}

function parseSlug(slug: string): number {
  return parseInt(slug.split('-')[0], 10)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = parseSlug(params.slug)
  try {
    const player = await api.getPlayer(id)
    return {
      title: `${player.name} - Player Profile`,
      description: `${player.name} (${player.nationality ?? ''}) 2026 FIFA World Cup player stats`,
    }
  } catch {
    return { title: 'Player Profile' }
  }
}

export default async function PlayerDetailPage({ params }: Props) {
  const id = parseSlug(params.slug)
  let player: PlayerDetail | null = null
  try {
    player = await api.getPlayer(id)
  } catch {
    return (
      <EmptyState
        title="선수를 찾을 수 없습니다"
        message="선수 데이터를 불러오지 못했습니다."
        backHref="/squads"
        backLabel="전체 스쿼드"
      />
    )
  }

  if (!player)
    return (
      <EmptyState
        title="선수를 찾을 수 없습니다"
        message="선수 데이터를 불러오지 못했습니다."
        backHref="/squads"
        backLabel="전체 스쿼드"
      />
    )

  return (
    <div className="wrap space-y-10 py-8 max-w-3xl mx-auto">
      <BackLink href="/squads" label="전체 스쿼드" />

      {/* Profile card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="h-1.5 bg-gold-gradient" />
        <div className="p-6 flex flex-col sm:flex-row gap-6 items-start">
          <PlayerAvatar
            src={player.photoUrl}
            name={player.name}
            className="w-28 h-28 rounded-2xl flex-shrink-0 border-2 border-border shadow-lg"
            textClassName="text-3xl"
          />
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-0.5">
                2026 FIFA World Cup
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight">{player.name}</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{player.nationality ?? ''}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              {[
                { label: '생년월일', value: formatBirthDate(player.birthDate) },
                { label: '신장',    value: player.height ?? '-' },
                { label: '체중',    value: player.weight ?? '-' },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-muted/50 px-3 py-2">
                  <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                  <p className="text-sm font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Season stats */}
      {player.stats.length > 0 ? (
        <section>
          <h2 className="text-xl font-bold mb-4">시즌 통계</h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="py-3 pl-4 pr-3">시즌</th>
                    <th className="py-3 pr-3">팀</th>
                    <th className="py-3 pr-3 hidden sm:table-cell">리그</th>
                    <th className="py-3 pr-3 text-right">출장</th>
                    <th className="py-3 pr-3 text-right text-primary">골</th>
                    <th className="py-3 pr-3 text-right text-primary">도움</th>
                    <th className="py-3 pr-3 text-right hidden sm:table-cell">경고</th>
                    <th className="py-3 pr-3 text-right hidden sm:table-cell">퇴장</th>
                    <th className="py-3 pr-4 text-right">평점</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {player.stats.map((s, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 pl-4 pr-3 font-medium">
                        {s.seasonYear}/{(s.seasonYear + 1).toString().slice(2)}
                      </td>
                      <td className="py-3 pr-3 text-xs">{s.teamName ?? '-'}</td>
                      <td className="py-3 pr-3 text-xs text-muted-foreground hidden sm:table-cell">
                        {s.leagueName ?? '-'}
                      </td>
                      <td className="py-3 pr-3 text-right text-muted-foreground">{s.appearances ?? '-'}</td>
                      <td className="py-3 pr-3 text-right font-bold text-primary">{s.goals ?? '-'}</td>
                      <td className="py-3 pr-3 text-right font-bold text-primary">{s.assists ?? '-'}</td>
                      <td className="py-3 pr-3 text-right text-muted-foreground hidden sm:table-cell">
                        {s.yellowCards != null ? (
                          <span className="inline-flex items-center gap-0.5">
                            <span className="w-2.5 h-3.5 bg-yellow-400 rounded-sm inline-block" />
                            {s.yellowCards}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="py-3 pr-3 text-right text-muted-foreground hidden sm:table-cell">
                        {s.redCards != null ? (
                          <span className="inline-flex items-center gap-0.5">
                            <span className="w-2.5 h-3.5 bg-red-500 rounded-sm inline-block" />
                            {s.redCards}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="py-3 pr-4 text-right">
                        {s.rating != null ? (
                          <span className={[
                            'font-semibold',
                            s.rating >= 7.5 ? 'text-green-500' :
                            s.rating >= 6.5 ? 'text-foreground' :
                            'text-muted-foreground',
                          ].join(' ')}>
                            {s.rating.toFixed(2)}
                          </span>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground text-sm">시즌 통계 데이터가 없습니다.</p>
        </div>
      )}

      <div className="flex gap-4 justify-center pt-2">
        <Link href="/stats/top-scorers" className="text-sm text-primary hover:underline underline-offset-4">
          득점 순위
        </Link>
        <span className="text-muted-foreground/40">&#xB7;</span>
        <Link href="/stats/top-assists" className="text-sm text-primary hover:underline underline-offset-4">
          도움 순위
        </Link>
      </div>
    </div>
  )
}
