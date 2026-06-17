import type { H2HRecord } from '@/types'

interface Props {
  records: H2HRecord[]
  homeTeamApiId: number | null
}

export function H2HSection({ records, homeTeamApiId }: Props) {
  if (!records.length) return null

  // 홈 팀 기준 승/무/패 집계
  const wins   = records.filter(r => {
    if (r.homeTeamApiId === homeTeamApiId) return (r.homeGoals ?? 0) > (r.awayGoals ?? 0)
    return (r.awayGoals ?? 0) > (r.homeGoals ?? 0)
  }).length
  const draws  = records.filter(r => r.homeGoals === r.awayGoals).length
  const losses = records.length - wins - draws

  return (
    <div style={{
      border: '1px solid var(--line)',
      borderRadius: 16,
      background: 'var(--surface)',
      padding: '20px 24px',
      marginTop: 24,
    }}>
      <h3 style={{
        fontSize: 12, fontWeight: 700, letterSpacing: '0.07em',
        textTransform: 'uppercase', color: 'var(--gold)',
        marginBottom: 16,
      }}>
        ⚔️ 맞대결 기록
      </h3>

      {/* 요약 배지 */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {[
          { label: '승', count: wins,   color: '#16a34a' },
          { label: '무', count: draws,  color: '#6b7280' },
          { label: '패', count: losses, color: '#ef4444' },
        ].map(({ label, count, color }) => (
          <div key={label} style={{
            flex: 1, textAlign: 'center',
            padding: '10px 6px',
            border: `1px solid ${color}44`,
            borderRadius: 10,
            background: `${color}11`,
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: 'Space Mono, monospace' }}>
              {count}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* 경기 목록 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {records.slice(0, 5).map(r => {
          const date = r.matchDate
            ? new Date(r.matchDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })
            : '—'

          return (
            <div key={r.fixtureId} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 13,
            }}>
              <span style={{ color: 'var(--ink-3)', fontSize: 11, minWidth: 80 }}>{date}</span>

              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                <span style={{ fontWeight: 600, color: 'var(--ink-2)' }}>{r.homeTeamName ?? '홈'}</span>
                {r.homeTeamLogo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.homeTeamLogo} alt="" width={16} height={16} style={{ objectFit: 'contain' }} />
                )}
              </div>

              <span style={{
                fontFamily: 'Space Mono, monospace', fontWeight: 800,
                fontSize: 13, color: 'var(--ink-1)',
                padding: '2px 8px',
                background: 'var(--line)',
                borderRadius: 6, minWidth: 44, textAlign: 'center',
              }}>
                {r.homeGoals ?? '?'} – {r.awayGoals ?? '?'}
              </span>

              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                {r.awayTeamLogo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.awayTeamLogo} alt="" width={16} height={16} style={{ objectFit: 'contain' }} />
                )}
                <span style={{ fontWeight: 600, color: 'var(--ink-2)' }}>{r.awayTeamName ?? '원정'}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
