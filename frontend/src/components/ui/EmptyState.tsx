import Link from 'next/link'

interface EmptyStateProps {
  /** 큰 아이콘(이모지). 기본값은 축구공. */
  icon?: string
  /** 제목 (예: "Squad not found") */
  title: string
  /** 보조 설명 (선택) */
  message?: string
  /** 돌아갈 링크 경로 */
  backHref: string
  /** 돌아갈 링크 라벨 */
  backLabel: string
}

/**
 * 데이터를 찾을 수 없거나 비어 있을 때 보여주는 공용 빈 상태 컴포넌트.
 * 각 페이지에 중복돼 있던 NotFound 블록을 하나로 통합한다.
 */
export default function EmptyState({
  icon = '⚽',
  title,
  message,
  backHref,
  backLabel,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="text-5xl">{icon}</div>
      <h1 className="text-2xl font-bold">{title}</h1>
      {message && <p className="text-muted-foreground text-sm">{message}</p>}
      <Link href={backHref} className="text-sm text-primary hover:underline underline-offset-4">
        {backLabel}
      </Link>
    </div>
  )
}
