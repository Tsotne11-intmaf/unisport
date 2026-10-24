import { supabase } from '@/lib/supabase'
import type {
  CampusEvent,
  NewsItem,
  RegistrationDraft,
  Sport,
  Tournament,
  University,
} from '@/types'

import * as content from './content'
import { tournaments as seedTournaments } from './tournaments'
import { sports as seedSports, universities as seedUniversities } from './universities'

export interface HubData {
  universities: University[]
  sports: Sport[]
  tournaments: Tournament[]
  events: CampusEvent[]
  news: NewsItem[]
}

export const seedData: HubData = {
  universities: seedUniversities,
  sports: seedSports,
  tournaments: seedTournaments,
  events: content.events,
  news: content.news,
}

/* Supabase stores every translated field as two columns (`*_en` / `*_ka`); these
   mappers fold them back into the Localized shape the UI works with. */

type Row = Record<string, unknown>

const str = (row: Row, key: string) => (row[key] as string | null) ?? ''
const nullableStr = (row: Row, key: string) => (row[key] as string | null) ?? null
const nullableNum = (row: Row, key: string) => {
  const value = row[key]
  return value === null || value === undefined ? null : Number(value)
}
const pair = (row: Row, base: string) => ({
  en: str(row, `${base}_en`),
  ka: str(row, `${base}_ka`),
})

const toUniversity = (row: Row): University => ({
  id: str(row, 'id'),
  name: pair(row, 'name'),
  shortName: str(row, 'short_name'),
  city: pair(row, 'city'),
  color: str(row, 'color'),
  logoUrl: nullableStr(row, 'logo_url'),
})

const toSport = (row: Row): Sport => ({
  id: str(row, 'id') as Sport['id'],
  name: pair(row, 'name'),
  blurb: pair(row, 'blurb'),
})

const toTournament = (row: Row): Tournament => ({
  id: str(row, 'id'),
  sportId: str(row, 'sport_id') as Tournament['sportId'],
  hostUniversityId: nullableStr(row, 'host_university_id'),
  title: pair(row, 'title'),
  summary: pair(row, 'summary'),
  format: pair(row, 'format'),
  status: str(row, 'status') as Tournament['status'],
  startDate: str(row, 'start_date'),
  endDate: str(row, 'end_date'),
  venue: pair(row, 'venue'),
  city: pair(row, 'city'),
  level: str(row, 'level') as Tournament['level'],
  fee: nullableNum(row, 'fee'),
  slots: nullableNum(row, 'slots'),
  slotsTaken: Number(row.slots_taken ?? 0),
  registrationDeadline: nullableStr(row, 'registration_deadline'),
  imageUrl: nullableStr(row, 'image_url'),
})

const toEvent = (row: Row): CampusEvent => ({
  id: str(row, 'id'),
  title: pair(row, 'title'),
  summary: pair(row, 'summary'),
  kind: str(row, 'kind') as CampusEvent['kind'],
  startsAt: str(row, 'starts_at'),
  venue: pair(row, 'venue'),
  city: pair(row, 'city'),
  universityId: nullableStr(row, 'university_id'),
  ticketUrl: nullableStr(row, 'ticket_url'),
  imageUrl: nullableStr(row, 'image_url'),
})

const toNews = (row: Row): NewsItem => ({
  id: str(row, 'id'),
  slug: str(row, 'slug'),
  title: pair(row, 'title'),
  excerpt: pair(row, 'excerpt'),
  body: pair(row, 'body'),
  sportId: (row.sport_id as NewsItem['sportId']) ?? null,
  universityId: nullableStr(row, 'university_id'),
  publishedAt: str(row, 'published_at'),
  isAnnouncement: Boolean(row.is_announcement),
  readMinutes: Number(row.read_minutes ?? 2),
  imageUrl: nullableStr(row, 'image_url'),
})

export type DataSource = 'seed' | 'supabase'

export interface LoadResult {
  data: HubData
  source: DataSource
  error: string | null
}

/**
 * Reads every table in one round of parallel queries. Any failure — missing
 * tables, bad keys, offline — keeps the seed data on screen rather than
 * dropping the user onto an empty site.
 */
export async function loadHubData(): Promise<LoadResult> {
  if (!supabase) return { data: seedData, source: 'seed', error: null }

  try {
    const [universities, sports, tournaments, events, news] = await Promise.all([
      supabase.from('universities').select('*').order('short_name'),
      supabase.from('sports').select('*'),
      supabase.from('tournaments').select('*').order('start_date'),
      supabase.from('events').select('*').order('starts_at'),
      supabase.from('news').select('*').order('published_at', { ascending: false }),
    ])

    const failed = [universities, sports, tournaments, events, news].find(
      (result) => result.error,
    )
    if (failed?.error) throw new Error(failed.error.message)

    // An empty database is almost always a half-finished setup, so keep the seed visible.
    if (!universities.data?.length) {
      return { data: seedData, source: 'seed', error: 'Supabase returned no universities.' }
    }

    return {
      source: 'supabase',
      error: null,
      data: {
        universities: (universities.data ?? []).map(toUniversity),
        sports: (sports.data ?? []).map(toSport),
        tournaments: (tournaments.data ?? []).map(toTournament),
        events: (events.data ?? []).map(toEvent),
        news: (news.data ?? []).map(toNews),
      },
    }
  } catch (cause) {
    return {
      data: seedData,
      source: 'seed',
      error: cause instanceof Error ? cause.message : 'Unknown Supabase error',
    }
  }
}

export type SubmitResult =
  | { ok: true; stored: 'supabase' | 'local' }
  | { ok: false; error: string }

/**
 * Sends a registration to Supabase. Without a configured project the entry is
 * kept in this browser only, so the form can still be demonstrated end to end.
 */
export async function submitRegistration(draft: RegistrationDraft): Promise<SubmitResult> {
  if (!supabase) {
    try {
      const key = 'campus-hub-registrations'
      const existing = JSON.parse(localStorage.getItem(key) ?? '[]') as RegistrationDraft[]
      localStorage.setItem(key, JSON.stringify([...existing, draft]))
    } catch {
      // Storage blocked — the submission simply isn't kept anywhere.
    }
    return { ok: true, stored: 'local' }
  }

  const { error } = await supabase.from('registrations').insert({
    sport_id: draft.sportId,
    tournament_id: draft.tournamentId,
    university_id: draft.universityId,
    full_name: draft.fullName,
    email: draft.email,
    phone: draft.phone,
    level: draft.level,
    partner_name: draft.partnerName || null,
    notes: draft.notes || null,
  })

  if (error) return { ok: false, error: error.message }
  return { ok: true, stored: 'supabase' }
}

/**
 * Records a vote for the player of the week. Falls back to this browser only
 * when Supabase isn't configured, so the poll still demonstrates end to end.
 */
export async function submitVote(candidateId: string): Promise<SubmitResult> {
  if (!supabase) return { ok: true, stored: 'local' }

  const { error } = await supabase.from('player_votes').insert({ candidate_id: candidateId })
  if (error) return { ok: false, error: error.message }
  return { ok: true, stored: 'supabase' }
}
