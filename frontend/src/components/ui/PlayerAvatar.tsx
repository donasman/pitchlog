import { cn } from '@/lib/utils'

interface PlayerAvatarProps {
  /** 선수 사진 URL. 없으면 이름 첫 글자 폴백을 표시한다. */
  src: string | null
  /** 선수 이름 (alt 및 이니셜 폴백에 사용) */
  name: string
  /** 크기·모양·테두리 등 공통 클래스 (예: "w-9 h-9 rounded-full border border-border") */
  className?: string
  /** 폴백 이니셜 글자 크기 클래스 (예: "text-xs") */
  textClassName?: string
}

/**
 * 선수 사진 아바타. 사진이 있으면 이미지를, 없으면 이름 첫 글자를 보여준다.
 * 여러 페이지에 중복돼 있던 사진/폴백 분기를 하나로 통합한다.
 */
export default function PlayerAvatar({ src, name, className, textClassName }: PlayerAvatarProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={name} className={cn('object-cover', className)} />
    )
  }
  return (
    <div className={cn('bg-muted flex items-center justify-center font-bold', className, textClassName)}>
      {name.charAt(0)}
    </div>
  )
}
