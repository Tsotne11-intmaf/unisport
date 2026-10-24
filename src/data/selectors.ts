import type { CampusEvent, NewsItem, SportId, Tournament } from '@/types'

/** The sentinel the university filter uses for "don't narrow anything". */
export const ALL = 'all'

interface Scope {
  sportId?: SportId
  universityId?: string
}

const matchesUniversity = (owner: string | null, universityId: string | undefined) =>
  !universityId ||
  universityId === ALL ||
  owner === universityId ||
  // Entries with no host are open to every campus, so they survive any filter.
  owner === null

export function filterTournaments(
  tournaments: Tournament[],
  { sportId, universityId }: Scope,
): Tournament[] {
  return tournaments
    .filter(
      (tournament) =>
        (!sportId || tournament.sportId === sportId) &&
        matchesUniversity(tournament.hostUniversityId, universityId),
    )
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
}

/** Registration-open first, then whatever starts soonest — the useful order for a student. */
export function sortByUrgency(tournaments: Tournament[]): Tournament[] {
  const rank: Record<Tournament['status'], number> = {
    registration_open: 0,
    upcoming: 1,
    ongoing: 2,
    finished: 3,
  }
  return [...tournaments].sort(
    (a, b) => rank[a.status] - rank[b.status] || a.startDate.localeCompare(b.startDate),
  )
}

export function openForRegistration(tournaments: Tournament[]): Tournament[] {
  return tournaments.filter((tournament) => tournament.status === 'registration_open')
}

export function placesLeft(tournament: Tournament): number | null {
  if (tournament.slots === null) return null
  return Math.max(0, tournament.slots - tournament.slotsTaken)
}

export function filterNews(news: NewsItem[], { sportId, universityId }: Scope): NewsItem[] {
  return news
    .filter((item) => {
      // Site-wide items stay visible under every filter, otherwise picking a
      // university would hide the announcements that matter most.
      const sportOk = !sportId || item.sportId === sportId || item.sportId === null
      return sportOk && matchesUniversity(item.universityId, universityId)
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export function filterEvents(events: CampusEvent[], { universityId }: Scope): CampusEvent[] {
  return events
    .filter((event) => matchesUniversity(event.universityId, universityId))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
}

export function upcomingEvents(events: CampusEvent[], limit?: number): CampusEvent[] {
  const now = Date.now()
  const future = events
    .filter((event) => new Date(event.startsAt).getTime() >= now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
  const list = future.length
    ? future
    : [...events].sort((a, b) => b.startsAt.localeCompare(a.startsAt))
  return limit ? list.slice(0, limit) : list
}
