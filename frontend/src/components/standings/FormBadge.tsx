interface FormBadgeProps {
  result: string  // 'W' | 'D' | 'L'
}

export function FormBadge({ result }: FormBadgeProps) {
  const upper = result.toUpperCase()

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 700,
    fontFamily: 'Space Mono, monospace',
    color: '#fff',
    background:
      upper === 'W' ? '#22c55e' :
      upper === 'D' ? '#6b7280' :
      upper === 'L' ? '#ef4444' : '#374151',
  }

  return <span style={style}>{upper}</span>
}

interface FormTrackProps {
  form: string | null  // "WWDLW"
}

export function FormTrack({ form }: FormTrackProps) {
  if (!form) return <span style={{ color: 'var(--ink-3)', fontSize: 12 }}>—</span>

  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {form.split('').map((r, i) => (
        <FormBadge key={i} result={r} />
      ))}
    </div>
  )
}
