interface InjuryBadgeProps {
  isSuspension: boolean
  injuryType?: string | null
}

export function InjuryBadge({ isSuspension, injuryType }: InjuryBadgeProps) {
  if (isSuspension) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '2px 8px', borderRadius: 5,
        background: 'rgba(234, 179, 8, 0.15)',
        border: '1px solid rgba(234, 179, 8, 0.4)',
        color: '#ca8a04',
        fontSize: 11, fontWeight: 700,
        fontFamily: 'Space Mono, monospace',
        whiteSpace: 'nowrap',
      }}>
        🟨 출전정지
      </span>
    )
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 5,
      background: 'rgba(239, 68, 68, 0.12)',
      border: '1px solid rgba(239, 68, 68, 0.35)',
      color: '#ef4444',
      fontSize: 11, fontWeight: 700,
      fontFamily: 'Space Mono, monospace',
      whiteSpace: 'nowrap',
    }}>
      🩹 {injuryType ?? '부상'}
    </span>
  )
}
