import type { StandingGroup } from '@/types'
import { FormTrack } from './FormBadge'

interface GroupTableProps {
  group: StandingGroup
  promotionCount?: number   // 진출 컷 (기본 2, Group Stage는 8)
}

const COL_STYLE: React.CSSProperties = {
  padding: '10px 12px',
  textAlign: 'center',
  fontSize: 13,
  color: 'var(--ink-2)',
  fontFamily: 'Space Mono, monospace',
  whiteSpace: 'nowrap',
}

const HEAD_STYLE: React.CSSProperties = {
  ...COL_STYLE,
  fontSize: 11,
  color: 'var(--ink-3)',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  paddingTop: 8,
  paddingBottom: 8,
  borderBottom: '1px solid var(--line)',
}

export function GroupTable({ group, promotionCount = 2 }: GroupTableProps) {
  const isGroupStage = group.groupName === 'Group Stage'
  const letter = isGroupStage ? '3위' : group.groupName.replace('Group ', '')

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--line)',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      {/* 조 헤더 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 16px',
        borderBottom: '1px solid var(--line)',
        background: 'var(--surface-2, rgba(255,255,255,0.03))',
      }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 28, height: 28, borderRadius: 6,
          background: 'var(--gold)', color: '#0a0a0a',
          fontSize: 13, fontWeight: 800,
          fontFamily: 'Space Grotesk, sans-serif',
        }}>
          {letter}
        </span>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-1)' }}>
          {group.groupName === 'Group Stage' ? '3위 팀 종합 순위' : group.groupName}
        </span>
      </div>

      {/* 테이블 */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ ...HEAD_STYLE, textAlign: 'left', width: 28 }}>#</th>
            <th style={{ ...HEAD_STYLE, textAlign: 'left', minWidth: 140 }}>팀</th>
            <th style={HEAD_STYLE}>경기</th>
            <th style={HEAD_STYLE}>승</th>
            <th style={HEAD_STYLE}>무</th>
            <th style={HEAD_STYLE}>패</th>
            <th style={HEAD_STYLE}>득점</th>
            <th style={HEAD_STYLE}>실점</th>
            <th style={HEAD_STYLE}>득실</th>
            <th style={{ ...HEAD_STYLE, fontWeight: 800, color: 'var(--ink-1)' }}>승점</th>
            <th style={{ ...HEAD_STYLE, textAlign: 'left' }}>최근</th>
          </tr>
        </thead>
        <tbody>
          {group.standings.map((entry, idx) => {
            const isPromotion = idx < promotionCount         // 1~2위: 확정 진출
            const isMaybePromotion = !isPromotion && idx === 2 && !isGroupStage  // 3위: 진출 가능
            const rowBg = isPromotion
              ? 'rgba(39, 194, 129, 0.05)'
              : isMaybePromotion
                ? 'rgba(245, 158, 11, 0.05)'
                : undefined
            const badgeBg = isPromotion
              ? 'var(--gold)'
              : isMaybePromotion
                ? '#f59e0b'
                : 'var(--line)'
            const badgeColor = isPromotion || isMaybePromotion ? '#0a0a0a' : 'var(--ink-3)'
            return (
              <tr
                key={entry.teamApiId}
                style={{
                  borderTop: idx > 0 ? '1px solid var(--line)' : undefined,
                  background: rowBg,
                }}
              >
                {/* 순위 */}
                <td style={{ ...COL_STYLE, textAlign: 'left', paddingLeft: 16 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 20, height: 20, borderRadius: 4,
                    fontSize: 11, fontWeight: 700,
                    background: badgeBg,
                    color: badgeColor,
                  }}>
                    {entry.rank}
                  </span>
                </td>

                {/* 팀명 */}
                <td style={{ ...COL_STYLE, textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {entry.teamLogo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={entry.teamLogo}
                        alt={entry.teamName}
                        width={20} height={20}
                        style={{ objectFit: 'contain' }}
                      />
                    )}
                    <span style={{ fontFamily: 'Pretendard, sans-serif', fontWeight: 500, color: 'var(--ink-1)' }}>
                      {entry.teamName}
                    </span>
                  </div>
                </td>

                <td style={COL_STYLE}>{entry.played ?? 0}</td>
                <td style={{ ...COL_STYLE, color: '#22c55e' }}>{entry.win ?? 0}</td>
                <td style={COL_STYLE}>{entry.draw ?? 0}</td>
                <td style={{ ...COL_STYLE, color: '#ef4444' }}>{entry.lose ?? 0}</td>
                <td style={COL_STYLE}>{entry.goalsFor ?? 0}</td>
                <td style={COL_STYLE}>{entry.goalsAgainst ?? 0}</td>
                <td style={{
                  ...COL_STYLE,
                  color: (entry.goalsDiff ?? 0) > 0 ? '#22c55e'
                       : (entry.goalsDiff ?? 0) < 0 ? '#ef4444'
                       : 'var(--ink-2)',
                }}>
                  {(entry.goalsDiff ?? 0) > 0 ? `+${entry.goalsDiff}` : (entry.goalsDiff ?? 0)}
                </td>
                <td style={{ ...COL_STYLE, fontWeight: 800, color: 'var(--ink-1)', fontSize: 14 }}>
                  {entry.points ?? 0}
                </td>

                {/* 최근 폼 */}
                <td style={{ ...COL_STYLE, textAlign: 'left', paddingRight: 16 }}>
                  <FormTrack form={entry.form} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* 범례 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '8px 16px',
        borderTop: '1px solid var(--line)',
        fontSize: 11, color: 'var(--ink-3)',
        flexWrap: 'wrap',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--gold)' }} />
          {promotionCount === 8 ? '32강 진출 (3위 상위 8팀)' : '32강 진출 확정 (1~2위)'}
        </span>
        {!isGroupStage && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: '#f59e0b' }} />
            32강 진출 가능 (3위)
          </span>
        )}
      </div>
    </div>
  )
}
