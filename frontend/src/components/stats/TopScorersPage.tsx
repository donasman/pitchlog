import type { Metadata } from 'next'
import { api } from '@/lib/api'
import type { StatsRanking } from '@/types'
import StatsRankingPage from '@/components/stats/StatsRankingPage'
import { SITE_URL } from '@/lib/config'

export const metadata: Metadata = {
  title: '2026 월드컵 득점 순위 — Top Scorers',
  description: '2026 FIFA 월드컵 득점 순위를 확인하세요. 전 리그 합산 시즌 골 기준 랭킹.',
  alternates: { canonical: `${SITE_URL}/stats/top-scorers` },
  openGraph: {
    title: '2026 월드컵 득점 순위 | PitchLog',
    description: '2026 FIFA 월드컵 득점 순위를 확인하세요. 전 리그 합산 시즌 골 기준 랭킹.',
    url: `${SITE_URL}/stats/top-scorers`,
    type: 'website',
  },
}

export default async function TopScorersPage() {
  let seasonRankings: StatsRanking[] = []
  let worldcupRankings: StatsRanking[] = []
  try {
    ;[seasonRankings, worldcupRankings] = await Promise.all([
      api.getTopScorers(30, 'season'),
      api.getTopScorers(30, 'worldcup'),
    ])
  } catch { /* 빈 상태 표시 */ }

  return (
    <StatsRankingPage
      mode="goals"
      icon="⚽"
      title="득점 순위"
      crossLinkHref="/stats/top-assists"
      crossLinkLabel="도움 순위"
      seasonRankings={seasonRankings}
      worldcupRankings={worldcupRankings}
    />
  )
}
