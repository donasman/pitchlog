import type { Metadata } from 'next'
import Link from 'next/link'
import { api } from '@/lib/api'
import { formatBirthDate, playerSlug } from '@/lib/utils'
import type { PlayerDetail } from '@/types'

interface Props {
  params: { slug: string }
}

function parseSlug(slug: string): number {
  return parseInt(slug.split('-')[0], 10)
}

export async function generateStaticParams() {
  try {
    const countries = await api.getCountries()
    const slugs = new Set<string>()
    await Promise.all(
      countries.map(async (country) => {
        try {
          const squad = await api.getSquad(country.code)
          squad.players.forEach((p) => slugs.add(playerSlug(p.id, p.name)))
        } catch {
          // skip on error
        }
      })
    )
    return Array.from(slugs).map((slug) => ({ slug }))
  } catch {
    return []
  }
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

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="text-5xl">&#x26BD;</div>
      <h1 className="text-2xl font-bold">Player not found</h1>
      <p className="text-muted-foreground text-sm">The player data could not be loaded.</p>
      <Link href="/squads" className="text-sm text-primary hover:underline underline-offset-4">
        Back to Squads
      </Link>
    </div>
  )
}

export default async function PlayerDetailPage({ params }: Props) {
  const id = parseSlug(params.slug)
  let player: PlayerDetail | null = null
  try {
    player = await api.getPlayer(id)
  } catch {
    return <NotFound />
  }

  if (!player) return <NotFound />

  return (
    <div className="space-y-10 max-w-3xl">
      <Link
        href="/squads"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All Squads
      </Link>

      {/* Profile card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="h-1.5 bg-gold-gradient" />
        <div className="p-6 flex flex-col sm:flex-row gap-6 items-start">
          {player.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={player.photoUrl}
              alt={player.name}
              className="w-28 h-28 rounded-2xl object-cover flex-shrink-0 border-2 border-border shadow-lg"
            />
          ) : (
            <div className="w-28 h-28 rounded-2xl bg-muted flex items-center justify-center text-3xl font-bold flex-shrink-0">
              {player.name.charAt(0)}
            </div>
          )}
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
                { label: 'Born', value: formatBirthDate(player.birthDate) },
                { label: 'Height', value: player.height ?? '-' },
                { label: 'Weight', value: player.weight ?? '-' },
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
          <h2 className="text-xl font-bold mb-4">Season Stats</h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="py-3 pl-4 pr-3">Season</th>
                    <th className="py-3 pr-3">Team</th>
                    <th className="py-3 pr-3 hidden sm:table-cell">League</th>
                    <th className="py-3 pr-3 text-right">Apps</th>
                    <th className="py-3 pr-3 text-right text-primary">G</th>
                    <th className="py-3 pr-3 text-right text-primary">A</th>
                    <th className="py-3 pr-3 text-right hidden sm:table-cell">YC</th>
                    <th className="py-3 pr-3 text-right hidden sm:table-cell">RC</th>
                    <th className="py-3 pr-4 text-right">Rating</th>
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
          <p className="text-muted-foreground text-sm">No season stats available.</p>
        </div>
      )}

      <div className="flex gap-4 justify-center pt-2">
        <Link href="/stats/top-scorers" className="text-sm text-primary hover:underline underline-offset-4">
          Top Scorers
        </Link>
        <span className="text-muted-foreground/40">&#xB7;</span>
        <Link href="/stats/top-assists" className="text-sm text-primary hover:underline underline-offset-4">
          Top Assists
        </Link>
      </div>
    </div>
  )
}
