import { cn } from '@/lib/utils'

interface CountryFlagProps {
  /** 국기 이미지 URL. 없으면 국가 코드 폴백을 표시한다. */
  src: string | null
  /** 국가 코드 (폴백 텍스트) */
  code: string
  /** 국가명 (alt 텍스트) */
  name: string
  /** 크기·모양 등 공통 클래스 (예: "w-11 h-7 rounded shadow-sm flex-shrink-0") */
  className?: string
  /** 폴백 코드 글자 클래스 (예: "text-xs text-muted-foreground") */
  textClassName?: string
}

/**
 * 국기 이미지. 이미지가 없으면 국가 코드를 보여준다.
 */
export default function CountryFlag({ src, code, name, className, textClassName }: CountryFlagProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={`${name} flag`} className={cn('object-cover', className)} />
    )
  }
  return (
    <div className={cn('bg-muted flex items-center justify-center', className, textClassName)}>
      {code}
    </div>
  )
}
