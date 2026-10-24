import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { EventsPage } from '@/pages/EventsPage'
import { FootballPage } from '@/pages/FootballPage'
import { Home } from '@/pages/Home'
import { NewsArticlePage } from '@/pages/NewsArticlePage'
import { NewsPage } from '@/pages/NewsPage'
import { NotFound } from '@/pages/NotFound'
import { PadelPage } from '@/pages/PadelPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { RegisterTournamentPage } from '@/pages/RegisterTournamentPage'
import { UniversitiesPage } from '@/pages/UniversitiesPage'

/** Switching route should start at the top; changing a filter on the same route should not. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/padel" element={<PadelPage />} />
          <Route path="/football" element={<FootballPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:slug" element={<NewsArticlePage />} />
          <Route path="/universities" element={<UniversitiesPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/:tournamentId" element={<RegisterTournamentPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
