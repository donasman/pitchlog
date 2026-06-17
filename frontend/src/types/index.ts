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
  lineups: number | null
  minutes: number | null
  goals: number | null
  assists: number | null
  saves: number | null
  yellowCards: number | null
  redCards: number | null
  rating: number | null
  passesTotal: number | null
  passesAccuracy: number | null  // 정수 퍼센트 (예: 85)
  shotsTotal: number | null
  shotsOn: number | null
  dribblesAttempts: number | null
  dribblesSuccess: number | null
  tacklesTotal: number | null
  interceptions: number | null
  duelsTotal: number | null
  duelsWon: number | null
  foulsCommitted: number | null
  foulsDrawn: number | null
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
  yellowCards: number | null
  redCards: number | null
}

// ── Coach types ──────────────────────────────────────────────────────────────

export interface Coach {
  coachApiId: number | null
  teamApiId: number | null
  teamName: string | null
  teamLogo: string | null
  name: string
  firstName: string | null
  lastName: string | null
  nationality: string | null
  birthDate: string | null
  photoUrl: string | null
}

// ── Injury types ─────────────────────────────────────────────────────────────

export interface PlayerInjury {
  playerApiId: number
  playerName: string
  playerPhoto: string | null
  teamApiId: number | null
  teamName: string | null
  teamLogo: string | null
  fixtureId: number | null
  fixtureDate: string | null   // ISO string
  injuryType: string | null    // "Knee Injury" | "Suspension"
  reason: string | null
  isSuspension: boolean
}

// ── Standings types ──────────────────────────────────────────────────────────

export interface StandingEntry {
  rank: number
  teamApiId: number
  teamName: string
  teamLogo: string | null
  played: number | null
  win: number | null
  draw: number | null
  lose: number | null
  goalsFor: number | null
  goalsAgainst: number | null
  goalsDiff: number | null
  points: number | null
  form: string | null       // "WWDLW"
  description: string | null
}

export interface StandingGroup {
  groupName: string         // "Group A"
  standings: StandingEntry[]
}

// ── H2H types ────────────────────────────────────────────────────────────────

export interface H2HRecord {
  fixtureId: number
  homeTeamApiId: number | null
  homeTeamName: string | null
  homeTeamLogo: string | null
  awayTeamApiId: number | null
  awayTeamName: string | null
  awayTeamLogo: string | null
  homeGoals: number | null
  awayGoals: number | null
  matchDate: string | null   // ISO string
  statusShort: string | null
  leagueName: string | null
}

// ── Prediction types ──────────────────────────────────────────────────────────

export interface FixturePrediction {
  fixtureId: number
  winnerTeam: string | null
  winnerComment: string | null
  homeWinPct: string | null   // "55%"
  drawPct: string | null
  awayWinPct: string | null
  goalsHome: string | null
  goalsAway: string | null
  advice: string | null
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
  rating: number | null
  minutesPlayed: number | null
  goalsScored: number | null
  assistsMade: number | null
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
