'use client'

import { useState } from 'react'
import type { StatsRanking } from '@/types'
import StatsRankingTable from './StatsRankingTable'
import PageHeader from '@/components/ui/PageHeader'

interface StatSet { season: StatsRanking[]; worldcup: StatsRanking[] }
interface Props {
  scorers: StatSet
  assists: StatSet
  cards:   StatSet
}

type StatTab   = 'goals' | 'assists' | 'yellowCards'
type SourceTab = 'worldcup' | 'season'

const STAT_TABS: { id: StatTab; label: string; icon: string }[] = [
  { id: 'goals',       label: '득점',   icon: '⚽' },
  { id: 'assists',     label: '도움',   icon: '🎯' },
  { id: 'yellowCards', label: '경고',   icon: '🟨' },
]

export default function StatsUnifiedPage({ scorers, assists, cards }: Props) {
  const [stat,   setStat]   = useState<StatTab>('goals')
  const [source, setSource] = useState<SourceTab>('worldcup')

  const dataMap: Record<StatTab, StatSet> = { goals: scorers, assists, yellowCards: cards }
  const rankings = dataMap[stat][source]

  const statLabel = STAT_TABS.find(t => t.id === stat)!

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px 64px' }}>
      <PageHeader
        eyebrow="통계"
        title={<>{statLabel.icon} {statLabel.label} 순위</>}
        subtitle={source === 'worldcup'
          ? '2026 FIFA 월드컵 — 진행 중 통계'
          : '2025-26 Season — World Cup squads only'}
      />

      {/* ── 통계 종류 탭 ─────────────────────────────── */}
      <div style={{ display: 'flex', gap: 6, marginTop: 28 }}>
        {STAT_TABS.map(({ id, label, icon }) => {
          const active = stat === id
          return (
            <button
              key={id}
              onClick={() => setStat(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '9px 20px', borderRadius: 10,
                border: `1px solid ${active ? 'var(--gold)' : 'var(--line)'}`,
                background: active ? 'var(--gold)' : 'var(--surface)',
                color: active ? 'var(--gold-fg)' : 'var(--ink-2)',
                fontSize: 14, fontWeight: active ? 700 : 500,
                cursor: 'pointer', transition: 'all 0.15s',
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          )
        })}
      </div>

      {/* ── 데이터 소스 탭 ───────────────────────────── */}
      <div style={{
        display: 'flex', gap: 6, marginTop: 12, marginBottom: 24,
        paddingBottom: 16, borderBottom: '1px solid var(--line)',
      }}>
        {[
          { id: 'worldcup' as SourceTab, label: '🏆 월드컵' },
          { id: 'season'   as SourceTab, label: '⚽ 25-26 시즌' },
        ].map(({ id, label }) => {
          const active = source === id
          return (
            <button
              key={id}
              onClick={() => setSource(id)}
              style={{
                padding: '6px 14px', borderRadius: 8,
                border: `1px solid ${active ? 'var(--ink-3)' : 'var(--line)'}`,
                background: active ? 'var(--surface-2)' : 'transparent',
                color: active ? 'var(--ink)' : 'var(--ink-3)',
                fontSize: 12, fontWeight: active ? 600 : 400,
                cursor: 'pointer', transition: 'all 0.15s',
                fontFamily: 'Pretendard, sans-serif',
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* ── 테이블 ───────────────────────────────────── */}
      {rankings.length === 0 ? (
        <div style={{
          padding: '60px 0', textAlign: 'center',
          color: 'var(--ink-3)', fontSize: 14,
        }}>
          {source === 'worldcup'
            ? '월드컵 통계 데이터를 집계 중입니다. 경기 진행 후 업데이트됩니다.'
            : '시즌 통계 데이터를 불러오는 중입니다.'}
        </div>
      ) : (
        <StatsRankingTable rankings={rankings} mode={stat} />
      )}
    </div>
  )
}
