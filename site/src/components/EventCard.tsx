import { WeatherEvent } from '../types/report'
import SeverityBadge from './SeverityBadge'
import EventTypeIcon from './EventTypeIcon'

const severityBorderColor: Record<string, string> = {
  extreme: 'var(--border-extreme)',
  severe:  'var(--border-severe)',
  moderate:'var(--border-moderate)',
}

export default function EventCard({ event }: { event: WeatherEvent }) {
  const accentColor = severityBorderColor[event.severity] ?? severityBorderColor.moderate

  return (
    <article style={{
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '20px 24px',
      background: '#fff',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '12px',
        marginBottom: '10px',
      }}>
        <div style={{ minWidth: 0 }}>
          <h2 style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '7px',
            fontFamily: 'var(--font-display)',
            fontSize: '17px',
            fontWeight: 400,
            lineHeight: 1.3,
            marginBottom: '5px',
          }}>
            <EventTypeIcon type={event.type} />
            {event.title}
          </h2>
          <p style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '4px',
            fontSize: '12px',
            color: 'var(--text-tertiary)',
          }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
              <circle cx="6" cy="5" r="2" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M6 1C3.8 1 2 2.8 2 5c0 2.8 4 7 4 7s4-4.2 4-7c0-2.2-1.8-4-4-4z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
            </svg>
            {event.location}
          </p>
        </div>
        <SeverityBadge severity={event.severity} />
      </div>

      {/* Summary */}
      <p style={{
        fontSize: '14px',
        lineHeight: 1.75,
        color: 'var(--text-secondary)',
        marginBottom: event.articles?.length ? '16px' : 0,
      }}>
        {event.summary}
      </p>

      {/* Articles */}
      {event.articles?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {event.articles.filter(a => a.url).map((article, i) => (
            <a
              key={i}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                padding: '8px 12px',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                background: 'var(--bg)',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = accentColor)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                }}>
                  {article.source || 'Source'}
                </span>
                <span style={{
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  lineHeight: 1.4,
                }}>
                  {article.title}
                </span>
              </div>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0, color: 'var(--text-tertiary)' }}>
                <path d="M2 10L10 2M10 2H5M10 2V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </a>
          ))}
        </div>
      )}
    </article>
  )
}
