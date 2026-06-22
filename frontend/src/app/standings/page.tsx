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
 * Group Stage 팀이 이미 조가 확인된 팀과 같은 경기에 출전했다면
 * 그 팀도 같은 조에 속한다.
 */
function enrichWithThirdPlace(
  groups: StandingGroup[],
  matches: MatchSummary[]
): StandingGroup[] {
  // 1. Group A-L 팀 → 조 이름 매핑 구축
  const teamToGroup = new Map<number, string>()
  for (const group of groups) {
    if (!/^Group [A-L]$/.test(group.groupName)) continue
    for (const s of group.standings) {
      if (s.teamApiId != null) teamToGroup.set(s.teamApiId, group.groupName)
    }
  }

  // 2. Group Stage(3위 종합) 팀 목록
  const groupStage = groups.find((g) => g.groupName === 'Group Stage')
  if (!groupStage || groupStage.standings.length === 0) return groups

  const groupStageIds = new Set(
    groupStage.standings.map((s) => s.teamApiId).filter((id): id is number => id != null)
  )

  // 3. 경기 데이터로 Group Stage 팀의 실제 조 추론
  const gsTeamToGroup = new Map<number, string>()
  for (const match of matches) {
    const homeId = match.home?.teamApiId
    const awayId = match.away?.teamApiId
    if (homeId == null || awayId == null) continue

    if (groupStageIds.has(homeId) && teamToGroup.has(awayId) && !gsTeamToGroup.has(homeId)) {
      gsTeamToGroup.set(homeId, teamToGroup.get(awayId)!)
    }
    if (groupStageIds.has(awayId) && teamToGroup.has(homeId) && !gsTeamToGroup.has(awayId)) {
      gsTeamToGroup.set(awayId, teamToGroup.get(homeId)!)
    }
  }

  // 4. 각 조에 해당 3위 팀 삽입 (rank 3 위치에)
  const enriched = groups
    .filter((g) => g.groupName !== 'Group Stage')
    .map((group) => {
      // 이 조에 속하는 Group Stage 팀 찾기
      const thirdPlaceEntry = groupStage.standings.find((s) => {
        if (s.teamApiId == null) return false
        return gsTeamToGroup.get(s.teamApiId) === group.groupName
      })

      if (!thirdPlaceEntry) return group

      // rank 2 다음에 삽입
      const standings = [...group.standings]
      const insertIdx = standings.findIndex((s) => s.rank >= 3)
      if (insertIdx === -1) {
        standings.push({ ...thirdPlaceEntry, rank: 3 })
      } else {
        standings.splice(insertIdx, 0, { ...thirdPlaceEntry, rank: 3 })
      }
      return { ...group, standings }
    })

  // Group Stage(3위 종합)는 맨 뒤에 유지
  enriched.push(groupStage)

  return enriched
}

export default async function StandingsPageRoute() {
  let groups: StandingGroup[] = []
  let matches: MatchSummary[] = []

  await Promise.allSettled([
    api.getStandings().then((d) => { groups = d }),
    api.getMatches().then((d) => { matches = d }),
  ])

  const enriched = enrichWithThirdPlace(groups, matches)

  return <StandingsPage groups={enriched} />
}
