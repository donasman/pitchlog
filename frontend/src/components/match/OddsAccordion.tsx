'use client'

import { useState } from 'react'
import type { FixtureOdds, MatchDetail } from '@/types'

interface Props {
  odds: FixtureOdds
  match: MatchDetail
}

function OddsBar({
  homeOdd, drawOdd, awayOdd,
}: { homeOdd: number; drawOdd: number; awayOdd: number }) {
  // 배당을 확률로 변환 (1/odd), 정규화
  const rawHome = 1 / homeOdd
  const rawDraw = 1 / drawOdd
  const rawAway = 1 / awayOdd
  const total = rawHome + rawDraw + rawAway

  const homePct = Math.round((rawHome / total) * 100)
  const drawPct = Math.round((rawDraw / total) * 100)
  const awayPct = 100 - homePct - drawPct

  return (
    <div>
      {/* 바 */}
      <div style={{ display: 'flex', height: 10, borderRadius: 6, overflow: 'hidden', gap: 2 }}>
        <div style={{ flex: homePct, background: '#3b82f6' }} />
        <div style={{ flex: drawPct, background: '#6b7280' }} />
        <div style={{ flex: awayPct, background: '#ef4444' }} />
      </div>
      {/* 퍼센트 레이블 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: 'var(--ink-3)' }}>
        <span style={{ color: '#3b82f6', fontWeight: 700 }}>{homePct}%</span>
        <span>{drawPct}%</span>
        <span style={{ color: '#ef4444', fontWeight: 700 }}>{awayPct}%</span>
      </div>
    </div>
  )
}

export function OddsAccordion({ odds, match }: Props) {
  const [open, setOpen] = useState(false)

  const homeOdd = odds.homeOdd ? parseFloat(odds.homeOdd) : null
  const drawOdd = odds.drawOdd ? parseFloat(odds.drawOdd) : null
  const awayOdd = odds.awayOdd ? parseFloat(odds.awayOdd) : null

  if (!homeOdd || !drawOdd || !awayOdd) return null

  return (
    <div style={{
      border: '1px solid var(--line)',
      borderRadius: 16,
      background: 'var(--surface)',
      overflow: 'hidden',
    }}>
      {/* 헤더 — 클릭으로 열기/닫기 */}
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--ink-1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>💰</span>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--gold)' }}>
            배당 (Match Winner)
          </span>
          {odds.bookmakerName && (
            <span style={{ fontSize: 11, color: 'var(--ink-3)', marginLeft: 4 }}>
              — {odds.bookmakerName}
            </span>
          )}
        </div>
        <span style={{ fontSize: 14, color: 'var(--ink-3)', transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </button>

      {/* 본문 */}
      {open && (
        <div style={{ padding: '0 24px 20px' }}>
          {/* 팀 이름 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-3)', marginBottom: 8 }}>
            <span style={{ color: '#3b82f6', fontWeight: 600 }}>{match.home.name ?? '홈'}</span>
            <span>무</span>
            <span style={{ color: '#ef4444', fontWeight: 600 }}>{match.away.name ?? '원정'}</span>
          </div>

          {/* 임플라이드 확률 바 */}
          <OddsBar homeOdd={homeOdd} drawOdd={drawOdd} awayOdd={awayOdd} />

          {/* 배당 수치 카드 */}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            {[
              { label: '홈 승', odd: homeOdd, color: '#3b82f6' },
              { label: '무승부', odd: drawOdd, color: '#6b7280' },
              { label: '원정 승', odd: awayOdd, color: '#ef4444' },
            ].map(({ label, odd, color }) => (
              <div
                key={label}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '12px 6px',
                  border: `1px solid ${color}44`,
                  borderRadius: 12,
                  background: `${color}11`,
                }}
              >
                <div style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: 22,
                  fontWeight: 800,
                  color,
                }}>
                  {odd.toFixed(2)}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 600, marginTop: 2 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 12, textAlign: 'center' }}>
            배당은 경기 시작 전 기준이며 변동될 수 있습니다. 투자 권유가 아닙니다.
          </p>
        </div>
      )}
    </div>
  )
}
