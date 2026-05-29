'use client'

import type { LineupPlayer, LineupTeam } from '@/types'
import PlayerMarker from './PlayerMarker'

// ── SVG 치수 ───────────────────────────────────────────────────────
const W    = 400
const H    = 580
const HALF = H / 2
const PAD  = 32   // 각 하프 안쪽 여백

// ── API-Football grid 문자열 파싱 ("row:col") ──────────────────────
function parseGrid(grid: string | null | undefined): { row: number; col: number } | null {
  if (!grid) return null
  const [r, c] = grid.split(':').map(Number)
  if (isNaN(r) || isNaN(c)) return null
  return { row: r, col: c }
}

// ── grid 데이터 없을 때 쓸 4-3-3 폴백 테이블 ──────────────────────
// row 1 = 자기 골문 쪽 (GK), row N = 공격진
const FALLBACK: Array<{ row: number; col: number }> = [
  { row: 1, col: 1 },                                           // 0: GK
  { row: 2, col: 1 }, { row: 2, col: 2 },                      // 1-2: CB
  { row: 2, col: 3 }, { row: 2, col: 4 },                      // 3-4: FB
  { row: 3, col: 1 }, { row: 3, col: 2 }, { row: 3, col: 3 }, // 5-7: MID
  { row: 4, col: 1 }, { row: 4, col: 2 }, { row: 4, col: 3 }, // 8-10: FWD
]

// ── 좌표 계산 ─────────────────────────────────────────────────────
/**
 * 선수 배열 → SVG x/y 좌표 배열 변환
 *
 * @param players  선수 목록
 * @param pitchW   필드 너비 (px)
 * @param pitchH   하프 필드 높이 (px)
 * @param offsetY  하프 필드 상단 y 오프셋
 * @param invert   true = away팀 (GK가 위쪽)
 */
function computePositions(
  players: LineupPlayer[],
  pitchW: number,
  pitchH: number,
  offsetY: number,
  invert: boolean,
): Array<LineupPlayer & { x: number; y: number }> {
  if (players.length === 0) return []

  // grid 데이터가 하나라도 있으면 grid 모드, 없으면 폴백 모드
  const useGrid = players.some((p) => !!parseGrid(p.grid))

  // 각 선수에게 { row, col } 할당
  const assigned = players.map((p, i) => ({
    player: p,
    g: useGrid ? (parseGrid(p.grid) ?? FALLBACK[i] ?? { row: 1, col: 1 }) : (FALLBACK[i] ?? { row: 1, col: 1 }),
  }))

  // row별 그룹화 & col 오름차순 정렬
  const byRow = new Map<number, typeof assigned>()
  for (const item of assigned) {
    const list = byRow.get(item.g.row) ?? []
    list.push(item)
    byRow.set(item.g.row, list)
  }
  for (const list of byRow.values()) {
    list.sort((a, b) => a.g.col - b.g.col)
  }

  const maxRow = Math.max(...Array.from(byRow.keys()), 1)
  const rowSlot = pitchH / (maxRow + 1)

  return assigned.map(({ player, g }) => {
    const rowItems = byRow.get(g.row)!
    const posInRow = rowItems.findIndex((it) => it.player === player) + 1 // 1-indexed
    const colSlot  = pitchW / (rowItems.length + 1)

    const rawY = g.row * rowSlot
    const y = invert
      ? offsetY + rawY           // away: GK 위쪽
      : offsetY + pitchH - rawY  // home: GK 아래쪽

    return { ...player, x: posInRow * colSlot, y }
  })
}

// ── Props ──────────────────────────────────────────────────────────
interface Props {
  home: LineupTeam
  away: LineupTeam
  selectedPlayer: LineupPlayer | null
  onSelectPlayer: (player: LineupPlayer, isHome: boolean) => void
}

// ── 필드 마킹 치수 ──────────────────────────────────────────────────
const PEN_W  = 180
const PEN_H  = 112
const GA_W   = 80
const GA_H   = 46
const GOAL_W = 56
const GOAL_H = 7

export default function FootballField({
  home, away, selectedPlayer, onSelectPlayer,
}: Props) {
  const halfH = HALF - PAD

  const homePlayers = computePositions(home.startXI, W, halfH, HALF + PAD, false)
  const awayPlayers = computePositions(away.startXI, W, halfH, PAD, true)

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: 'block' }}
        aria-label="축구 경기장 선발 라인업"
        role="img"
      >
        {/* ── 잔디 줄무늬 ── */}
        <defs>
          <pattern id="pitch-stripes" x="0" y="0" width={W} height={H / 9} patternUnits="userSpaceOnUse">
            <rect width={W} height={H / 9}  fill="#1a5c2a" />
            <rect width={W} height={H / 18} fill="#1d6830" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#pitch-stripes)" rx={10} />

        {/* ── 외곽 터치라인 ── */}
        <rect x={10} y={10} width={W - 20} height={H - 20}
          fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={1.8} rx={2} />

        {/* ── 센터라인 ── */}
        <line x1={10} y1={HALF} x2={W - 10} y2={HALF}
          stroke="rgba(255,255,255,0.55)" strokeWidth={1.8} />

        {/* ── 센터서클 + 스팟 ── */}
        <circle cx={W / 2} cy={HALF} r={52}
          fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={1.8} />
        <circle cx={W / 2} cy={HALF} r={3} fill="rgba(255,255,255,0.8)" />

        {/* ── 홈 페널티 박스 (하단) ── */}
        <rect x={(W - PEN_W) / 2} y={H - 10 - PEN_H} width={PEN_W} height={PEN_H}
          fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.45)" strokeWidth={1.5} />
        <rect x={(W - GA_W) / 2} y={H - 10 - GA_H} width={GA_W} height={GA_H}
          fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
        <rect x={(W - GOAL_W) / 2} y={H - 12} width={GOAL_W} height={GOAL_H}
          fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.7)" strokeWidth={2} />
        <circle cx={W / 2} cy={H - 10 - 75} r={2.5} fill="rgba(255,255,255,0.55)" />

        {/* ── 어웨이 페널티 박스 (상단) ── */}
        <rect x={(W - PEN_W) / 2} y={10} width={PEN_W} height={PEN_H}
          fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.45)" strokeWidth={1.5} />
        <rect x={(W - GA_W) / 2} y={10} width={GA_W} height={GA_H}
          fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
        <rect x={(W - GOAL_W) / 2} y={5} width={GOAL_W} height={GOAL_H}
          fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.7)" strokeWidth={2} />
        <circle cx={W / 2} cy={10 + 75} r={2.5} fill="rgba(255,255,255,0.55)" />

        {/* ── 팀 라벨 ── */}
        <text x={W / 2} y={H - 16} textAnchor="middle"
          fontSize={8.5} fontWeight="700" fill="rgba(255,255,255,0.4)" letterSpacing="0.1em">
          {home.teamName?.toUpperCase()}
        </text>
        <text x={W / 2} y={23} textAnchor="middle"
          fontSize={8.5} fontWeight="700" fill="rgba(255,255,255,0.4)" letterSpacing="0.1em">
          {away.teamName?.toUpperCase()}
        </text>

        {/* ── 선수 마커 ── */}
        {homePlayers.map((p) => (
          <PlayerMarker
            key={`home-${p.playerApiId}`}
            player={p}
            isSelected={selectedPlayer?.playerApiId === p.playerApiId}
            onClick={(pl) => onSelectPlayer(pl, true)}
          />
        ))}
        {awayPlayers.map((p) => (
          <PlayerMarker
            key={`away-${p.playerApiId}`}
            player={p}
            isSelected={selectedPlayer?.playerApiId === p.playerApiId}
            onClick={(pl) => onSelectPlayer(pl, false)}
          />
        ))}
      </svg>
    </div>
  )
}
