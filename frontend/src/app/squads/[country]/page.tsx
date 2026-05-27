import type { Metadata } from 'next'
import Link from 'next/link'
import { api } from '@/lib/api'
import { positionLabel, playerSlug, formatBirthDate } from '@/lib/utils'
import type { SquadResponse } from '@/types'

interface Props {
  params: { country: string }
}

export async function generateStaticParams() {
  try {
    const countries = await api.getCountries()
    return countries.map((c) => ({ country: c.code.toLowerCase() }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const code = params.country.toUpperCase()
  try {
    const squad = await api.getSquad(code)
    return {
      title: `${squad.country.name} Squad - 2026 FIFA World Cup`,
      description: `2026 FIFA World Cup ${squad.country.name} squad with ${squad.players.length} players`,
    }
  } catch {
    return { title: 'Squad Info' }
  }
}

const POSITION_ORDER = ['GK', 'DEF', 'MID', 'FWD'] as const

const POSITION_EMOJI: Record<string, string> = {
  GK: 'GK',
  DEF: 'DEF',
  MID: 'MID',
  FWD: 'FWD',
}

function NotFound({ code }: { code: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="text-5xl">&#x26BD;</div>
      <h1 className="text-2xl font-bold">Squad not found</h1>
      <p className="text-muted-foreground text-sm">Could not load squad for {code}.</p>
      <Link href="/squads" className="text-sm text-primary hover:underline underline-offset-4">
        Back to Squads
      </Link>
    </div>
  )
}

export default async function CountrySquadPage({ params }: Props) {
  const code = params.country.toUpperCase()
  let squad: SquadResponse | null = null
  try {
    squad = await api.getSquad(code)
  } catch {
    return <NotFound code={code} />
  }

  if (!squad) return <NotFound code={code} />

  const byPosition = POSITION_ORDER.reduce<Record<string, typeof squad.players>>((acc, pos) => {
    acc[pos] = squad!.players.filter((p) => p.position === pos)
    return acc
  }, {})

  return (
    <div className="space-y-10">
      <Link
        href="/squads"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All Squads
      </Link>

      <div className="flex items-center gap-5">
        {squad.country.flagUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={squad.country.flagUrl}
            alt={`${squad.country.name} flag`}
            className="w-20 h-[52px] object-cover rounded-lg shadow-md flex-shrink-0"
          />
        ) : (
          <div className="w-20 h-[52px] rounded-lg bg-muted flex items-center justify-center text-sm font-bold flex-shrink-0">
            {code}
          </div>
        )}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-0.5">
            {squad.country.groupName ? `Group ${squad.country.groupName}` : '2026 FIFA World Cup'}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{squad.country.name}</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            World Cup Squad &middot; {squad.players.length} players
          </p>
        </div>
      </div>

      {POSITION_ORDER.map((pos) => {
        const players = byPosition[pos]
        if (!players?.length) return null
        return (
          <section key={pos}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold tracking-widest text-primary border border-primary/40 px-2 py-0.5 rounded">
                {POSITION_EMOJI[pos]}
              </span>
              <h2 className="text-base font-bold">{positionLabel(pos)}</h2>
              <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
                {players.length}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {players.map((player) => (
                <Link
                  key={player.id}
                  href={`/players/${playerSlug(player.id, player.name)}`}
                  className="group flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card hover:border-primary/60 hover:bg-primary/5 transition-all"
                >
                  {player.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={player.photoUrl}
                      alt={player.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-border group-hover:border-primary/40 transition-colors"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-sm font-bold flex-shrink-0 border-2 border-border">
                      {player.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      {player.jerseyNumber != null && (
                        <span className="text-xs font-bold text-primary min-w-[1.25rem]">
                          #{player.jerseyNumber}
                        </span>
                      )}
                      <span className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                        {player.name}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {formatBirthDate(player.birthDate)}
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
