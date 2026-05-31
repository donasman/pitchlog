import type { Metadata } from 'next'
import Link from 'next/link'
import { api } from '@/lib/api'
import type { StatsRanking } from '@/types'
import StatsRankingTable from '@/components/stats/StatsRankingTable'

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

export default async function TopAssistsPage() {
  let rankings: StatsRanking[] = []
  try {
    rankings = await api.getTopAssists(30)
  } catch {
    // API 미응답 시 빈 목록 표시
  }

  return (
    <div className="wrap space-y-8 py-8 max-w-4xl mx-auto">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Stats</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-2">
          <span>&#x1F3AF;</span> Top Assists
        </h1>
        <p className="text-muted-foreground text-sm">2025-26 Season - World Cup squads only</p>
      </div>

      <StatsRankingTable rankings={rankings} mode="assists" />

      <div className="text-center pt-2">
        <Link href="/stats/top-scorers" className="text-sm text-primary hover:underline underline-offset-4">
          Top Scorers &rarr;
        </Link>
      </div>
    </div>
  )
}
