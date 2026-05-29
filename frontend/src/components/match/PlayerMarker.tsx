'use client'

import type { LineupPlayer } from '@/types'

export const POS_COLOR: Record<string, string> = {
  G: '#f59e0b',  // gold  — GK
  D: '#3b82f6',  // blue  — DEF
  M: '#22c55e',  // green — MID
  F: '#ef4444',  // red   — FWD
}

export const POS_LABEL: Record<string, string> = {
  G: 'GK', D: 'DEF', M: 'MID', F: 'FWD',
}

interface Props {
  player: LineupPlayer & { x: number; y: number }
  isSelected: boolean
  onClick: (player: LineupPlayer) => void
}

/**
 * 필드 위 선수 마커 — SVG <g> 요소.
 * 부모 SVG 안에서 사용해야 합니다.
 */
export default function PlayerMarker({ player, isSelected, onClick }: Props) {
  const color = POS_COLOR[player.pos ?? ''] ?? '#94a3b8'
  const R = 15
  const lastName = player.name.split(' ').pop() ?? player.name

  return (
    <g
      transform={`translate(${player.x.toFixed(1)}, ${player.y.toFixed(1)})`}
      onClick={() => onClick(player)}
      onKeyDown={(e) => e.key === 'Enter' && onClick(player)}
      tabIndex={0}
      role="button"
      aria-label={`${player.name} #${player.number ?? '?'}, ${POS_LABEL[player.pos ?? ''] ?? player.pos}`}
      aria-pressed={isSelected}
      style={{ cursor: 'pointer', outline: 'none' }}
    >
      {/* 선택 강조 글로우 */}
      {isSelected && (
        <>
          <circle r={R + 7} fill={color} opacity={0.2} />
          <circle r={R + 4} fill="none" stroke="#fff" strokeWidth={2} opacity={0.9} />
        </>
      )}

      {/* 호버 링 (CSS로 처리) */}
      <circle
        r={R + 3}
        fill={color}
        opacity={isSelected ? 0.25 : 0}
        className="transition-opacity duration-200 group-hover:opacity-20"
      />

      {/* 메인 원 */}
      <circle
        r={R}
        fill={color}
        stroke={isSelected ? '#ffffff' : 'rgba(255,255,255,0.35)'}
        strokeWidth={isSelected ? 2.5 : 1.5}
        className="transition-all duration-200"
      />

      {/* 등번호 */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        y={-1}
        fontSize={10}
        fontWeight="800"
        fill="#fff"
        style={{ userSelect: 'none', pointerEvents: 'none' }}
      >
        {player.number ?? '?'}
      </text>

      {/* 이름 (성만 표시) */}
      <text
        y={R + 10}
        textAnchor="middle"
        fontSize={8.5}
        fontWeight="700"
        fill="rgba(255,255,255,0.95)"
        stroke="rgba(0,0,0,0.7)"
        strokeWidth={2.5}
        paintOrder="stroke"
        style={{ userSelect: 'none', pointerEvents: 'none' }}
      >
        {lastName.length > 9 ? lastName.slice(0, 8) + '.' : lastName}
      </text>
    </g>
  )
}
