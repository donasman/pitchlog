import type { Metadata } from 'next'
import Link from 'next/link'
import { api } from '@/lib/api'
import { positionLabel, playerSlug, formatBirthDate } from '@/lib/utils'
import type { Coach, SquadResponse } from '@/types'
import EmptyState from '@/components/ui/EmptyState'
import PlayerAvatar from '@/components/ui/PlayerAvatar'
import CountryFlag from '@/components/ui/CountryFlag'
import BackLink from '@/components/ui/BackLink'

export async function generateStaticParams() {
  try {
    const countries = await api.getCountries()
    if (!countries || countries.length === 0) {
      return [{ country: 'placeholder' }]
    }

    const codes = new Set<string>()
    countries.forEach((c) => {
      if (c.code) codes.add(c.code.toLowerCase())
    })

    const result = Array.from(codes).map((code) => ({ country: code }))
    return result.length > 0 ? result : [{ country: 'placeholder' }]
  } catch (error) {
    console.error('Error generating static params for squads:', error)
    return [{ country: 'placeholder' }]
  }
}

interface Props {
  params: { country: string }
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

const POSITION_LABEL: Record<string, string> = {
  GK: 'GK',
  DEF: 'DEF',
  MID: 'MID',
  FWD: 'FWD',
}

export default async function CountrySquadPage({ params }: Props) {
  const code = params.country.toUpperCase()
  let squad: SquadResponse | null = null
  let coach: Coach | null = null

  try {
    squad = await api.getSquad(code)
  } catch {
    return (
      <EmptyState
        title="스쿼드를 찾을 수 없습니다"
        message={`${code} 스쿼드를 불러오지 못했습니다.`}
        backHref="/squads"
        backLabel="전체 스쿼드"
      />
    )
  }

  if (!squad)
    return (
      <EmptyState
        title="스쿼드를 찾을 수 없습니다"
        message={`${code} 스쿼드를 불러오지 못했습니다.`}
        backHref="/squads"
        backLabel="전체 스쿼드"
      />
    )

  try {
    coach = await api.getCoachByCountry(code)
  } catch {
    // 감독 데이터 없으면 null
  }

  const byPosition = POSITION_ORDER.reduce<Record<string, typeof squad.players>>((acc, pos) => {
    acc[pos] = squad!.players.filter((p) => p.position === pos)
    return acc
  }, {})

  return (
    <div className="wrap space-y-10 py-8">
      <BackLink href="/squads" label="전체 스쿼드" />

      <div className="flex items-center gap-5">
        <CountryFlag
          src={squad.country.flagUrl}
          code={code}
          name={squad.country.name}
          className="w-20 h-[52px] rounded-lg shadow-md flex-shrink-0"
          textClassName="text-sm font-bold"
        />
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

      {/* 감독 카드 */}
      {coach && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold tracking-widest text-primary border border-primary/40 px-2 py-0.5 rounded">
              COACH
            </span>
            <h2 className="text-base font-bold">감독</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '18px 20px',
            border: '1px solid var(--line)',
            borderRadius: 16,
            background: 'var(--surface)',
            maxWidth: 420,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 14,
              overflow: 'hidden', flexShrink: 0,
              background: 'var(--line)',
            }}>
              {coach.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coach.photoUrl} alt={coach.name} width={64} height={64}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
              ) : (
                <div style={{
                  width: '100%', height: '100%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 28, color: 'var(--ink-3)',
                }}>🧑‍💼</div>
              )}
            </div>
            <div>
              <p style={{ fontSize: 17, fontWeight: 800, color: 'var(--ink-1)', margin: 0 }}>
                {coach.name}
              </p>
              <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
                {[coach.nationality, coach.birthDate].filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>
        </section>
      )}

      {POSITION_ORDER.map((pos) => {
        const players = byPosition[pos]
        if (!players?.length) return null
        return (
          <section key={pos}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold tracking-widest text-primary border border-primary/40 px-2 py-0.5 rounded">
                {POSITION_LABEL[pos]}
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
                  <PlayerAvatar
                    src={player.photoUrl}
                    name={player.name}
                    className="w-12 h-12 rounded-full flex-shrink-0 border-2 border-border group-hover:border-primary/40 transition-colors"
                    textClassName="text-sm"
                  />
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
