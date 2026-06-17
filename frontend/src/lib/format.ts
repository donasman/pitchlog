/** 날짜·시간 포맷 유틸 (전 페이지 공통) */

/** 생년월일: "YYYY-MM-DD" → "YYYY년 MM월 DD일" */
export function formatBirthDate(dateStr: string | null): string {
  if (!dateStr) return '-'
  const [y, m, d] = dateStr.split('-')
  return `${y}년 ${m}월 ${d}일`
}

/** 경기 시간: ISO → "HH:mm" (24시간제) */
export function formatMatchTime(iso: string | null, locale = 'ko-KR'): string {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false })
}

/** 경기 날짜(짧게): ISO → "1월 5일" 등 */
export function formatMatchDateShort(iso: string | null, locale = 'ko-KR'): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(locale, { month: 'short', day: 'numeric' })
}

/** 경기 날짜(길게): ISO → "Mon, Jan 5, 2026" 등 */
export function formatMatchDateLong(iso: string | null, locale = 'en-US'): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(locale, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/** 관리자 목록용 날짜+시간: ISO → "1월 5일 18:00" 등 (없으면 "TBD") */
export function formatDateTime(iso: string | null, locale = 'ko-KR'): string {
  if (!iso) return 'TBD'
  return new Date(iso).toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
