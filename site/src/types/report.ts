export interface Article {
  title: string
  url: string
  source: string
}

export type EventType =
  | 'weather'
  | 'earthquake'
  | 'volcano'
  | 'wildfire'
  | 'tsunami'
  | 'other'

export type Severity = 'extreme' | 'severe' | 'moderate'

export interface WeatherEvent {
  title: string
  location: string
  type: EventType
  summary: string
  severity: Severity
  articles: Article[]
}

export interface Report {
  date: string
  headline: string
  overview: string
  events: WeatherEvent[]
}

export interface ReportIndex {
  reports: { date: string; headline: string }[]
}
