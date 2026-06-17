import { cn } from '@/lib/utils'

interface TeamLogoProps {
  /** 팀 로고 URL. 없으면 폴백 박스를 표시한다. */
  src: string | null
  /** 팀 이름 (alt 및 이니셜 폴백). 없으면 폴백은 빈 박스. */
  name?: string | null
  /** 크기 등 공통 클래스 (예: "w-7 h-7 flex-shrink-0") */
  className?: string
  /** 폴백 박스 모양 */
  rounded?: 'rounded' | 'rounded-full'
  /** 폴백 이니셜 글자 크기 클래스 */
  textClassName?: string
}

/**
 * 팀(국가대표) 로고. 로고가 없으면 이름 첫 글자(이름이 없으면 빈 박스)를 보여준다.
 * 로고 이미지는 잘리지 않도록 object-contain만 적용하고, 모서리 둥글림은 폴백에만 준다.
 */
export default function TeamLogo({ src, name, className, rounded = 'rounded', textClassName }: TeamLogoProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={name ?? ''} className={cn('object-contain', className)} />
    )
  }
  return (
    <div className={cn('bg-muted flex items-center justify-center font-bold', rounded, className, textClassName)}>
      {name ? name.charAt(0) : null}
    </div>
  )
}
