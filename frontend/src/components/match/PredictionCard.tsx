import type { FixturePrediction, MatchDetail } from '@/types'

interface Props {
  prediction: FixturePrediction
  match: Pick<MatchDetail, 'home' | 'away'>
}

/** 퍼센트 문자열 "55%" → 숫자 55 */
function pct(s: string | null): number {
  if (!s) return 0
  return parseInt(s.replace('%', ''), 10) || 0
}

export function PredictionCard({ prediction, match }: Props) {
  const home = pct(prediction.homeWinPct)
  const draw = pct(prediction.drawPct)
  const away = pct(prediction.awayWinPct)

  return (
    <div style={{
      border: '1px solid var(--line)',
      borderRadius: 16,
      background: 'var(--surface)',
      padding: '20px 24px',
      marginTop: 24,
    }}>
      {/* 헤더 */}
      <h3 style={{
        fontSize: 12, fontWeight: 700, letterSpacing: '0.07em',
        textTransform: 'uppercase', color: 'var(--gold)',
        marginBottom: 16,
      }}>
        🔮 경기 예측
      </h3>

      {/* 확률 바 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          display: 'flex', borderRadius: 6, overflow: 'hidden',
          height: 10, gap: 2,
        }}>
          {home > 0 && (
            <div style={{ width: `${home}%`, background: '#3b82f6', borderRadius: '6px 0 0 6px' }} />
          )}
          {draw > 0 && (
            <div style={{ width: `${draw}%`, background: '#6b7280' }} />
          )}
          {away > 0 && (
            <div style={{ width: `${away}%`, background: '#ef4444', borderRadius: '0 6px 6px 0' }} />
          )}
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginTop: 8, fontSize: 12,
        }}>
          <div style={{ color: '#3b82f6' }}>
            <div style={{ fontWeight: 700, fontFamily: 'Space Mono, monospace' }}>{prediction.homeWinPct ?? '-'}</div>
            <div style={{ color: 'var(--ink-3)', fontSize: 11 }}>{match.home.name ?? '홈'}</div>
          </div>
          <div style={{ textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontWeight: 700, fontFamily: 'Space Mono, monospace' }}>{prediction.drawPct ?? '-'}</div>
            <div style={{ color: 'var(--ink-3)', fontSize: 11 }}>무승부</div>
          </div>
          <div style={{ textAlign: 'right', color: '#ef4444' }}>
            <div style={{ fontWeight: 700, fontFamily: 'Space Mono, monospace' }}>{prediction.awayWinPct ?? '-'}</div>
            <div style={{ color: 'var(--ink-3)', fontSize: 11 }}>{match.away.name ?? '원정'}</div>
          </div>
        </div>
      </div>

      {/* 예측 스코어 */}
      {(prediction.goalsHome || prediction.goalsAway) && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 14px',
          background: 'rgba(245, 197, 24, 0.06)',
          border: '1px solid rgba(245, 197, 24, 0.2)',
          borderRadius: 10,
          marginBottom: 12,
        }}>
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>예측 스코어</span>
          <span style={{
            fontSize: 18, fontWeight: 800, fontFamily: 'Space Mono, monospace',
            color: 'var(--gold)', letterSpacing: '0.04em',
          }}>
            {prediction.goalsHome ?? '?'} – {prediction.goalsAway ?? '?'}
          </span>
        </div>
      )}

      {/* 조언 */}
      {prediction.advice && (
        <p style={{ fontSize: 13, color: 'var(--ink-2)', fontStyle: 'italic', margin: 0 }}>
          &ldquo;{prediction.advice}&rdquo;
        </p>
      )}
    </div>
  )
}
