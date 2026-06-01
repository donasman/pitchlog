import Link from 'next/link'
import { api } from '@/lib/api'
import type { StatsRanking } from '@/types'
import StatsRankingTable from './StatsRankingTable'
import PageHeader from '@/components/ui/PageHeader'

interface StatsRankingPageProps {
  /** 순위 기준 — 득점/도움 */
  mode: 'goals' | 'assists'
  /** 제목 옆 이모지 */
  icon: string
  /** 제목 (예: "Top Scorers") */
  title: string
  /** 반대편 통계 페이지로 가는 링크 */
  crossLinkHref: string
  crossLinkLabel: string
}

/**
 * 득점/도움 순위 페이지의 공통 본문.
 * top-scorers·top-assists가 mode만 달라 거의 동일했던 것을 하나로 통합한다.
 */
export default async function StatsRankingPage({
  mode,
  icon,
  title,
  crossLinkHref,
  crossLinkLabel,
}: StatsRankingPageProps) {
  let rankings: StatsRanking[] = []
  try {
    rankings = mode === 'goals' ? await api.getTopScorers(30) : await api.getTopAssists(30)
  } catch {
    // API 미응답 시 빈 목록 표시
  }

  return (
    <div className="wrap space-y-8 py-8 max-w-4xl mx-auto">
      <PageHeader
        eyebrow="Stats"
        title={<><span>{icon}</span> {title}</>}
        subtitle="2025-26 Season - World Cup squads only"
      />

      <StatsRankingTable rankings={rankings} mode={mode} />

      <div className="text-center pt-2">
        <Link href={crossLinkHref} className="text-sm text-primary hover:underline underline-offset-4">
          {crossLinkLabel} &rarr;
        </Link>
      </div>
    </div>
  )
}
