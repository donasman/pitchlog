import type { Metadata } from 'next'
import StatsRankingPage from '@/components/stats/StatsRankingPage'

export const metadata: Metadata = {
  title: '2026 월드컵 경고/퇴장 누적 순위 — Top Cards',
  description: '2026 FIFA 월드컵 경고 누적 순위 및 퇴장 순위. 전 리그 합산 시즌 카드 기준 랭킹.',
  alternates: { canonical: 'https://pitchlog.com/stats/top-cards' },
  openGraph: {
    title: '2026 월드컵 경고/퇴장 누적 순위 | PitchLog',
    description: '2026 FIFA 월드컵 경고 누적 순위 및 퇴장 순위.',
    url: 'https://pitchlog.com/stats/top-cards',
    type: 'website',
  },
}

export default function TopCardsPage() {
  return (
    <StatsRankingPage
      mode="yellowCards"
      icon="🟨"
      title="Top Cards"
      crossLinkHref="/stats/top-scorers"
      crossLinkLabel="Top Scorers"
    />
  )
}
