import { cn } from '@/lib/utils'
import { isLive, isFinished } from '@/lib/matchStatus'

type StatusBadgeSize = 'sm' | 'md'

interface StatusBadgeProps {
  status: string | null
  elapsed: number | null
  /** sm = 목록(컴팩트·한국어 라벨), md = 상세(영문 라벨·미시작 표시) */
  size?: StatusBadgeSize
}

// 목록(sm)과 상세(md)는 크기·라벨·미시작 처리가 달라 size별 프리셋으로 분리한다.
const PRESET: Record<StatusBadgeSize, {
  box: string
  dot: string
  gap: string
  live: string
  finished: string
  halftime: string
  notStarted: string | null
}> = {
  sm: {
    box: 'text-xs px-2 py-0.5',
    dot: 'w-1.5 h-1.5',
    gap: 'gap-1',
    live: '진행중',
    finished: '종료',
    halftime: 'HT',
    notStarted: null,
  },
  md: {
    box: 'text-sm px-3 py-1',
    dot: 'w-2 h-2',
    gap: 'gap-1.5',
    live: 'LIVE',
    finished: '종료',
    halftime: '하프타임',
    notStarted: '경기 전',
  },
}

/** 경기 상태 배지. 목록·상세에 중복돼 있던 두 정의를 size 프리셋으로 통합한다. */
export default function StatusBadge({ status, elapsed, size = 'sm' }: StatusBadgeProps) {
  if (!status) return null
  const p = PRESET[size]

  if (isLive(status)) {
    return (
      <span className={cn('inline-flex items-center font-bold rounded-full', p.gap, p.box)}
        style={{ color: 'var(--live)', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.28)' }}>
        <span className={cn('rounded-full animate-pulse', p.dot)} style={{ background: 'var(--live)' }} />
        {p.live}
      </span>
    )
  }
  if (status === 'HT') {
    return (
      <span className={cn('font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 rounded-full', p.box)}>
        {p.halftime}
      </span>
    )
  }
  if (isFinished(status)) {
    return (
      <span className={cn('font-bold text-muted-foreground bg-muted rounded-full', p.box)}>
        {p.finished}
      </span>
    )
  }
  return p.notStarted ? (
    <span className={cn('text-muted-foreground', size === 'sm' ? 'text-xs' : 'text-sm')}>{p.notStarted}</span>
  ) : null
}
