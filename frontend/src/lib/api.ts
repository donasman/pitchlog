import type { Country, SquadResponse, PlayerDetail, StatsRanking, MatchSummary, MatchDetail, StandingGroup, PlayerInjury, Coach, FixturePrediction, H2HRecord } from '@/types'
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

  getTopYellowCards: (limit = 20): Promise<StatsRanking[]> =>
    fetcher(`/api/players/top-yellowcards?limit=${limit}`),

  getTopRedCards: (limit = 20): Promise<StatsRanking[]> =>
    fetcher(`/api/players/top-redcards?limit=${limit}`),

  getMatches: (): Promise<MatchSummary[]> =>
    fetcher('/api/matches'),

  getMatch: (fixtureId: number): Promise<MatchDetail> =>
    fetcher(`/api/matches/${fixtureId}`),

  getStandings: (): Promise<StandingGroup[]> =>
    fetcher('/api/standings'),

  getStandingGroup: (group: string): Promise<StandingGroup> =>
    fetcher(`/api/standings/${group}`),

  getInjuries: (): Promise<PlayerInjury[]> =>
    fetcher('/api/injuries'),

  getInjuriesByTeam: (teamApiId: number): Promise<PlayerInjury[]> =>
    fetcher(`/api/injuries?team=${teamApiId}`),

  getPlayerInjuries: (playerApiId: number): Promise<PlayerInjury[]> =>
    fetcher(`/api/injuries/player/${playerApiId}`),

  getCoaches: (): Promise<Coach[]> =>
    fetcher('/api/coaches'),

  getCoachByCountry: (countryCode: string): Promise<Coach> =>
    fetcher(`/api/coaches/${countryCode.toLowerCase()}`),

  getPrediction: (fixtureId: number): Promise<FixturePrediction> =>
    fetcher(`/api/predictions/${fixtureId}`),

  getH2H: (team1: number, team2: number): Promise<H2HRecord[]> =>
    fetcher(`/api/h2h/${team1}/${team2}`),

}
