import type { Metadata } from 'next'
import StatsRankingPage from '@/components/stats/StatsRankingPage'

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

export default function TopAssistsPage() {
  return (
    <StatsRankingPage
      mode="assists"
      icon="🎯"
      title="Top Assists"
      crossLinkHref="/stats/top-scorers"
      crossLinkLabel="Top Scorers"
    />
  )
}
