import type { Country, SquadResponse, PlayerDetail, StatsRanking, MatchSummary, MatchDetail } from '@/types'
import { API_BASE } from './config'

const BASE_URL = API_BASE

async function fetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${path}`)
  }
  return res.json() as Promise<T>
}

export const api = {
  getCountries: (): Promise<Country[]> =>
    fetcher('/api/countries'),

  getSquad: (countryCode: string): Promise<SquadResponse> =>
    fetcher(`/api/countries/${countryCode}/squad`),

  getPlayer: (id: number): Promise<PlayerDetail> =>
    fetcher(`/api/players/${id}`),

  getTopScorers: (limit = 20): Promise<StatsRanking[]> =>
    fetcher(`/api/players/top-scorers?limit=${limit}`),

  getTopAssists: (limit = 20): Promise<StatsRanking[]> =>
    fetcher(`/api/players/top-assists?limit=${limit}`),

  getMatches: (): Promise<MatchSummary[]> =>
    fetcher('/api/matches'),

  getMatch: (fixtureId: number): Promise<MatchDetail> =>
    fetcher(`/api/matches/${fixtureId}`),
}
