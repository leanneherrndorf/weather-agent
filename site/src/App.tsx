import { HashRouter, Routes, Route } from 'react-router-dom'
import LayoutPage from './pages/LayoutPage'
import AboutPage from './pages/AboutPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LayoutPage />} />
        <Route path="/report/:date" element={<LayoutPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </HashRouter>
  )
}
