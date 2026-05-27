export interface Country {
  id: number
  code: string
  name: string
  flagUrl: string | null
  groupName: string | null
}

export interface SquadPlayer {
  id: number
  name: string
  photoUrl: string | null
  position: 'GK' | 'DEF' | 'MID' | 'FWD' | null
  jerseyNumber: number | null
  nationality: string | null
  birthDate: string | null
}

export interface SquadResponse {
  country: Country
  players: SquadPlayer[]
}

export interface SeasonStats {
  seasonYear: number
  teamName: string | null
  leagueName: string | null
  appearances: number | null
  goals: number | null
  assists: number | null
  yellowCards: number | null
  redCards: number | null
  rating: number | null
}

export interface PlayerDetail {
  id: number
  name: string
  firstName: string | null
  lastName: string | null
  nationality: string | null
  birthDate: string | null
  height: string | null
  weight: string | null
  photoUrl: string | null
  stats: SeasonStats[]
}

export interface StatsRanking {
  playerId: number
  playerName: string
  photoUrl: string | null
  nationality: string | null
  teamName: string | null
  goals: number | null
  assists: number | null
  appearances: number | null
}

// ── Match types ──────────────────────────────────────────────────────────────

export interface MatchTeam {
  teamApiId: number | null
  name: string | null
  logo: string | null
  goals: number | null
}

export interface MatchSummary {
  fixtureId: number
  round: string | null
  groupName: string | null
  matchDate: string | null   // ISO string
  venueName: string | null
  venueCity: string | null
  statusShort: string | null // "NS" | "1H" | "HT" | "2H" | "FT" | "AET" | "PEN" ...
  statusLong: string | null
  elapsed: number | null
  home: MatchTeam
  away: MatchTeam
  hasLineup: boolean
}

export interface LineupPlayer {
  playerApiId: number
  name: string
  number: number | null
  pos: string | null   // "G" | "D" | "M" | "F"
  grid: string | null  // "1:1", "2:3" etc.
}

export interface LineupTeam {
  teamApiId: number
  teamName: string
  formation: string | null
  startXI: LineupPlayer[]
  substitutes: LineupPlayer[]
}

export interface MatchDetail extends MatchSummary {
  lineups: LineupTeam[]
}
