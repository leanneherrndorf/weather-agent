import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Report } from '../types/report'
import Header from '../components/Header'
import Footer from '../components/Footer'
import EventCard from '../components/EventCard'

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default function ReportPage() {
  const { date } = useParams<{ date: string }>()
  const [report, setReport] = useState<Report | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!date) return
    setReport(null)
    setError(false)
    fetch(`./data/${date}.json`)
      .then(r => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then(setReport)
      .catch(() => setError(true))
  }, [date])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header showBack />

      <main style={{
        flex: 1,
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '48px 24px',
        width: '100%',
      }}>
        {error && (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Report not found.</p>
            <Link to="/" style={{ fontSize: '14px', color: 'var(--accent)' }}>Back to archive</Link>
          </div>
        )}

        {!error && !report && (
          <p style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>Loading...</p>
        )}

        {report && (
          <>
            {/* Meta */}
            <div style={{ marginBottom: '28px' }}>
              <time
                dateTime={report.date}
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  marginBottom: '12px',
                }}
              >
                {formatDate(report.date)}
              </time>

              <h1 style={{
                fontSize: '1.65rem',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.25,
                marginBottom: '16px',
              }}>
                {report.headline}
              </h1>

              <p style={{
                fontSize: '15px',
                color: 'var(--text-secondary)',
                lineHeight: 1.75,
                paddingBottom: '32px',
                borderBottom: '1px solid var(--border)',
              }}>
                {report.overview}
              </p>
            </div>

            {/* Events */}
            <section aria-label="Events">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {report.events.map((event, i) => (
                  <EventCard key={i} event={event} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
