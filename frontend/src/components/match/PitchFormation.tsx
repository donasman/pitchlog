'use client'

import { useState } from 'react'
import type { LineupPlayer, LineupTeam } from '@/types'

interface Props {
  home: LineupTeam
  away: LineupTeam
}

// API-Football grid: "row:col" (row 1 = GK, higher row = forward)
function parseGrid(grid: string | null): { row: number; col: number } | null {
  if (!grid) return null
  const parts = grid.split(':')
  if (parts.length !== 2) return null
  return { row: parseInt(parts[0], 10), col: parseInt(parts[1], 10) }
}

// 각 팀의 행별 플레이어 배치를 계산 → SVG 좌표 반환
function computePositions(
  players: LineupPlayer[],
  pitchW: number,
  halfH: number,
  offsetY: number,
  invertY: boolean
): Array<LineupPlayer & { x: number; y: number }> {
  // 행별로 묶기
  const byRow = new Map<number, LineupPlayer[]>()
  for (const p of players) {
    const g = parseGrid(p.grid)
    if (!g) continue
    const list = byRow.get(g.row) ?? []
    list.push(p)
    byRow.set(g.row, list)
  }

  const maxRow = Math.max(...Array.from(byRow.keys()), 1)
  const rowSlot = halfH / (maxRow + 1)   // 행 간격

  const result: Array<LineupPlayer & { x: number; y: number }> = []

  for (const p of players) {
    const g = parseGrid(p.grid)
    if (!g) continue

    const rowPlayers = byRow.get(g.row) ?? []
    const maxCol = rowPlayers.length
    const colSlot = pitchW / (maxCol + 1)

    // 같은 행의 col 순서로 정렬 후 인덱스 계산
    const sortedCols = rowPlayers
      .map((rp) => parseGrid(rp.grid)?.col ?? 1)
      .sort((a, b) => a - b)
    const colIdx = sortedCols.indexOf(g.col) + 1  // 1-indexed

    const rawY = g.row * rowSlot
    const y = invertY
      ? offsetY + halfH - rawY   // away: 위에서 내려옴
      : offsetY + halfH - rawY   // home: 아래에서 올라감 (offsetY = halfH)

    result.push({ ...p, x: colIdx * colSlot, y })
  }

  return result
}

const POS_COLOR: Record<string, string> = {
  G: '#f59e0b',   // gold - GK
  D: '#3b82f6',   // blue - DEF
  M: '#22c55e',   // green - MID
  F: '#ef4444',   // red - FWD
}

function PlayerDot({
  player,
  highlighted,
  onHover,
}: {
  player: LineupPlayer & { x: number; y: number }
  highlighted: boolean
  onHover: (p: LineupPlayer | null) => void
}) {
  const color = POS_COLOR[player.pos ?? ''] ?? '#94a3b8'
  const r = 14

  return (
    <g
      transform={`translate(${player.x}, ${player.y})`}
      onMouseEnter={() => onHover(player)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: 'pointer' }}
    >
      <circle r={r + 2} fill={color} opacity={0.15} />
      <circle
        r={r}
        fill={color}
        stroke={highlighted ? '#fff' : 'rgba(255,255,255,0.4)'}
        strokeWidth={highlighted ? 2.5 : 1.5}
      />
      {/* 등번호 */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={10}
        fontWeight="bold"
        fill="#fff"
      >
        {player.number ?? '?'}
      </text>
      {/* 이름 (아래) */}
      <text
        y={r + 9}
        textAnchor="middle"
        fontSize={8.5}
        fill="rgba(255,255,255,0.9)"
        stroke="rgba(0,0,0,0.6)"
        strokeWidth={2.5}
        paintOrder="stroke"
        fontWeight="600"
      >
        {player.name.split(' ').pop()}
      </text>
    </g>
  )
}

export default function PitchFormation({ home, away }: Props) {
  const [hovered, setHovered] = useState<LineupPlayer | null>(null)

  const W = 380
  const H = 560
  const halfH = H / 2
  const PAD = 30   // 골라인 패딩

  // Home: 아래 절반 (y: halfH → H), GK row1 → 아래쪽
  const homePlayers = computePositions(home.startXI, W, halfH - PAD, halfH + PAD, false)
  // Away: 위 절반 (y: 0 → halfH), GK row1 → 위쪽 (반전)
  const awayPlayers = computePositions(away.startXI, W, halfH - PAD, PAD, true)

  return (
    <div className="space-y-3">
      {/* 포메이션 레이블 */}
      <div className="flex justify-between text-xs font-semibold px-1">
        <span className="text-primary">{home.teamName} <span className="text-muted-foreground font-normal">{home.formation}</span></span>
        <span className="text-right text-primary">{away.teamName} <span className="text-muted-foreground font-normal">{away.formation}</span></span>
      </div>

      {/* SVG 피치 */}
      <div className="rounded-xl overflow-hidden border border-border">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: 'block', maxHeight: 580 }}
        >
          {/* 피치 배경 */}
          <rect width={W} height={H} fill="#1a6b30" rx={8} />

          {/* 잔디 줄무늬 */}
          {Array.from({ length: 8 }).map((_, i) => (
            <rect
              key={i}
              x={0} y={i * (H / 8)} width={W} height={H / 16}
              fill="rgba(0,0,0,0.06)"
            />
          ))}

          {/* 터치라인 */}
          <rect x={10} y={10} width={W - 20} height={H - 20}
                fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />

          {/* 센터라인 */}
          <line x1={10} y1={H / 2} x2={W - 10} y2={H / 2}
                stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />

          {/* 센터 서클 */}
          <circle cx={W / 2} cy={H / 2} r={50}
                  fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
          <circle cx={W / 2} cy={H / 2} r={3} fill="rgba(255,255,255,0.7)" />

          {/* 홈 페널티 박스 (아래) */}
          <rect x={W / 2 - 90} y={H - 10 - 110}
                width={180} height={110}
                fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={1.5} />
          {/* 홈 골에어리어 */}
          <rect x={W / 2 - 40} y={H - 10 - 45}
                width={80} height={45}
                fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1} />
          {/* 홈 골대 */}
          <rect x={W / 2 - 28} y={H - 12}
                width={56} height={6}
                fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={2} />

          {/* 어웨이 페널티 박스 (위) */}
          <rect x={W / 2 - 90} y={10}
                width={180} height={110}
                fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={1.5} />
          {/* 어웨이 골에어리어 */}
          <rect x={W / 2 - 40} y={10}
                width={80} height={45}
                fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1} />
          {/* 어웨이 골대 */}
          <rect x={W / 2 - 28} y={6}
                width={56} height={6}
                fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={2} />

          {/* 선수들 */}
          {homePlayers.map((p) => (
            <PlayerDot
              key={`home-${p.playerApiId}`}
              player={p}
              highlighted={hovered?.playerApiId === p.playerApiId}
              onHover={setHovered}
            />
          ))}
          {awayPlayers.map((p) => (
            <PlayerDot
              key={`away-${p.playerApiId}`}
              player={p}
              highlighted={hovered?.playerApiId === p.playerApiId}
              onHover={setHovered}
            />
          ))}

          {/* 팀 라벨 */}
          <text x={W / 2} y={H - 18} textAnchor="middle"
                fontSize={9} fill="rgba(255,255,255,0.5)" fontWeight="600">
            {home.teamName?.toUpperCase()}
          </text>
          <text x={W / 2} y={22} textAnchor="middle"
                fontSize={9} fill="rgba(255,255,255,0.5)" fontWeight="600">
            {away.teamName?.toUpperCase()}
          </text>
        </svg>
      </div>

      {/* 범례 */}
      <div className="flex flex-wrap gap-3 justify-center text-xs text-muted-foreground px-1">
        {Object.entries(POS_COLOR).map(([pos, color]) => (
          <span key={pos} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: color }} />
            {pos === 'G' ? 'GK' : pos === 'D' ? 'DEF' : pos === 'M' ? 'MID' : 'FWD'}
          </span>
        ))}
      </div>

      {/* 호버 선수 정보 */}
      {hovered && (
        <div className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-center transition-all">
          <span className="font-bold">{hovered.name}</span>
          <span className="text-muted-foreground ml-2">
            #{hovered.number} &middot;{' '}
            {hovered.pos === 'G' ? 'GK' : hovered.pos === 'D' ? 'DEF' : hovered.pos === 'M' ? 'MID' : 'FWD'}
          </span>
        </div>
      )}
    </div>
  )
}
