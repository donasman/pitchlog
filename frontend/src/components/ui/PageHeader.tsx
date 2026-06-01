import type { ReactNode } from 'react'

interface PageHeaderProps {
  /** 제목 위에 표시되는 작은 라벨 (예: "Stats") */
  eyebrow: ReactNode
  /** 페이지 제목 (텍스트·이모지·노드 허용) */
  title: ReactNode
  /** 보조 설명 (선택) */
  subtitle?: ReactNode
}

/** 페이지 상단 헤더 — eyebrow + 제목 + 보조 설명을 일관된 스타일로 표시한다. */
export default function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-2">{title}</h1>
      {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
    </div>
  )
}
