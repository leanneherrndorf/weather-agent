import { useState, useEffect } from 'react'
import { Report } from '../types/report'
import EventCard from './EventCard'

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return mobile
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}

interface ReportViewProps {
  report: Report | null
  loading: boolean
  error: boolean
}

export default function ReportView({ report, loading, error }: ReportViewProps) {
  const isMobile = useIsMobile()

  if (loading) {
    return (
      <div style={{ padding: '64px 40px', color: 'var(--text-tertiary)', fontSize: '14px' }}>
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '64px 40px' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Report not found. Run the agent to generate today's report.
        </p>
      </div>
    )
  }

  if (!report) return null

  return (
    <article style={{ padding: isMobile ? '20px 24px' : '40px 80px' }}>
      {/* Meta */}
      <time
        dateTime={report.date}
        style={{
          display: 'block',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          color: 'var(--text-tertiary)',
          marginBottom: '14px',
        }}
      >
        {formatDate(report.date)}
      </time>

      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: isMobile ? '1.6rem' : '2.2rem',
        fontWeight: 400,
        lineHeight: 1.2,
        marginBottom: '18px',
        color: 'var(--text-primary)',
      }}>
        {report.headline}
      </h1>

      <p style={{
        fontSize: '15px',
        color: 'var(--text-secondary)',
        lineHeight: 1.75,
        paddingBottom: '32px',
        borderBottom: '1px solid var(--border)',
        marginBottom: '28px',
      }}>
        {report.overview}
      </p>

      {/* Events */}
      <section aria-label="Events" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {report.events.map((event, i) => (
          <EventCard key={i} event={event} />
        ))}
      </section>
    </article>
  )
}
