'use client'

export interface PlayerStats {
  shooting: number  // 유효슈팅률
  passing:  number  // 패스정확도
  dribble:  number  // 드리블성공률
  defense:  number  // 태클+인터셉트
  physical: number  // 듀얼승률
  rating:   number  // 평점 (×10)
}

interface Props {
  stats: PlayerStats
  size?: number
}

const AXES = [
  { key: 'shooting', label: 'SHT' },
  { key: 'passing',  label: 'PAS' },
  { key: 'dribble',  label: 'DRI' },
  { key: 'defense',  label: 'DEF' },
  { key: 'physical', label: 'PHY' },
  { key: 'rating',   label: 'RTG' },
] as const

type AxisKey = typeof AXES[number]['key']

export default function RadarStatsChart({ stats, size = 200 }: Props) {
  const N       = AXES.length
  const cx      = size / 2
  const cy      = size / 2
  const R       = size * 0.34   // polygon radius
  const labelR  = size * 0.46   // label radius
  const startA  = -Math.PI / 2  // start from top

  const angleOf = (i: number) => startA + (i * 2 * Math.PI) / N

  const polar = (i: number, r: number) => ({
    x: cx + r * Math.cos(angleOf(i)),
    y: cy + r * Math.sin(angleOf(i)),
  })

  const toPath = (points: { x: number; y: number }[]) =>
    points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ') + ' Z'

  // Grid rings
  const gridLevels = [20, 40, 60, 80, 100]

  // Data polygon
  const dataPoints = AXES.map((ax, i) => {
    const val = stats[ax.key as AxisKey]
    return polar(i, (val / 100) * R)
  })

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label="선수 능력치 레이더 차트"
      role="img"
    >
      {/* Grid rings */}
      {gridLevels.map((lvl) => {
        const pts = AXES.map((_, i) => polar(i, (lvl / 100) * R))
        return (
          <path
            key={lvl}
            d={toPath(pts)}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        )
      })}

      {/* Axes lines */}
      {AXES.map((_, i) => {
        const outer = polar(i, R)
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={outer.x}
            y2={outer.y}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={1}
          />
        )
      })}

      {/* Data fill */}
      <path
        d={toPath(dataPoints)}
        fill="rgba(251,191,36,0.18)"
        stroke="#f59e0b"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />

      {/* Data dots */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="#f59e0b" />
      ))}

      {/* Labels */}
      {AXES.map((ax, i) => {
        const lp = polar(i, labelR)
        return (
          <text
            key={i}
            x={lp.x}
            y={lp.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={9}
            fontWeight="700"
            fill="rgba(255,255,255,0.6)"
            letterSpacing="0.05em"
          >
            {ax.label}
          </text>
        )
      })}
    </svg>
  )
}
