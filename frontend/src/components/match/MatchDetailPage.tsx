import type { Metadata } from 'next'
import { api } from '@/lib/api'
import MatchDetailClient from '@/components/match/MatchDetailClient'

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

export default function MatchDetailPage({ params }: Props) {
  return <MatchDetailClient fixtureId={Number(params.fixtureId)} />
}
