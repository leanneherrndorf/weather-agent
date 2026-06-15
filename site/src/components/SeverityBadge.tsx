import { Severity } from '../types/report'

const styles: Record<Severity, { background: string; color: string }> = {
  extreme: { background: 'var(--extreme-bg)', color: '#fff' },
  severe:  { background: 'var(--severe-bg)',  color: '#fff' },
  moderate:{ background: 'var(--moderate-bg)',color: '#fff' },
}

export default function SeverityBadge({ severity }: { severity: Severity }) {
  const s = styles[severity] ?? styles.moderate
  return (
    <span style={{
      ...s,
      fontSize: '10px',
      fontWeight: 600,
      letterSpacing: '0.07em',
      textTransform: 'uppercase',
      padding: '3px 9px',
      borderRadius: '4px',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }}>
      {severity}
    </span>
  )
}
