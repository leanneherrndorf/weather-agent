import { NavLink } from 'react-router-dom'
import { ReportIndex } from '../types/report'
import WeatherBackground from './WeatherBackground'

interface SidebarProps {
  index: ReportIndex | null
  open: boolean
  onNavigate?: () => void
}

function formatDateShort(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default function Sidebar({ index, open, onNavigate }: SidebarProps) {
  return (
    <aside style={{
      width: open ? '240px' : '0',
      flexShrink: 0,
      borderRight: open ? '1px solid var(--border)' : 'none',
      background: '#dde8f5',
      overflowX: 'hidden',
      transition: 'width 0.2s ease',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      <WeatherBackground xOffset={-340} />
      {/* Inner container — fills aside height, scrolls independently */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        whiteSpace: 'nowrap',
        width: '240px',
      }}>
        <div style={{ padding: '40px 44px 8px 16px' }}>
          <p style={{
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-tertiary)',
          }}>
            Past Reports
          </p>
        </div>

        <nav style={{ flex: 1 }}>
          {!index && (
            <p style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-tertiary)' }}>
              Loading...
            </p>
          )}

          {index?.reports.map(r => (
            <NavLink
              key={r.date}
              to={`/report/${r.date}`}
              onClick={onNavigate}
              style={({ isActive }) => ({
                display: 'block',
                padding: '10px 16px',
                fontSize: '13px',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                background: isActive ? 'rgba(255,255,255,0.45)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                transition: 'background 0.1s',
              })}
            >
              <time dateTime={r.date} style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 400 }}>
                {formatDateShort(r.date)}
              </time>
              {r.headline && (
                <span style={{
                  display: 'block',
                  fontSize: '11px',
                  color: 'var(--text-tertiary)',
                  marginTop: '2px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {r.headline}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}
