import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Report, ReportIndex } from '../types/report'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import ReportView from '../components/ReportView'

const MOBILE_BREAKPOINT = 768
const SIDEBAR_WIDTH = 240

export default function LayoutPage() {
  const { date } = useParams<{ date?: string }>()
  const navigate = useNavigate()

  const [index, setIndex] = useState<ReportIndex | null>(null)
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT)
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= MOBILE_BREAKPOINT)

  useEffect(() => {
    const handler = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(mobile)
      if (!mobile) setSidebarOpen(true)
      else setSidebarOpen(false)
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  useEffect(() => {
    fetch('./data/index.json')
      .then(r => r.json())
      .then((data: ReportIndex) => {
        setIndex(data)
        if (data.reports.length > 0) {
          const today = new Date().toISOString().slice(0, 10)
          const hasToday = data.reports.some(r => r.date === today)
          const target = hasToday ? today : data.reports[0].date
          navigate(`/report/${target}`, { replace: true })
        }
      })
      .catch(() => {
        setLoading(false)
        setError(true)
      })
  }, [])

  useEffect(() => {
    if (!date) return
    setLoading(true)
    setError(false)
    setReport(null)

    fetch(`./data/${date}.json`)
      .then(r => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then((data: Report) => {
        setReport(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [date])

  // On desktop: button slides with the sidebar edge
  const toggleBtnLeft = sidebarOpen ? SIDEBAR_WIDTH - 28 : 12

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

        {/* Backdrop on mobile when sidebar open */}
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 8,
              background: 'rgba(0,0,0,0.3)',
            }}
          />
        )}

        {/* Sidebar — overlays on mobile, pushes on desktop */}
        <div style={{
          position: isMobile ? 'fixed' : 'relative',
          top: isMobile ? 'var(--header-height)' : 'auto',
          left: 0,
          bottom: isMobile ? 0 : 'auto',
          width: isMobile ? '240px' : 'auto',
          zIndex: isMobile ? 9 : 'auto',
          flexShrink: 0,
          display: 'flex',
          transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
          transition: isMobile ? 'transform 0.2s ease' : undefined,
        } as React.CSSProperties}>
          <Sidebar index={index} open={sidebarOpen || isMobile} onNavigate={isMobile ? () => setSidebarOpen(false) : undefined} />
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          style={{
            position: 'fixed',
            top: '62px',
            ...(isMobile
              ? { right: '12px' }
              : { left: `${toggleBtnLeft}px`, transition: 'left 0.2s ease, background 0.15s, color 0.15s' }
            ),
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            background: '#fff',
            color: 'var(--text-tertiary)',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--bg)'
            e.currentTarget.style.color = 'var(--text-primary)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#fff'
            e.currentTarget.style.color = 'var(--text-tertiary)'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            {sidebarOpen
              ? <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              : <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            }
          </svg>
        </button>

        <main style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
          <ReportView report={report} loading={loading} error={error} />
        </main>
      </div>

      <Footer />
    </div>
  )
}
