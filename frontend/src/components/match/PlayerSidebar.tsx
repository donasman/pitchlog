'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { LineupPlayer } from '@/types'
import RadarStatsChart, { type PlayerStats } from './RadarStatsChart'
import { POS_COLOR, POS_LABEL } from './PlayerMarker'

// ── 포지션별 모의 스탯 생성 (결정론적) ────────────────────────────
function generateStats(player: LineupPlayer): PlayerStats {
  const seed = (player.playerApiId ?? 0) * 2654435761 + (player.number ?? 7) * 40503

  const hash = (n: number): number => {
    let h = seed ^ (n * 2246822519)
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b)
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b)
    return Math.abs(h ^ (h >>> 16)) % 100
  }

  const pos = player.pos ?? 'M'

  // [min, max] per stat per position: [pace, shooting, passing, dribble, defense, physical]
  const ranges: Record<string, Array<[number, number]>> = {
    G: [[32,58], [12,38], [52,76], [34,58], [62,86], [65,88]],
    D: [[56,78], [26,54], [60,82], [50,73], [72,92], [66,88]],
    M: [[62,84], [55,78], [70,92], [66,88], [46,70], [55,78]],
    F: [[72,95], [74,96], [60,83], [72,94], [26,52], [60,82]],
  }

  const r = ranges[pos] ?? ranges.M
  const stat = (i: number) => r[i][0] + (hash(i + 1) % (r[i][1] - r[i][0] + 1))

  return {
    pace:     stat(0),
    shooting: stat(1),
    passing:  stat(2),
    dribble:  stat(3),
    defense:  stat(4),
    physical: stat(5),
  }
}

// ── 스탯 바 ────────────────────────────────────────────────────────
function StatBar({ label, value }: { label: string; value: number }) {
  const color =
    value >= 80 ? '#22c55e' :
    value >= 65 ? '#f59e0b' :
    value >= 50 ? '#3b82f6' : '#ef4444'

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className="font-bold tabular-nums" style={{ color }}>{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

// ── Props ──────────────────────────────────────────────────────────
interface Props {
  player: (LineupPlayer & { isHome: boolean }) | null
  open: boolean
  onClose: () => void
}

export default function PlayerSidebar({ player, open, onClose }: Props) {
  // ESC로 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const stats   = player ? generateStats(player) : null
  const color   = POS_COLOR[player?.pos ?? ''] ?? '#94a3b8'
  const posLabel = POS_LABEL[player?.pos ?? ''] ?? player?.pos ?? '?'

  const STAT_LABELS: Array<[keyof PlayerStats, string]> = [
    ['pace',     'Pace'],
    ['shooting', 'Shooting'],
    ['passing',  'Passing'],
    ['dribble',  'Dribble'],
    ['defense',  'Defense'],
    ['physical', 'Physical'],
  ]

  return (
    <>
      {/* ── 모바일 백드롭 ── */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/60 md:hidden transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── 패널 ──
          모바일: 하단에서 슬라이드업
          데스크탑: 우측에서 슬라이드인
      ── */}
      <aside
        className={cn(
          'fixed z-50 bg-card border-border overflow-hidden',
          'transition-transform duration-300 ease-in-out',
          // 모바일: 하단 드로어
          'bottom-0 left-0 right-0 max-h-[80vh] rounded-t-2xl border-t',
          // 데스크탑: 우측 패널
          'md:top-0 md:bottom-auto md:left-auto md:right-0 md:h-screen md:w-80 md:max-h-none md:rounded-none md:border-t-0 md:border-l',
          // 열림/닫힘 애니메이션
          open
            ? 'translate-y-0 md:translate-x-0'
            : 'translate-y-full md:translate-y-0 md:translate-x-full',
        )}
        aria-label="선수 상세 정보"
        role="dialog"
        aria-modal={open}
      >
        {/* ── 드래그 핸들 (모바일) ── */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* ── 닫기 버튼 ── */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 md:pt-4">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Player Info
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
            aria-label="닫기"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── 콘텐츠 ── */}
        {player && stats ? (
          <div className="overflow-y-auto h-full pb-16 md:pb-6">
            {/* 선수 헤더 */}
            <div className="px-4 pt-2 pb-5 border-b border-border">
              <div className="flex items-start gap-3">
                {/* 포지션 아이콘 */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black flex-shrink-0"
                  style={{ backgroundColor: `${color}22`, color }}
                >
                  {posLabel.charAt(0)}
                </div>

                <div className="min-w-0">
                  <p className="font-bold text-base leading-tight truncate">{player.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${color}22`, color }}
                    >
                      {posLabel}
                    </span>
                    <span className="text-sm text-muted-foreground font-mono">
                      #{player.number ?? '-'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {player.isHome ? '🏠 Home' : '✈️ Away'}
                  </p>
                </div>
              </div>
            </div>

            {/* 레이더 차트 */}
            <div className="flex flex-col items-center pt-5 pb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Season Stats (Estimated)
              </p>
              <RadarStatsChart stats={stats} size={180} />
            </div>

            {/* 스탯 바 */}
            <div className="px-4 pb-4 space-y-3">
              {STAT_LABELS.map(([key, label]) => (
                <StatBar key={key} label={label} value={stats[key]} />
              ))}
            </div>

            {/* 면책 */}
            <p className="text-[10px] text-muted-foreground/50 text-center px-4 pb-2">
              * Estimated values for visualization purposes
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center px-6 gap-3">
            <div className="text-4xl opacity-30">⚽</div>
            <p className="text-sm text-muted-foreground">
              선수를 클릭하면 상세 정보를 확인할 수 있습니다
            </p>
          </div>
        )}
      </aside>
    </>
  )
}
