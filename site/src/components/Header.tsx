import { Link, useLocation } from 'react-router-dom'

interface HeaderProps {
  showBack?: boolean
  showAbout?: boolean
}

export default function Header({
  showBack = false,
  showAbout = false,
}: HeaderProps) {
  const location = useLocation()
  const onAbout = location.pathname === '/about'

  return (
    <header style={{
      borderBottom: '1px solid #2a2724',
      padding: '0 20px',
      height: 'var(--header-height)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      background: 'var(--header-bg)',
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'var(--font-display)',
          fontSize: '18px',
          fontWeight: 400,
          color: 'var(--header-text)',
          letterSpacing: '0.01em',
        }}>
          <svg width="22" height="22" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="64" height="64" rx="14" fill="#12100e"/>
            <path d="M8 24 Q16 14 24 24 Q32 34 40 24 Q48 14 56 20" stroke="#93c5fd" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.45"/>
            <path d="M8 34 Q16 24 24 34 Q32 44 40 34 Q48 24 56 30" stroke="#93c5fd" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M8 44 Q16 34 24 44 Q32 54 40 44 Q48 34 56 40" stroke="#93c5fd" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.45"/>
          </svg>
          Weather Agent
        </Link>

        {showBack && (
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '13px',
            color: 'var(--header-text-muted)',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Reports
          </Link>
        )}
      </div>

      <Link
        to={showAbout ? '/' : '/about'}
        style={{
          fontSize: '13px',
          color: (onAbout || showAbout) ? 'var(--header-text)' : 'var(--header-text-muted)',
          fontWeight: (onAbout || showAbout) ? 500 : 400,
          transition: 'color 0.15s',
        }}
      >
        {showAbout ? 'Reports' : 'About'}
      </Link>
    </header>
  )
}
