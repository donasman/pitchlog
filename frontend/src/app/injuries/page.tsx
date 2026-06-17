import type { Metadata } from 'next'
import { api } from '@/lib/api'
import { InjuriesPage } from '@/components/injuries/InjuriesPage'

export const metadata: Metadata = {
  title: '부상 & 출전정지 현황',
  description: '2026 FIFA 월드컵 참가 선수 부상 및 출전정지 현황. 다가오는 경기별 결장 선수 정보를 확인하세요.',
  openGraph: {
    title: '부상 & 출전정지 현황 | PitchLog',
    description: '2026 FIFA 월드컵 참가 선수 부상 및 출전정지 현황',
  },
}

export const revalidate = 1800 // 30분

export default async function InjuriesRoute() {
  let injuries = await api.getInjuries().catch(() => [])
  return <InjuriesPage injuries={injuries} />
}
