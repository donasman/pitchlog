import type { Metadata } from 'next'
import StatsRankingPage from '@/components/stats/StatsRankingPage'

export const metadata: Metadata = {
  title: '2026 월드컵 득점 순위 — Top Scorers',
  description: '2026 FIFA 월드컵 득점 순위를 확인하세요. 전 리그 합산 시즌 골 기준 랭킹.',
  alternates: { canonical: 'https://pitchlog.com/stats/top-scorers' },
  openGraph: {
    title: '2026 월드컵 득점 순위 | PitchLog',
    description: '2026 FIFA 월드컵 득점 순위를 확인하세요. 전 리그 합산 시즌 골 기준 랭킹.',
    url: 'https://pitchlog.com/stats/top-scorers',
    type: 'website',
  },
}

export default function TopScorersPage() {
  return (
    <StatsRankingPage
      mode="goals"
      icon="⚽"
      title="Top Scorers"
      crossLinkHref="/stats/top-assists"
      crossLinkLabel="Top Assists"
    />
  )
}
