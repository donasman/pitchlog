/** 날짜·시간 포맷 유틸 (전 페이지 공통) */

/**
 * DB는 timezone 없는 UTC 문자열을 반환하므로 'Z'를 붙여 UTC로 강제 해석 후 KST(+9)로 변환.
 * "2026-06-12T19:00:00" → KST Date 객체
 */
function toKST(iso: string): Date {
  const utc = iso.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(iso) ? iso : iso + 'Z'
  return new Date(new Date(utc).getTime() + 9 * 60 * 60 * 1000)
}

/** 생년월일: "YYYY-MM-DD" → "YYYY년 MM월 DD일" */
export function formatBirthDate(dateStr: string | null): string {
  if (!dateStr) return '-'
  const [y, m, d] = dateStr.split('-')
  return `${y}년 ${m}월 ${d}일`
}

/** 경기 시간: ISO(UTC) → KST "HH:mm" (24시간제) */
export function formatMatchTime(iso: string | null): string {
  if (!iso) return ''
  const d = toKST(iso)
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
}

/** 경기 날짜(짧게): ISO(UTC) → KST "M월 D일" */
export function formatMatchDateShort(iso: string | null): string {
  if (!iso) return ''
  const d = toKST(iso)
  return `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일`
}

/** 경기 날짜(길게): ISO(UTC) → KST "Mon, Jan 5, 2026" 등 */
export function formatMatchDateLong(iso: string | null, locale = 'en-US'): string {
  if (!iso) return ''
  const d = toKST(iso)
  // getUTC* 값으로 Date를 재구성해 toLocaleDateString에 전달
  const kstDate = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  return kstDate.toLocaleDateString(locale, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
}

/** 관리자 목록용 날짜+시간: ISO(UTC) → KST "M월 D일 HH:mm" (없으면 "TBD") */
export function formatDateTime(iso: string | null): string {
  if (!iso) return 'TBD'
  const d = toKST(iso)
  const month = d.getUTCMonth() + 1
  const day = d.getUTCDate()
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const mm = String(d.getUTCMinutes()).padStart(2, '0')
  return `${month}월 ${day}일 ${hh}:${mm}`
}
