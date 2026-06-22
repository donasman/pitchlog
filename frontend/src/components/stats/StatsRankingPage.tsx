'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { StatsRanking } from '@/types'
import StatsRankingTable from './StatsRankingTable'
import PageHeader from '@/components/ui/PageHeader'

interface StatsRankingPageProps {
  mode: 'goals' | 'assists' | 'yellowCards' | 'redCards'
  icon: string
  title: string
  crossLinkHref: string
  crossLinkLabel: string
  /** 빌드 시 서버에서 내려준 클럽 시즌 데이터 */
  seasonRankings: StatsRanking[]
  /** 빌드 시 서버에서 내려준 월드컵 데이터 */
  worldcupRankings: StatsRanking[]
}

type Source = 'worldcup' | 'season'

export default function StatsRankingPage({
  mode,
  icon,
  title,
  crossLinkHref,
  crossLinkLabel,
  seasonRankings,
  worldcupRankings,
}: StatsRankingPageProps) {
  const [source, setSource] = useState<Source>('worldcup')

  const rankings = source === 'worldcup' ? worldcupRankings : seasonRankings

  return (
    <div className="wrap space-y-8 py-8 max-w-4xl mx-auto">
      <PageHeader
        eyebrow="Stats"
        title={<><span>{icon}</span> {title}</>}
        subtitle={source === 'worldcup'
          ? '2026 FIFA 월드컵 — 진행 중 통계'
          : '2025-26 Season — World Cup squads only'}
      />

      {/* 소스 탭 */}
      <div style={{ display: 'flex', gap: 8 }}>
        <SourceTab
          label="🏆 월드컵"
          active={source === 'worldcup'}
          onClick={() => setSource('worldcup')}
        />
        <SourceTab
          label="⚽ 25-26 시즌"
          active={source === 'season'}
          onClick={() => setSource('season')}
        />
      </div>

      {rankings.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 0',
          color: 'var(--ink-3)',
          fontSize: 14,
        }}>
          {source === 'worldcup'
            ? '월드컵 통계 데이터를 집계 중입니다. 경기 진행 후 업데이트됩니다.'
            : '시즌 통계 데이터를 불러오는 중입니다.'}
        </div>
      ) : (
        <StatsRankingTable rankings={rankings} mode={mode} />
      )}

      <div className="text-center pt-2">
        <Link href={crossLinkHref} className="text-sm text-primary hover:underline underline-offset-4">
          {crossLinkLabel} &rarr;
        </Link>
      </div>
    </div>
  )
}

function SourceTab({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 18px',
        borderRadius: 8,
        border: active ? '1px solid var(--gold)' : '1px solid var(--line)',
        background: active ? 'var(--gold)' : 'transparent',
        color: active ? '#0a0a0a' : 'var(--ink-2)',
        fontSize: 14,
        fontWeight: active ? 700 : 500,
        cursor: 'pointer',
        transition: 'all 0.15s',
        fontFamily: 'Pretendard, sans-serif',
      }}
    >
      {label}
    </button>
  )
}
