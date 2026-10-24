export type Lang = 'en' | 'ka'

export type SportId = 'football' | 'padel'

/** Where a tournament is in its lifecycle. Registration is the state that matters most. */
export type TournamentStatus = 'registration_open' | 'upcoming' | 'ongoing' | 'finished'

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'open'

export type EventKind = 'party' | 'ceremony' | 'social'

/** Every piece of copy carries both languages so the toggle never falls back to a blank. */
export interface Localized {
  en: string
  ka: string
}

export interface University {
  id: string
  name: Localized
  shortName: string
  city: Localized
  color: string
  /** Crest; falls back to the short name on a colour tile when absent or missing. */
  logoUrl: string | null
  /** Wide campus photo used as the hero banner once this university is picked. */
  bannerUrl: string | null
  /** The events arm trades under its own name and mark; null falls back to the university's. */
  eventsName: Localized | null
  eventsLogoUrl: string | null
}

export interface Sport {
  id: SportId
  name: Localized
  blurb: Localized
}

/**
 * A tournament belongs to the university hosting it — the site aggregates what
 * each university runs rather than staging one league between them. `null` is
 * for open tournaments that aren't tied to a single campus.
 */
export interface Tournament {
  id: string
  sportId: SportId
  hostUniversityId: string | null
  title: Localized
  summary: Localized
  format: Localized
  status: TournamentStatus
  startDate: string
  endDate: string
  venue: Localized
  city: Localized
  level: SkillLevel
  /** Entry fee per player in GEL; null when free. */
  fee: number | null
  slots: number | null
  slotsTaken: number
  /** When entries open; null means they are open as soon as the status says so. */
  registrationOpensAt: string | null
  registrationDeadline: string | null
  /** Team tournaments collect a squad; individual ones collect one person. */
  teamBased: boolean
  squadMin: number | null
  squadMax: number | null
  /** Collect a phone number for every player, not just the captain. */
  collectPlayerPhones: boolean
  /** Ask for a team crest. A pair entering a padel cup has no use for one. */
  collectTeamLogo: boolean
  imageUrl: string | null
  /** CSS object-position for that photo, so each crop keeps its own subject. */
  imageFocus: string | null
}

export interface CampusEvent {
  id: string
  title: Localized
  summary: Localized
  kind: EventKind
  startsAt: string
  venue: Localized
  city: Localized
  /** The university putting the event on; null for anything open to all campuses. */
  universityId: string | null
  ticketUrl: string | null
  imageUrl: string | null
  /** Billed acts, in running order. Empty when the event has no line-up. */
  lineup: string[]
}

export interface NewsItem {
  id: string
  slug: string
  title: Localized
  excerpt: Localized
  body: Localized
  sportId: SportId | null
  /** The university the story comes from; null for site-wide announcements. */
  universityId: string | null
  publishedAt: string
  isAnnouncement: boolean
  readMinutes: number
  imageUrl: string | null
}

/** One player on a squad sheet. */
export interface SquadPlayer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  photo: File | null
}

/** What the team registration form collects before it is sent to Supabase. */
export interface TeamRegistrationDraft {
  tournamentId: string
  universityId: string
  teamName: string
  logo: File | null
  contactEmail: string
  contactPhone: string
  notes: string
  players: SquadPlayer[]
}

/** What the individual registration form collects before it is sent to Supabase. */
export interface RegistrationDraft {
  sportId: SportId
  tournamentId: string
  universityId: string
  fullName: string
  email: string
  phone: string
  level: SkillLevel
  partnerName: string
  notes: string
}
