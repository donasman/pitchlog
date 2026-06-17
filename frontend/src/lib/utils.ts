import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 포지션 한국어 변환 */
export function positionLabel(position: string | null): string {
  const map: Record<string, string> = {
    GK: '골키퍼',
    DEF: '수비수',
    MID: '미드필더',
    FWD: '공격수',
  }
  return position ? (map[position] ?? position) : '-'
}

/** 선수 상세 URL slug 생성 */
export function playerSlug(id: number, name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
  return `${id}-${slug}`
}

// 날짜·시간 포맷은 lib/format.ts로 통합. 기존 import 경로 호환을 위해 재노출한다.
export { formatBirthDate } from './format'
