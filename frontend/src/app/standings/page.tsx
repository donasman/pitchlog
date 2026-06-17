import type { Metadata } from 'next'
import { api } from '@/lib/api'
import { StandingsPage } from '@/components/standings/StandingsPage'

export const metadata: Metadata = {
  title: '2026 월드컵 조별 순위',
  description: '2026 FIFA 월드컵 12개 조 순위표. A조부터 L조까지 전체 48개국 승점·득실차·최근 폼을 한눈에 확인하세요.',
  openGraph: {
    title: '2026 월드컵 조별 순위 | PitchLog',
    description: '2026 FIFA 월드컵 12개 조 순위표. 48개국 승점·득실차를 실시간으로 확인하세요.',
  },
}

export default async function Page() {
  let groups = []
  try {
    groups = await api.getStandings()
  } catch {
    // 백엔드 미연결 시 빈 상태 표시
  }

  return <StandingsPage groups={groups} />
}
