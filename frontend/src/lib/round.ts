/**
 * 토너먼트 라운드 판별·표기 유틸 (홈·티커·경기목록 공용)
 *
 * API-Football의 `round` 문자열 예시:
 *   "Group Stage - 1", "Round of 32", "Round of 16",
 *   "Quarter-finals", "Semi-finals", "3rd Place Final", "Final"
 */
import type { MatchSummary } from '@/types'
import { isFinished } from '@/lib/matchStatus'

/** 토너먼트 라운드 진행 순서 (이른 라운드 → 결승) */
export const ROUND_PRIORITY = [
  'Round of 32',
  'Round of 16',
  'Quarter-finals',
  'Semi-finals',
  '3rd Place',
  'Final',
] as const

/** 해당 round 문자열이 토너먼트(조별리그 아님) 라운드인지 */
export function isKnockoutRound(round: string | null | undefined): boolean {
  if (!round) return false
  return (
    round.includes('Round of') ||
    round.includes('Quarter') ||
    round.includes('Semi') ||
    (round.includes('Final') && !round.includes('Group'))
  )
}

/** 경기 목록에 토너먼트 경기가 하나라도 있으면 true */
export function isKnockoutPhase(matches: MatchSummary[]): boolean {
  return matches.some((m) => isKnockoutRound(m.round))
}

/** 라운드 한글 표기 */
export function getRoundLabel(round: string): string {
  if (round.includes('Round of 32')) return '32강'
  if (round.includes('Round of 16')) return '16강'
  if (round.includes('Quarter')) return '8강'
  if (round.includes('Semi')) return '4강'
  if (round.includes('3rd')) return '3·4위전'
  if (round.includes('Final')) return '결승'
  return round
}

/** ROUND_PRIORITY 내 순서. 조별리그 등은 -1 */
export function roundOrder(round: string | null | undefined): number {
  if (!round) return -1
  for (let i = ROUND_PRIORITY.length - 1; i >= 0; i--) {
    if (round.includes(ROUND_PRIORITY[i])) return i
  }
  return -1
}

/** 결승전(3·4위전 제외) 경기 */
export function findFinalMatch(matches: MatchSummary[]): MatchSummary | null {
  const finals = matches.filter(
    (m) => m.round?.includes('Final') && !m.round.includes('3rd') && !m.round.includes('Group'),
  )
  return finals[0] ?? null
}

export interface TournamentResult {
  final: MatchSummary
  /** 승자를 스코어로 판별하지 못한 경우(승부차기 등) null */
  champion: { name: string | null; logo: string | null; goals: number | null } | null
  runnerUp: { name: string | null; logo: string | null; goals: number | null } | null
  /** 정규시간에 승부가 나지 않아 승자 판별 불가 */
  undecidedByScore: boolean
}

/**
 * 종료된 결승전에서 우승/준우승을 판별한다.
 *
 * 주의: Match 엔티티가 승부차기 스코어를 저장하지 않으므로,
 * 양 팀 득점이 같으면(PEN 종료) 승자를 판별할 수 없다.
 * 이 경우 undecidedByScore=true 로 반환하고 호출부에서 문구를 달리 처리한다.
 */
export function getTournamentResult(matches: MatchSummary[]): TournamentResult | null {
  const final = findFinalMatch(matches)
  if (!final || !isFinished(final.statusShort)) return null

  const home = { name: final.home.name, logo: final.home.logo, goals: final.home.goals }
  const away = { name: final.away.name, logo: final.away.logo, goals: final.away.goals }
  const hg = home.goals ?? 0
  const ag = away.goals ?? 0

  if (hg === ag) {
    return { final, champion: null, runnerUp: null, undecidedByScore: true }
  }
  return hg > ag
    ? { final, champion: home, runnerUp: away, undecidedByScore: false }
    : { final, champion: away, runnerUp: home, undecidedByScore: false }
}

/** 토너먼트 경기를 라운드 순서대로 그룹핑 (종료된 경기만) */
export function groupFinishedByRound(
  matches: MatchSummary[],
): { round: string; label: string; matches: MatchSummary[] }[] {
  const ko = matches.filter((m) => isKnockoutRound(m.round) && isFinished(m.statusShort))
  const byRound = new Map<string, MatchSummary[]>()

  for (const m of ko) {
    const key = ROUND_PRIORITY.find((r) => m.round!.includes(r)) ?? m.round!
    if (!byRound.has(key)) byRound.set(key, [])
    byRound.get(key)!.push(m)
  }

  return [...byRound.entries()]
    .sort((a, b) => roundOrder(b[0]) - roundOrder(a[0])) // 결승이 위로
    .map(([round, list]) => ({
      round,
      label: getRoundLabel(round),
      matches: list.sort((x, y) => (x.matchDate ?? '').localeCompare(y.matchDate ?? '')),
    }))
}

/** 종료된 경기를 최신순으로 N개 */
export function recentFinished(matches: MatchSummary[], limit = 8): MatchSummary[] {
  return matches
    .filter((m) => isFinished(m.statusShort) && m.matchDate)
    .sort((a, b) => (b.matchDate ?? '').localeCompare(a.matchDate ?? ''))
    .slice(0, limit)
}
