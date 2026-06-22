import { api } from '@/lib/api'
import type { Metadata } from 'next'
import type { StatsRanking } from '@/types'
import StatsUnifiedPage from '@/components/stats/StatsUnifiedPage'

export const metadata: Metadata = {
  title: '2026 월드컵 통계 — 득점 · 도움 · 경고',
  description: '2026 FIFA 월드컵 득점 순위, 도움 순위, 경고 누적 순위를 한눈에.',
  alternates: { canonical: 'https://pitchlog.com/stats' },
}

export default async function StatsPage() {
  let scorersS: StatsRanking[]  = []
  let scorersW: StatsRanking[]  = []
  let assistsS: StatsRanking[]  = []
  let assistsW: StatsRanking[]  = []
  let cardsS:   StatsRanking[]  = []
  let cardsW:   StatsRanking[]  = []

  try {
    ;[scorersS, scorersW, assistsS, assistsW, cardsS, cardsW] = await Promise.all([
      api.getTopScorers(30, 'season'),
      api.getTopScorers(30, 'worldcup'),
      api.getTopAssists(30, 'season'),
      api.getTopAssists(30, 'worldcup'),
      api.getTopYellowCards(30, 'season'),
      api.getTopYellowCards(30, 'worldcup'),
    ])
  } catch { /* 빈 상태 */ }

  return (
    <StatsUnifiedPage
      scorers={{ season: scorersS, worldcup: scorersW }}
      assists={{ season: assistsS, worldcup: assistsW }}
      cards={  { season: cardsS,   worldcup: cardsW   }}
    />
  )
}
