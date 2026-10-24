import { supabase } from '@/lib/supabase'
import type {
  CampusEvent,
  Localized,
  NewsItem,
  RegistrationDraft,
  Sport,
  TeamRegistrationDraft,
  Tournament,
  University,
} from '@/types'

import * as content from './content'
import {
  allstarSquad as seedAllstar,
  currentSeason as seedSeason,
  voteCandidates as seedVoteCandidates,
  type AllstarRole,
  type AllstarSquad,
  type VoteCandidate,
} from './football'
import { tournaments as seedTournaments } from './tournaments'
import { sports as seedSports, universities as seedUniversities } from './universities'

export interface HubData {
  universities: University[]
  sports: Sport[]
  tournaments: Tournament[]
  events: CampusEvent[]
  news: NewsItem[]
  allstar: AllstarSquad
  allstarSeason: Localized
  voteCandidates: VoteCandidate[]
}

export const seedData: HubData = {
  universities: seedUniversities,
  sports: seedSports,
  tournaments: seedTournaments,
  events: content.events,
  news: content.news,
  allstar: seedAllstar,
  allstarSeason: seedSeason,
  voteCandidates: seedVoteCandidates,
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
  bannerUrl: nullableStr(row, 'banner_url'),
  eventsName: row.events_name_ka ? pair(row, 'events_name') : null,
  eventsLogoUrl: nullableStr(row, 'events_logo_url'),
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
  registrationOpensAt: nullableStr(row, 'registration_opens_at'),
  registrationDeadline: nullableStr(row, 'registration_deadline'),
  teamBased: Boolean(row.team_based),
  collectPlayerPhones: Boolean(row.collect_player_phones),
  collectTeamLogo: Boolean(row.collect_team_logo),
  squadMin: nullableNum(row, 'squad_min'),
  squadMax: nullableNum(row, 'squad_max'),
  imageUrl: nullableStr(row, 'image_url'),
  imageFocus: nullableStr(row, 'image_focus'),
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
  lineup: (row.lineup as string[] | null) ?? [],
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
  keyDates: (row.key_dates as NewsItem['keyDates'] | null) ?? [],
})

export type DataSource = 'seed' | 'supabase'

/**
 * The pitch and the bench come back as one flat list; the order on the pitch
 * is the order the admin set, and the season label is the same on every row.
 */
function toAllstar(rows: Row[]): { squad: AllstarSquad; season: Localized } {
  const first = rows[0] ?? {}
  const text = (row: Row, key: string) => (row[key] as string | null) ?? ''

  const onPitch = rows.filter((row) => !row.is_bench)
  const onBench = rows.filter((row) => row.is_bench)

  return {
    season: { en: text(first, 'season_en'), ka: text(first, 'season_ka') },
    squad: {
      id: 'allstar',
      tournamentId: text(first, 'tournament_id') || seedAllstar.tournamentId,
      round: text(first, 'round'),
      season: text(first, 'season_ka'),
      slots: onPitch.map((row) => ({
        id: String(row.id),
        role: text(row, 'role') as AllstarRole,
        x: Number(row.slot_x ?? 50),
        y: Number(row.slot_y ?? 50),
        playerName: (row.player_name as string | null) || null,
        clubId: null,
        crestUrl: (row.crest_url as string | null) ?? null,
        isCaptain: Boolean(row.is_captain),
      })),
      bench: onBench.map((row) => ({
        id: String(row.id),
        playerName: text(row, 'player_name'),
        clubId: null,
        crestUrl: (row.crest_url as string | null) ?? null,
      })),
    },
  }
}

function toVoteCandidate(row: Row, tallies: Map<string, number>): VoteCandidate {
  return {
    id: String(row.id),
    name: (row.name as string | null) || null,
    logoUrl: (row.logo_url as string | null) ?? null,
    photoUrl: (row.photo_url as string | null) ?? null,
    votes: tallies.get(String(row.id)) ?? 0,
  }
}

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
    const [universities, sports, tournaments, events, news, allstar, candidates, tallies] =
      await Promise.all([
        supabase.from('universities').select('*').order('short_name'),
        supabase.from('sports').select('*'),
        supabase.from('tournaments').select('*').order('start_date'),
        supabase.from('events').select('*').order('starts_at'),
        supabase.from('news').select('*').order('published_at', { ascending: false }),
        supabase.from('allstar_players').select('*').order('sort_order'),
        supabase.from('vote_candidates').select('*').order('sort_order'),
        supabase.from('vote_tallies').select('*'),
      ])

    // The squad and the nominees are optional: a project that has not run
     // migration 0002 yet should still show everything else.
    const failed = [universities, sports, tournaments, events, news].find(
      (result) => result.error,
    )
    if (failed?.error) throw new Error(failed.error.message)

    const tally = new Map(
      (tallies.data ?? []).map((row: Row) => [
        String(row.candidate_id),
        Number(row.votes ?? 0),
      ]),
    )
    const squad = allstar.data?.length ? toAllstar(allstar.data) : null

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
        allstar: squad?.squad ?? seedAllstar,
        allstarSeason: squad?.season ?? seedSeason,
        voteCandidates: candidates.data?.length
          ? candidates.data.map((row: Row) => toVoteCandidate(row, tally))
          : seedVoteCandidates,
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

const BUCKET = 'registrations'

/** Keeps storage keys ASCII and predictable, whatever the original filename was. */
function extensionOf(file: File): string {
  const match = /\.([a-z0-9]{1,5})$/i.exec(file.name)
  return match ? match[1].toLowerCase() : 'jpg'
}

async function uploadImage(file: File, path: string): Promise<string | null> {
  if (!supabase) return null
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type || undefined })
  if (error) throw new Error(error.message)
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

/**
 * Sends a squad sheet: the team row first, then its players, with the crest and
 * player photos uploaded to storage. Without Supabase the text is kept in this
 * browser — files cannot be, so only their names are recorded.
 */
export async function submitTeamRegistration(
  draft: TeamRegistrationDraft,
): Promise<SubmitResult> {
  if (!supabase) {
    try {
      const key = 'campus-hub-team-registrations'
      const existing = JSON.parse(localStorage.getItem(key) ?? '[]') as unknown[]
      localStorage.setItem(
        key,
        JSON.stringify([
          ...existing,
          {
            tournamentId: draft.tournamentId,
            universityId: draft.universityId,
            teamName: draft.teamName,
            logoName: draft.logo?.name ?? null,
            contactEmail: draft.contactEmail,
            contactPhone: draft.contactPhone,
            notes: draft.notes,
            players: draft.players.map((player) => ({
              firstName: player.firstName,
              lastName: player.lastName,
              email: player.email,
              phone: player.phone,
              photoName: player.photo?.name ?? null,
            })),
          },
        ]),
      )
    } catch {
      // Storage blocked — the submission simply isn't kept anywhere.
    }
    return { ok: true, stored: 'local' }
  }

  try {
    const folder = `${draft.tournamentId}/${Date.now()}`
    const logoUrl = draft.logo
      ? await uploadImage(draft.logo, `${folder}/crest.${extensionOf(draft.logo)}`)
      : null

    const { data, error } = await supabase
      .from('team_registrations')
      .insert({
        tournament_id: draft.tournamentId,
        university_id: draft.universityId,
        team_name: draft.teamName,
        logo_url: logoUrl,
        contact_email: draft.contactEmail,
        contact_phone: draft.contactPhone,
        notes: draft.notes || null,
      })
      .select('id')
      .single()

    if (error) throw new Error(error.message)

    const players = await Promise.all(
      draft.players.map(async (player, index) => ({
        registration_id: data.id as string,
        first_name: player.firstName,
        last_name: player.lastName,
        email: player.email,
        phone: player.phone || null,
        photo_url: player.photo
          ? await uploadImage(
              player.photo,
              `${folder}/player-${index + 1}.${extensionOf(player.photo)}`,
            )
          : null,
        shirt_order: index + 1,
      })),
    )

    const { error: playerError } = await supabase
      .from('team_registration_players')
      .insert(players)
    if (playerError) throw new Error(playerError.message)

    return { ok: true, stored: 'supabase' }
  } catch (cause) {
    return { ok: false, error: cause instanceof Error ? cause.message : 'Upload failed' }
  }
}
