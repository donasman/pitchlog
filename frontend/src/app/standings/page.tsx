import type { Metadata } from 'next'
import { api } from '@/lib/api'
import { StandingsPage } from '@/components/standings/StandingsPage'
import type { StandingGroup, MatchSummary } from '@/types'

export const metadata: Metadata = {
  title: '2026 월드컵 조별 순위',
  description: '2026 FIFA 월드컵 12개 조 순위표. A조부터 L조까지 전체 48개국 승점·득실차·최근 폼을 한눈에 확인하세요.',
  openGraph: {
    title: '2026 월드컵 조별 순위 | PitchLog',
    description: '2026 FIFA 월드컵 12개 조 순위표. 48개국 승점·득실차를 실시간으로 확인하세요.',
  },
}

/**
 * Match 데이터로 Group Stage 팀(3위 팀)의 실제 조 소속을 추론하여
 * 각 조 standings 배열에 rank 3으로 삽입한다.
 *
 * 원리: 같은 경기에 출전한 팀은 같은 조 소속.
 *       Group A~L에 이미 rank 1·2·4가 있으므로, 그 팀들과 같이 경기한
 *       Group Stage 팀이 해당 조의 3위.
 */
function enrichWithThirdPlace(groups: StandingGroup[], matches: MatchSummary[]): StandingGroup[] {
  // 1. Group A~L에 속한 teamApiId → groupName 매핑
  const teamToGroup = new Map<number, string>()
  for (const group of groups) {
    if (!/^Group [A-L]$/.test(group.groupName)) continue
    for (const s of group.standings) {
      if (s.teamApiId != null) teamToGroup.set(s.teamApiId, group.groupName)
    }
  }

  // 2. Group Stage 팀들(3위 팀)
  const groupStage = groups.find((g) => g.groupName === 'Group Stage')
  if (!groupStage) return groups

  const groupStageIds = new Set(groupStage.standings.map((s) => s.teamApiId))

  // 3. 경기 데이터로 Group Stage 팀 → 조 이름 매핑
  const gsTeamToGroup = new Map<number, string>()
  for (const match of matches) {
    const homeId = match.home?.teamApiId
    const awayId = match.away?.teamApiId
    if (homeId == null || awayId == null) continue

    if (groupStageIds.has(homeId) && teamToGroup.has(awayId)) {
      gsTeamToGroup.set(homeId, teamToGroup.get(awayId)!)
    }
    if (groupStageIds.has(awayId) && teamToGroup.has(homeId)) {
      gsTeamToGroup.set(awayId, teamToGroup.get(homeId)!)
    }
  }

  // 4. 각 조에 3위 팀 rank 3으로 삽입
  const enriched = groups
    .filter((g) => /^Group [A-L]$/.test(g.groupName))
    .map((group) => {
      const thirdPlace = groupStage.standings.find(
        (s) => gsTeamToGroup.get(s.teamApiId) === group.groupName
      )
      if (!thirdPlace) return group
      const withThird = [...group.standings, { ...thirdPlace, rank: 3 }]
        .sort((a, b) => a.rank - b.rank)
      return { ...group, standings: withThird }
    })

  // 5. Group Stage 섹션도 유지 (하단 비교표용)
  return [...enriched, groupStage]
}

export default async function Page() {
  let groups: StandingGroup[] = []
  let matches: MatchSummary[] = []
  try {
    ;[groups, matches] = await Promise.all([
      api.getStandings(),
      api.getMatches(),
    ])
  } catch {
    // 백엔드 미연결 시 빈 상태 표시
  }

  const enrichedGroups = enrichWithThirdPlace(groups, matches)

  return <StandingsPage groups={enrichedGroups} />
}
