'use client'

/**
 * 날짜 칩을 눌러 해당 날짜 섹션으로 스크롤한다.
 * 스크롤 동작만 클라이언트에서 처리하고, 경기 데이터 자체는 서버에서 렌더한다.
 */
export default function DateJumpNav({ dates }: { dates: { key: string; label: string }[] }) {
  if (dates.length === 0) return null

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 24, marginBottom: 4 }}>
      {dates.map((d) => (
        <button
          key={d.key}
          onClick={() =>
            document.getElementById('date-' + d.key)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
          style={{
            padding: '5px 12px',
            borderRadius: 20,
            fontSize: 12,
            cursor: 'pointer',
            border: '1px solid var(--line)',
            background: 'var(--surface)',
            color: 'var(--ink-2)',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 500,
            transition: 'all 0.15s',
          }}
        >
          {d.label}
        </button>
      ))}
    </div>
  )
}
