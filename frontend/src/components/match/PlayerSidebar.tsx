'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { cn, playerSlug } from '@/lib/utils'
import type { LineupPlayer } from '@/types'
import { POS_COLOR, POS_LABEL } from './PlayerMarker'

interface Props {
  player: (LineupPlayer & { isHome: boolean }) | null
  open: boolean
  onClose: () => void
}

export default function PlayerSidebar({ player, open, onClose }: Props) {

  // ESC로 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // 정적 아카이브에는 상시 백엔드가 없으므로 런타임에 통계를 가져오지 않는다.
  // 전체 시즌 통계는 빌드 시점에 생성된 선수 상세 페이지에서 제공한다.

  const color    = POS_COLOR[player?.pos ?? ''] ?? '#94a3b8'
  const posLabel = POS_LABEL[player?.pos ?? ''] ?? player?.pos ?? '?'


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

            {/* 시즌 통계는 선수 상세 페이지에서 */}
            <div className="px-4 py-6">
              {player.playerId != null ? (
                <Link
                  href={`/players/${playerSlug(player.playerId, player.name)}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:border-primary transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">시즌 통계 보기</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      출전·득점·도움·평점 전체 기록
                    </p>
                  </div>
                  <span className="text-primary text-lg flex-shrink-0">→</span>
                </Link>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                  <span className="text-3xl opacity-30">📊</span>
                  <p className="text-xs text-muted-foreground/60">
                    이 선수의 상세 페이지가 없습니다
                  </p>
                </div>
              )}

              {/* 이 경기 기록 */}
              <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <MatchStat label="출전" value={player.minutesPlayed != null ? `${player.minutesPlayed}분` : '-'} />
                <MatchStat label="평점" value={player.rating != null ? player.rating.toFixed(1) : '-'} />
                <MatchStat label="득점" value={String(player.goalsScored ?? 0)} />
                <MatchStat label="도움" value={String(player.assistsMade ?? 0)} />
              </dl>
            </div>
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

/** 이 경기에서의 개인 기록 한 칸 */
function MatchStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/40 px-3 py-2">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="font-semibold tabular-nums">{value}</dd>
    </div>
  )
}
