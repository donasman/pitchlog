'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { LineupPlayer, SeasonStats } from '@/types'
import RadarStatsChart, { type PlayerStats } from './RadarStatsChart'
import { POS_COLOR, POS_LABEL } from './PlayerMarker'
import { API_BASE } from '@/lib/config'

// ── 시즌 통계 집계 → 레이더 스탯 변환 ────────────────────────────────
// 여러 리그 통계를 합산하여 0-100 척도로 정규화
function toRadarStats(statsList: SeasonStats[]): PlayerStats {
  if (statsList.length === 0) return { shooting: 0, passing: 0, dribble: 0, defense: 0, physical: 0, rating: 0 }

  const sum = <K extends keyof SeasonStats>(key: K): number =>
    statsList.reduce((acc, s) => acc + ((s[key] as number | null) ?? 0), 0)

  const avg = <K extends keyof SeasonStats>(key: K): number => {
    const vals = statsList.map(s => (s[key] as number | null) ?? null).filter((v): v is number => v !== null)
    return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
  }

  const shotsTotal      = sum('shotsTotal')
  const shotsOn         = sum('shotsOn')
  const passesAccuracy  = avg('passesAccuracy')         // 이미 퍼센트값
  const dribblesAtt     = sum('dribblesAttempts')
  const dribblesSucc    = sum('dribblesSuccess')
  const tacklesTotal    = sum('tacklesTotal')
  const interceptions   = sum('interceptions')
  const duelsTotal      = sum('duelsTotal')
  const duelsWon        = sum('duelsWon')
  const ratingAvg       = avg('rating')                 // 1-10 → 0-100

  // 유효슈팅률 → shooting (0-100)
  const shooting  = shotsTotal > 0 ? Math.round((shotsOn / shotsTotal) * 100) : 0

  // 패스정확도 → passing (이미 0-100)
  const passing   = Math.min(100, Math.round(passesAccuracy))

  // 드리블성공률 → dribble (0-100)
  const dribble   = dribblesAtt > 0 ? Math.round((dribblesSucc / dribblesAtt) * 100) : 0

  // 태클+인터셉트 → defense (최대 10을 100으로 스케일)
  const defRaw    = tacklesTotal + interceptions
  const defense   = Math.min(100, Math.round(defRaw * 5))

  // 듀얼승률 → physical (0-100)
  const physical  = duelsTotal > 0 ? Math.round((duelsWon / duelsTotal) * 100) : 0

  // 평점 (1-10 → 0-100)
  const rating    = Math.min(100, Math.round(ratingAvg * 10))

  return { shooting, passing, dribble, defense, physical, rating }
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
  const [radarStats, setRadarStats] = useState<PlayerStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)

  // ESC로 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // 선수 변경 시 실 통계 로드
  useEffect(() => {
    if (!player) { setRadarStats(null); return }
    setLoadingStats(true)
    setRadarStats(null)
    fetch(`${API_BASE}/api/players/${player.playerApiId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.stats?.length) {
          setRadarStats(toRadarStats(data.stats as SeasonStats[]))
        } else {
          setRadarStats(null)
        }
      })
      .catch(() => setRadarStats(null))
      .finally(() => setLoadingStats(false))
  }, [player?.playerApiId])

  const color    = POS_COLOR[player?.pos ?? ''] ?? '#94a3b8'
  const posLabel = POS_LABEL[player?.pos ?? ''] ?? player?.pos ?? '?'

  const STAT_LABELS: Array<[keyof PlayerStats, string]> = [
    ['shooting', '슈팅 정확도'],
    ['passing',  '패스 정확도'],
    ['dribble',  '드리블 성공률'],
    ['defense',  '태클+인터셉트'],
    ['physical', '듀얼 승률'],
    ['rating',   '평점'],
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

      <aside
        className={cn(
          'fixed z-50 bg-card border-border overflow-hidden',
          'transition-transform duration-300 ease-in-out',
          'bottom-0 left-0 right-0 max-h-[80vh] rounded-t-2xl border-t',
          'md:top-0 md:bottom-auto md:left-auto md:right-0 md:h-screen md:w-80 md:max-h-none md:rounded-none md:border-t-0 md:border-l',
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
        {player ? (
          <div className="overflow-y-auto h-full pb-16 md:pb-6">
            {/* 선수 헤더 */}
            <div className="px-4 pt-2 pb-5 border-b border-border">
              <div className="flex items-start gap-3">
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
                2025-26 Season Stats
              </p>
              {loadingStats ? (
                <div className="w-[180px] h-[180px] rounded-full bg-muted/30 animate-pulse" />
              ) : radarStats ? (
                <RadarStatsChart stats={radarStats} size={180} />
              ) : (
                <div className="flex flex-col items-center justify-center w-[180px] h-[180px] text-center gap-2">
                  <span className="text-3xl opacity-30">📊</span>
                  <p className="text-xs text-muted-foreground/60">통계 데이터 없음</p>
                </div>
              )}
            </div>

            {/* 스탯 바 */}
            {radarStats && (
              <div className="px-4 pb-4 space-y-3">
                {STAT_LABELS.map(([key, label]) => (
                  <StatBar key={key} label={label} value={radarStats[key]} />
                ))}
              </div>
            )}
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
