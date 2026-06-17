'use client'

import { useMemo, useState } from 'react'
import type { PlayerInjury } from '@/types'
import { InjuryBadge } from './InjuryBadge'

interface InjuriesPageProps {
  injuries: PlayerInjury[]
}

export function InjuriesPage({ injuries }: InjuriesPageProps) {
  const [filter, setFilter] = useState<'all' | 'injury' | 'suspension'>('all')
  const [teamFilter, setTeamFilter] = useState<string>('all')

  // 팀 목록 추출 (중복 제거, 정렬)
  const teams = useMemo(() => {
    const map = new Map<number, string>()
    injuries.forEach(i => {
      if (i.teamApiId != null && i.teamName) map.set(i.teamApiId, i.teamName)
    })
    return Array.from(map.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
  }, [injuries])

  const filtered = useMemo(() => {
    return injuries.filter(i => {
      if (filter === 'injury'    && i.isSuspension)  return false
      if (filter === 'suspension' && !i.isSuspension) return false
      if (teamFilter !== 'all'  && String(i.teamApiId) !== teamFilter) return false
      return true
    })
  }, [injuries, filter, teamFilter])

  // 날짜별 그룹핑
  const grouped = useMemo(() => {
    const map = new Map<string, PlayerInjury[]>()
    filtered.forEach(i => {
      const key = i.fixtureDate
        ? new Date(i.fixtureDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })
        : '날짜 미정'
      const arr = map.get(key) ?? []
      arr.push(i)
      map.set(key, arr)
    })
    return map
  }, [filtered])

  const totalInjuries    = injuries.filter(i => !i.isSuspension).length
  const totalSuspensions = injuries.filter(i => i.isSuspension).length

  return (
    <main className="wrap" style={{ paddingTop: 40, paddingBottom: 80 }}>
      {/* 헤더 */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600, marginBottom: 6 }}>
          2026 FIFA 월드컵
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--ink-1)', margin: 0, lineHeight: 1.2 }}>
          부상 &amp; 출전정지
        </h1>
        <p style={{ marginTop: 10, fontSize: 14, color: 'var(--ink-3)' }}>
          다가오는 경기 기준 · 부상 {totalInjuries}명 · 출전정지 {totalSuspensions}명
        </p>
      </div>

      {/* 필터 행 */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
        {/* 타입 필터 */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { value: 'all',        label: '전체' },
            { value: 'injury',     label: '🩹 부상' },
            { value: 'suspension', label: '🟨 출전정지' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value as typeof filter)}
              style={{
                padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                border: filter === opt.value ? '1px solid var(--gold)' : '1px solid var(--line)',
                background: filter === opt.value ? 'var(--gold)' : 'transparent',
                color: filter === opt.value ? '#0a0a0a' : 'var(--ink-2)',
                fontSize: 13, fontWeight: filter === opt.value ? 700 : 500,
                fontFamily: 'Pretendard, sans-serif',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* 팀 필터 */}
        <select
          value={teamFilter}
          onChange={e => setTeamFilter(e.target.value)}
          style={{
            padding: '6px 12px', borderRadius: 8,
            border: '1px solid var(--line)',
            background: 'var(--surface)', color: 'var(--ink-2)',
            fontSize: 13, cursor: 'pointer',
            fontFamily: 'Pretendard, sans-serif',
          }}
        >
          <option value="all">전체 국가</option>
          {teams.map(([id, name]) => (
            <option key={id} value={String(id)}>{name}</option>
          ))}
        </select>
      </div>

      {/* 결과 없음 */}
      {injuries.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--ink-3)', fontSize: 15 }}>
          부상/정지 데이터를 불러오는 중입니다. 배치 실행 후 확인해 주세요.
        </div>
      )}

      {filtered.length === 0 && injuries.length > 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-3)', fontSize: 15 }}>
          해당 조건의 선수가 없습니다.
        </div>
      )}

      {/* 날짜별 그룹 목록 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {Array.from(grouped.entries()).map(([date, items]) => (
          <section key={date}>
            <h2 style={{
              fontSize: 13, fontWeight: 700, color: 'var(--ink-3)',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              marginBottom: 12, fontFamily: 'Space Mono, monospace',
            }}>
              {date}
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 12,
            }}>
              {items.map((injury, idx) => (
                <InjuryCard key={`${injury.playerApiId}-${injury.fixtureId ?? idx}`} injury={injury} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}

function InjuryCard({ injury }: { injury: PlayerInjury }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 16px',
      background: 'var(--surface)',
      border: '1px solid var(--line)',
      borderRadius: 12,
    }}>
      {/* 선수 사진 */}
      <div style={{
        width: 48, height: 48, borderRadius: 10,
        overflow: 'hidden', flexShrink: 0,
        background: 'var(--line)',
      }}>
        {injury.playerPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={injury.playerPhoto}
            alt={injury.playerName}
            width={48} height={48}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, color: 'var(--ink-3)',
          }}>👤</div>
        )}
      </div>

      {/* 선수 정보 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 14, fontWeight: 700, color: 'var(--ink-1)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {injury.playerName}
          </span>
          <InjuryBadge isSuspension={injury.isSuspension} injuryType={injury.injuryType} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
          {injury.teamLogo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={injury.teamLogo} alt={injury.teamName ?? ''} width={16} height={16} style={{ objectFit: 'contain' }} />
          )}
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
            {injury.teamName ?? '—'}
          </span>
          {injury.reason && (
            <>
              <span style={{ color: 'var(--line)', fontSize: 12 }}>·</span>
              <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{injury.reason}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
