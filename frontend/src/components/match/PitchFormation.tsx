'use client'

import { useCallback, useState } from 'react'
import type { LineupPlayer, LineupTeam } from '@/types'
import FootballField from './FootballField'
import BenchList from './BenchList'
import PlayerSidebar from './PlayerSidebar'
import { POS_COLOR, POS_LABEL } from './PlayerMarker'

interface Props {
  home: LineupTeam
  away: LineupTeam
}

// ── 범례 ──────────────────────────────────────────────────────────
function Legend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center text-xs text-muted-foreground">
      {Object.entries(POS_COLOR).map(([pos, color]) => (
        <span key={pos} className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          {POS_LABEL[pos] ?? pos}
        </span>
      ))}
      <span className="flex items-center gap-1.5 ml-2 border-l border-border pl-4">
        <span className="text-[10px] text-muted-foreground/70">클릭 → 상세 정보</span>
      </span>
    </div>
  )
}

// ── 포메이션 헤더 ─────────────────────────────────────────────────
function FormationHeader({ home, away }: { home: LineupTeam; away: LineupTeam }) {
  return (
    <div className="flex items-center justify-between text-sm px-1">
      <div className="flex items-center gap-2">
        <span className="font-bold text-foreground truncate max-w-[120px]">
          {home.teamName}
        </span>
        {home.formation && (
          <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {home.formation}
          </span>
        )}
      </div>
      <span className="text-muted-foreground text-xs font-semibold">vs</span>
      <div className="flex items-center gap-2 flex-row-reverse">
        <span className="font-bold text-foreground truncate max-w-[120px]">
          {away.teamName}
        </span>
        {away.formation && (
          <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {away.formation}
          </span>
        )}
      </div>
    </div>
  )
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────
export default function PitchFormation({ home, away }: Props) {
  const [selectedPlayer, setSelectedPlayer] = useState<
    (LineupPlayer & { isHome: boolean }) | null
  >(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSelectPlayer = useCallback((player: LineupPlayer, isHome: boolean) => {
    setSelectedPlayer({ ...player, isHome })
    setSidebarOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setSidebarOpen(false)
    // 닫힘 애니메이션 후 선수 정보 초기화
    setTimeout(() => setSelectedPlayer(null), 320)
  }, [])

  return (
    <div className="space-y-3">
      {/* 포메이션 헤더 */}
      <FormationHeader home={home} away={away} />

      {/* 필드 */}
      <FootballField
        home={home}
        away={away}
        selectedPlayer={selectedPlayer}
        onSelectPlayer={handleSelectPlayer}
      />

      {/* 범례 */}
      <Legend />

      {/* 후보 선수 목록 */}
      <BenchList
        home={home}
        away={away}
        selectedPlayer={selectedPlayer}
        onSelectPlayer={handleSelectPlayer}
      />

      {/* 선수 상세 사이드바 / 드로어 */}
      <PlayerSidebar
        player={selectedPlayer}
        open={sidebarOpen}
        onClose={handleClose}
      />
    </div>
  )
}
