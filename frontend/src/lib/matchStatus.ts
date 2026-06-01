/** 경기 상태 코드(API-Football statusShort) 판별 유틸 */

const LIVE_STATUSES = ['1H', '2H', 'ET', 'BT', 'P', 'INT']
const FINISHED_STATUSES = ['FT', 'AET', 'PEN', 'AWD', 'WO']

/** 진행 중(전·후반, 연장, 승부차기 등) 여부. 하프타임(HT)은 제외한다. */
export function isLive(status: string | null): boolean {
  return status != null && LIVE_STATUSES.includes(status)
}

/** 종료(정규·연장·승부차기·몰수 등) 여부 */
export function isFinished(status: string | null): boolean {
  return status != null && FINISHED_STATUSES.includes(status)
}
