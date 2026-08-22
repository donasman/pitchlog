import type { Metadata } from 'next'
import { api } from '@/lib/api'
import type { StatsRanking } from '@/types'
import StatsRankingPage from '@/components/stats/StatsRankingPage'
import { SITE_URL } from '@/lib/config'

export const metadata: Metadata = {
  title: '2026 월드컵 도움 순위 — Top Assists',
  description: '2026 FIFA 월드컵 도움 순위를 확인하세요. 전 리그 합산 시즌 어시스트 기준 랭킹.',
  alternates: { canonical: `${SITE_URL}/stats/top-assists` },
  openGraph: {
    title: '2026 월드컵 도움 순위 | PitchLog',
    description: '2026 FIFA 월드컵 도움 순위를 확인하세요. 전 리그 합산 시즌 어시스트 기준 랭킹.',
    url: `${SITE_URL}/stats/top-assists`,
    type: 'website',
  },
}

export default async function TopAssistsPage() {
  let seasonRankings: StatsRanking[] = []
  let worldcupRankings: StatsRanking[] = []
  try {
    ;[seasonRankings, worldcupRankings] = await Promise.all([
      api.getTopAssists(30, 'season'),
      api.getTopAssists(30, 'worldcup'),
    ])
  } catch { /* 빈 상태 표시 */ }

  return (
    <StatsRankingPage
      mode="assists"
      icon="🎯"
      title="도움 순위"
      crossLinkHref="/stats/top-scorers"
      crossLinkLabel="득점 순위"
      seasonRankings={seasonRankings}
      worldcupRankings={worldcupRankings}
    />
  )
}
