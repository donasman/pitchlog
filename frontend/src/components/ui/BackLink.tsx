import Link from 'next/link'

interface BackLinkProps {
  /** 이동할 경로 */
  href: string
  /** 링크 라벨 (예: "All Squads") */
  label: string
}

/** 좌측 셰브론 아이콘 + 라벨로 구성된 뒤로가기 링크. */
export default function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </Link>
  )
}
