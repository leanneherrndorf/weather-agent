import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ReportIndex } from '../types/report'
import Header from '../components/Header'
import Footer from '../components/Footer'

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default function IndexPage() {
  const [index, setIndex] = useState<ReportIndex | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('./data/index.json')
      .then(r => r.json())
      .then(setIndex)
      .catch(() => setError(true))
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{
        flex: 1,
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '64px 24px 48px',
        width: '100%',
      }}>
        {/* Hero */}
        <div style={{ marginBottom: '56px' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            marginBottom: '14px',
          }}>
            Daily Global Event Reports
          </h1>
          <p style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            maxWidth: '480px',
          }}>
            An AI agent monitors worldwide weather, seismic, and natural disaster events each day,
            identifies the most significant stories, and links to source reporting.
          </p>
          <p style={{
            marginTop: '10px',
            fontSize: '12px',
            color: 'var(--text-tertiary)',
          }}>
            Powered by Claude · Open-Meteo · NWS · USGS · Tavily
          </p>
        </div>

        {/* Archive */}
        <div>
          <p style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-tertiary)',
            marginBottom: '12px',
          }}>
            Archive
          </p>

          {error && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              No reports found. Run the agent to generate the first report.
            </p>
          )}

          {!error && !index && (
            <p style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>Loading...</p>
          )}

          {index && (
            <ul style={{ listStyle: 'none', borderTop: '1px solid var(--border)' }}>
              {index.reports.length === 0 ? (
                <li style={{ padding: '16px 0', color: 'var(--text-tertiary)', fontSize: '14px' }}>
                  No reports yet.
                </li>
              ) : (
                index.reports.map(r => (
                  <li key={r.date} style={{ borderBottom: '1px solid var(--border)' }}>
                    <Link
                      to={`/report/${r.date}`}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '3px',
                        padding: '16px 0',
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                        <time
                          dateTime={r.date}
                          style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-tertiary)', flexShrink: 0 }}
                        >
                          {formatDate(r.date)}
                        </time>
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0, color: 'var(--text-tertiary)' }}>
                          <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      {r.headline && (
                        <p style={{
                          fontSize: '14px',
                          color: 'var(--text-secondary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {r.headline}
                        </p>
                      )}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
