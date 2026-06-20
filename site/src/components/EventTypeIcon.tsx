import { EventType } from '../types/report'

const icons: Record<EventType, JSX.Element> = {
  weather: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" overflow="visible" aria-hidden="true">
      <path d="M4 10a4 4 0 1 1 7.9-.8A3 3 0 1 1 11 14H4a2 2 0 0 1 0-4z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
    </svg>
  ),
  earthquake: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" overflow="visible" aria-hidden="true">
      <path d="M1 8h2.5L5 4l3 8 2.5-5L12 9.5H15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  volcano: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" overflow="visible" aria-hidden="true">
      <path d="M8 2L5.5 8H3L8 14L13 8H10.5L8 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M6 6.5C6.5 5.5 7 5 8 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  wildfire: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" overflow="visible" aria-hidden="true">
      <path d="M8 14C5.5 14 3.5 12 3.5 9.5C3.5 7 5 5.5 6 4.5C6 6 6.5 6.5 7 7C7 5 7.5 3 8 2C9 4 10.5 5 10.5 7C11 6.5 11 5.5 11 5C12 6 12.5 7.5 12.5 9.5C12.5 12 10.5 14 8 14Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  ),
  tsunami: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" overflow="visible" aria-hidden="true">
      <path d="M1 9Q3 5 5.5 9Q8 13 10.5 9Q13 5 15 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M1 12Q3 9 5.5 12Q8 15 10.5 12Q13 9 15 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.4"/>
    </svg>
  ),
  other: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" overflow="visible" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M8 5.5V9M8 11v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
}

export default function EventTypeIcon({ type }: { type: EventType }) {
  return (
    <span style={{ color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', flexShrink: 0, marginTop: '3px' }}>
      {icons[type] ?? icons.other}
    </span>
  )
}
