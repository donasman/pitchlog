import type { Metadata } from 'next'
import { api } from '@/lib/api'
import type { StatsRanking } from '@/types'
import StatsRankingPage from '@/components/stats/StatsRankingPage'
import { SITE_URL } from '@/lib/config'

export const metadata: Metadata = {
  title: '2026 월드컵 경고/퇴장 누적 순위 — Top Cards',
  description: '2026 FIFA 월드컵 경고 누적 순위 및 퇴장 순위. 전 리그 합산 시즌 카드 기준 랭킹.',
  alternates: { canonical: `${SITE_URL}/stats/top-cards` },
  openGraph: {
    title: '2026 월드컵 경고/퇴장 누적 순위 | PitchLog',
    description: '2026 FIFA 월드컵 경고 누적 순위 및 퇴장 순위.',
    url: `${SITE_URL}/stats/top-cards`,
    type: 'website',
  },
}

export default async function TopCardsPage() {
  let seasonRankings: StatsRanking[] = []
  let worldcupRankings: StatsRanking[] = []
  try {
    ;[seasonRankings, worldcupRankings] = await Promise.all([
      api.getTopYellowCards(30, 'season'),
      api.getTopYellowCards(30, 'worldcup'),
    ])
  } catch { /* 빈 상태 표시 */ }

  return (
    <StatsRankingPage
      mode="yellowCards"
      icon="🟨"
      title="카드 순위"
      crossLinkHref="/stats/top-scorers"
      crossLinkLabel="득점 순위"
      seasonRankings={seasonRankings}
      worldcupRankings={worldcupRankings}
    />
  )
}
