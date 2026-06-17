'use client'

import { useState } from 'react'
import type { StandingGroup } from '@/types'
import { GroupTable } from './GroupTable'

interface StandingsPageProps {
  groups: StandingGroup[]
}

export function StandingsPage({ groups }: StandingsPageProps) {
  const [activeGroup, setActiveGroup] = useState<string>('all')

  // "Group Stage" 등 A~L 외 조 미배정 데이터 제외
  const validGroups = groups.filter((g) => /^Group [A-L]$/.test(g.groupName))
  const letters = validGroups.map((g) => g.groupName.replace('Group ', ''))
  const displayed =
    activeGroup === 'all'
      ? validGroups
      : validGroups.filter((g) => g.groupName === `Group ${activeGroup}`)

  return (
    <main className="wrap" style={{ paddingTop: 40, paddingBottom: 80 }}>
      {/* 페이지 헤더 */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600, marginBottom: 6 }}>
          2026 FIFA 월드컵
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--ink-1)', margin: 0, lineHeight: 1.2 }}>
          조별 순위
        </h1>
        <p style={{ marginTop: 10, fontSize: 14, color: 'var(--ink-3)' }}>
          12개 조 · 48개국 · 조 1~2위 및 3위 상위 8팀 16강 진출
        </p>
      </div>

      {/* 조 필터 탭 */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 28 }}>
        <TabButton
          label="전체"
          active={activeGroup === 'all'}
          onClick={() => setActiveGroup('all')}
        />
        {letters.map((letter) => (
          <TabButton
            key={letter}
            label={`${letter}조`}
            active={activeGroup === letter}
            onClick={() => setActiveGroup(letter)}
          />
        ))}
      </div>

      {/* 순위표 그리드 */}
      {validGroups.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--ink-3)', fontSize: 15 }}>
          순위 데이터를 불러오는 중입니다. 배치 실행 후 확인해 주세요.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: activeGroup === 'all' ? 'repeat(auto-fill, minmax(480px, 1fr))' : '1fr',
            gap: 20,
          }}
        >
          {displayed.map((group) => (
            <GroupTable key={group.groupName} group={group} />
          ))}
        </div>
      )}
    </main>
  )
}

function TabButton({
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
        padding: '6px 14px',
        borderRadius: 8,
        border: active ? '1px solid var(--gold)' : '1px solid var(--line)',
        background: active ? 'var(--gold)' : 'transparent',
        color: active ? '#0a0a0a' : 'var(--ink-2)',
        fontSize: 13,
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
