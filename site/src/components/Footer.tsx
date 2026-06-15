export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '20px 24px',
      textAlign: 'center',
      fontSize: '12px',
      color: 'var(--text-tertiary)',
      marginTop: 'auto',
      background: '#fff',
      position: 'relative',
      zIndex: 1,
    }}>
      <p>Data: Open-Meteo · NWS · USGS · Tavily · Claude</p>
    </footer>
  )
}
