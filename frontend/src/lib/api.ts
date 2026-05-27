import type { Country, SquadResponse, PlayerDetail, StatsRanking, MatchSummary, MatchDetail } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.pitchlog.com'

async function fetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    next: { revalidate: 3600 }, // ISR: 1시간
  })
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${path}`)
  }
  return res.json() as Promise<T>
}

export const api = {
  /** 전체 참가국 목록 */
  getCountries: (): Promise<Country[]> =>
    fetcher('/api/countries'),

  /** 국가별 스쿼드 */
  getSquad: (countryCode: string): Promise<SquadResponse> =>
    fetcher(`/api/countries/${countryCode}/squad`),

  /** 선수 상세 */
  getPlayer: (id: number): Promise<PlayerDetail> =>
    fetcher(`/api/players/${id}`),

  /** 득점 순위 */
  getTopScorers: (limit = 20): Promise<StatsRanking[]> =>
    fetcher(`/api/players/top-scorers?limit=${limit}`),

  /** 도움 순위 */
  getTopAssists: (limit = 20): Promise<StatsRanking[]> =>
    fetcher(`/api/players/top-assists?limit=${limit}`),

  /** 전체 경기 목록 */
  getMatches: (): Promise<MatchSummary[]> =>
    fetcher('/api/matches'),

  /** 경기 상세 + 라인업 */
  getMatch: (fixtureId: number): Promise<MatchDetail> =>
    fetcher(`/api/matches/${fixtureId}`),
}
