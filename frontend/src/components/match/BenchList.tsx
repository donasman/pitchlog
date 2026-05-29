'use client'

import { cn } from '@/lib/utils'
import type { LineupPlayer, LineupTeam } from '@/types'
import { POS_COLOR, POS_LABEL } from './PlayerMarker'

interface Props {
  home: LineupTeam
  away: LineupTeam
  selectedPlayer: LineupPlayer | null
  onSelectPlayer: (player: LineupPlayer, isHome: boolean) => void
}

interface BenchPlayerRowProps {
  player: LineupPlayer
  isSelected: boolean
  isHome: boolean
  onClick: () => void
}

function BenchPlayerRow({ player, isSelected, isHome: _isHome, onClick }: BenchPlayerRowProps) {
  const color = POS_COLOR[player.pos ?? ''] ?? '#94a3b8'
  const label = POS_LABEL[player.pos ?? ''] ?? player.pos ?? '?'

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150',
        'hover:bg-white/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary',
        isSelected && 'bg-white/10 ring-1 ring-primary/60',
      )}
      aria-pressed={isSelected}
    >
      {/* 등번호 */}
      <span className="w-6 text-right text-xs font-mono text-muted-foreground flex-shrink-0">
        {player.number ?? '-'}
      </span>

      {/* 포지션 도트 */}
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />

      {/* 이름 */}
      <span className={cn('text-sm truncate flex-1', isSelected && 'text-primary font-semibold')}>
        {player.name}
      </span>

      {/* 포지션 뱃지 */}
      <span
        className="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
        style={{ color, backgroundColor: `${color}22` }}
      >
        {label}
      </span>
    </button>
  )
}

export default function BenchList({ home, away, selectedPlayer, onSelectPlayer }: Props) {
  const hasHomeSubs = home.substitutes.length > 0
  const hasAwaySubs = away.substitutes.length > 0

  if (!hasHomeSubs && !hasAwaySubs) return null

  return (
    <div className="mt-4 rounded-xl border border-border bg-card overflow-hidden">
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Substitutes
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {/* 홈팀 후보 */}
        <div className="p-3">
          <p className="text-xs font-semibold text-primary mb-2 px-1 truncate">
            {home.teamName}
          </p>
          <div className="space-y-0.5">
            {hasHomeSubs
              ? home.substitutes.map((p) => (
                  <BenchPlayerRow
                    key={p.playerApiId}
                    player={p}
                    isSelected={selectedPlayer?.playerApiId === p.playerApiId}
                    isHome
                    onClick={() => onSelectPlayer(p, true)}
                  />
                ))
              : (
                <p className="text-xs text-muted-foreground px-3 py-2">데이터 없음</p>
              )}
          </div>
        </div>

        {/* 어웨이팀 후보 */}
        <div className="p-3">
          <p className="text-xs font-semibold text-primary mb-2 px-1 truncate">
            {away.teamName}
          </p>
          <div className="space-y-0.5">
            {hasAwaySubs
              ? away.substitutes.map((p) => (
                  <BenchPlayerRow
                    key={p.playerApiId}
                    player={p}
                    isSelected={selectedPlayer?.playerApiId === p.playerApiId}
                    isHome={false}
                    onClick={() => onSelectPlayer(p, false)}
                  />
                ))
              : (
                <p className="text-xs text-muted-foreground px-3 py-2">데이터 없음</p>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}
