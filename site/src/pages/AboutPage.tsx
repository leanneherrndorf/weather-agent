import Header from '../components/Header'
import Footer from '../components/Footer'
import WeatherBackground from '../components/WeatherBackground'

interface Source {
  name: string
  description: string
  url: string
  requiresKey: boolean
}

const sources: Source[] = [
  {
    name: 'Open-Meteo',
    description: 'Provides current weather conditions — max/min temperature, precipitation, and wind speed — for a representative sample of 30 major cities worldwide. Sorted by most extreme conditions to surface anomalies.',
    url: 'https://open-meteo.com',
    requiresKey: false,
  },
  {
    name: 'NOAA / NWS',
    description: 'The US National Weather Service Common Alerting Protocol (CAP) feed supplies active severe and extreme weather alerts for the United States and territories — tornadoes, hurricanes, blizzards, flash floods, and more.',
    url: 'https://www.weather.gov',
    requiresKey: false,
  },
  {
    name: 'USGS Earthquake Hazards Program',
    description: 'The USGS GeoJSON feed delivers significant seismic events from the past seven days globally, including magnitude, depth, location, tsunami alert status, and USGS alert level.',
    url: 'https://earthquake.usgs.gov',
    requiresKey: false,
  },
  {
    name: 'Tavily Search',
    description: 'A search API built for AI agents. For each identified event the agent queries Tavily to surface recent news articles with source attribution.',
    url: 'https://tavily.com',
    requiresKey: true,
  },
]

interface StackItem {
  name: string
  role: string
  url: string
}

const stack: StackItem[] = [
  { name: 'Claude (Anthropic)', role: 'Runs the agentic tool loop. Decides which events are significant, synthesises summaries, and structures the final report.', url: 'https://anthropic.com' },
  { name: 'Python', role: 'Orchestrates the agent, calls data tools, and writes JSON output.', url: 'https://python.org' },
  { name: 'React + TypeScript', role: 'Powers the frontend. Reads JSON data files and renders the report interface.', url: 'https://react.dev' },
  { name: 'Vite', role: 'Builds and bundles the React site for deployment.', url: 'https://vitejs.dev' },
  { name: 'GitHub Actions', role: 'Runs the agent on a daily cron schedule, builds the site, and deploys to GitHub Pages automatically.', url: 'https://docs.github.com/en/actions' },
  { name: 'GitHub Pages', role: 'Hosts the static site publicly at no cost.', url: 'https://pages.github.com' },
]

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', background: '#dde8f5' }}>
      <WeatherBackground />
      <Header showAbout />

      <main style={{
        flex: 1,
        maxWidth: '960px',
        margin: '0 auto',
        padding: '30px 24px 64px',
        width: '100%',
        position: 'relative',
        zIndex: 1,
        background: 'var(--bg)',
      }}>
        <div>

        {/* Intro */}
        <div style={{ marginBottom: '56px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.2rem',
            fontWeight: 400,
            lineHeight: 1.2,
            marginBottom: '16px',
          }}>
            About
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            Stay up to date on current weather events.
            Weather Agent uses agentic AI in a real-world context. Each day, a Python agent autonomously gathers data from multiple
            sources, identifies the most significant global events, finds supporting news coverage,
            and produces a structured report, without any manual input.
          </p>
        </div>

        {/* How it works */}
        <section style={{ marginBottom: '56px' }}>
          <h2 style={sectionHeading}>How it works</h2>

          {[
            { step: '1', label: 'Gather structured data', body: 'The agent calls three tools in parallel: Open-Meteo for global weather conditions, the NWS CAP feed for US severe alerts, and the USGS earthquake feed for significant seismic events.' },
            { step: '2', label: 'Discover unstructured events', body: 'For event types without a dedicated API (volcanic eruptions, wildfires, major floods) the agent issues targeted web searches via Tavily to find current news coverage.' },
            { step: '3', label: 'Reason and rank', body: 'Claude reviews all collected data and selects the top events globally by severity, impact, and newsworthiness. It writes a factual 2–3 sentence summary for each.' },
            { step: '4', label: 'Find source articles', body: 'For each selected event, the agent searches for 1–2 recent news articles to accompany the summary with primary source links.' },
            { step: '5', label: 'Publish', body: 'The report is written as JSON to the site\'s data directory. GitHub Actions builds the React site and deploys it to GitHub Pages. The full pipeline runs in under two minutes.' },
          ].map(({ step, label, body }) => (
            <div key={step} style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-tertiary)',
                flexShrink: 0,
                marginTop: '1px',
              }}>
                {step}
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 400, marginBottom: '4px' }}>{label}</p>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{body}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Data sources */}
        <section style={{ marginBottom: '56px' }}>
          <h2 style={sectionHeading}>Data sources</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sources.map(s => (
              <div key={s.name} style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '16px 20px',
                background: '#fff',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent)' }}
                  >
                    {s.name}
                  </a>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: s.requiresKey ? 'var(--severe)' : 'var(--moderate)',
                    background: s.requiresKey ? 'var(--severe-bg)' : 'var(--moderate-bg)',
                    padding: '2px 7px',
                    borderRadius: '4px',
                  }}>
                    {s.requiresKey ? 'API key required' : 'No key required'}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech stack */}
        <section>
          <h2 style={sectionHeading}>Tech stack</h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stack.map(s => (
              <li key={s.name} style={{
                display: 'flex',
                gap: '12px',
                fontSize: '14px',
                lineHeight: 1.6,
              }}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontWeight: 600, color: 'var(--accent)', whiteSpace: 'nowrap', minWidth: '160px' }}
                >
                  {s.name}
                </a>
                <span style={{ color: 'var(--text-secondary)' }}>{s.role}</span>
              </li>
            ))}
          </ul>
        </section>
        </div> {/* end z-index wrapper */}
      </main>

      <Footer />
    </div>
  )
}

const sectionHeading: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--text-tertiary)',
  marginBottom: '20px',
}
