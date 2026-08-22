import type { Metadata } from 'next'
import type { FixturePrediction, H2HRecord, MatchDetail } from '@/types'
import { api } from '@/lib/api'
import MatchDetailView from '@/components/match/MatchDetailView'
import { getRoundLabel, isKnockoutRound } from '@/lib/round'

export async function generateStaticParams() {
  const matches = await api.getMatches()
  if (!matches || matches.length === 0) {
    // 데이터 없이 빌드하면 실제 경기 URL이 하나도 생성되지 않아 배포본이 통째로 404가 된다.
    // 조용히 placeholder를 만들지 말고 빌드를 실패시킨다.
    throw new Error(
      '[generateStaticParams] /api/matches 가 빈 배열을 반환했습니다. ' +
        '백엔드 상태와 NEXT_PUBLIC_API_URL 을 확인하세요.',
    )
  }
  const ids = new Set<string>()
  matches.forEach((m) => {
    if (m.fixtureId) ids.add(String(m.fixtureId))
  })
  return Array.from(ids).map((id) => ({ fixtureId: id }))
}

interface Props {
  params: { fixtureId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const match = await api.getMatch(Number(params.fixtureId))
    const score =
      match.statusShort && ['FT', 'AET', 'PEN'].includes(match.statusShort)
        ? (match.home.goals ?? 0) + '-' + (match.away.goals ?? 0)
        : 'vs'
    const round =
      match.round && isKnockoutRound(match.round) ? getRoundLabel(match.round) : (match.round ?? '')
    return {
      title: `${match.home.name} ${score} ${match.away.name} — 2026 월드컵 ${round}`.trim(),
      description: `${round || '2026 FIFA World Cup'} · ${match.home.name} vs ${match.away.name} 경기 결과와 선발 라인업.`,
    }
  } catch {
    return { title: 'Match Detail' }
  }
}

/**
 * 경기 상세 페이지 (서버 컴포넌트).
 * 경기·예측·H2H를 빌드 시점에 모두 받아 정적으로 렌더한다.
 */
export default async function MatchDetailPage({ params }: Props) {
  const fixtureId = Number(params.fixtureId)

  let match: MatchDetail | null = null
  try {
    match = await api.getMatch(fixtureId)
  } catch {
    return <MatchDetailView match={null} prediction={null} h2h={[]} />
  }

  let prediction: FixturePrediction | null = null
  let h2h: H2HRecord[] = []

  await Promise.allSettled([
    match.statusShort === 'NS'
      ? api.getPrediction(fixtureId).then((d) => {
          prediction = d
        })
      : Promise.resolve(),
    match.home.teamApiId && match.away.teamApiId
      ? api.getH2H(match.home.teamApiId, match.away.teamApiId).then((d) => {
          h2h = d
        })
      : Promise.resolve(),
  ])

  return <MatchDetailView match={match} prediction={prediction} h2h={h2h} />
}
