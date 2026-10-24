import type { Localized } from '@/types'

/** A club playing inside a university's own league. */
export interface Club {
  id: string
  name: string
  logoUrl: string | null
  universityId: string
}

/**
 * A group in the league draw. A `null` place is an unfilled slot — the tiles
 * show the shape of the draw before it is made, so nobody reads last season's
 * names as this season's groups.
 */
export interface TournamentGroup {
  id: string
  tournamentId: string
  code: string
  name: Localized
  clubIds: Array<string | null>
}

export type AllstarRole = 'gk' | 'defender' | 'midfielder' | 'striker'

/** One position on the mini pitch. `x`/`y` are percentages inside the pitch shape. */
export interface AllstarSlot {
  id: string
  role: AllstarRole
  x: number
  y: number
  playerName: string | null
  clubId: string | null
  /** Set when the badge was uploaded in the admin rather than taken from a club. */
  crestUrl?: string | null
  isCaptain: boolean
}

export interface AllstarSquad {
  id: string
  tournamentId: string
  round: string
  season: string
  slots: AllstarSlot[]
  /** Named substitutes, listed under the pitch the way the match graphic does. */
  bench: Array<{
    id: string
    playerName: string
    clubId: string | null
    crestUrl?: string | null
  }>
}

export interface WinnerTeam {
  clubId: string
  gold: number
  silver: number
  bronze: number
  photoUrl: string
  highlight: Localized
}

/**
 * An empty slot until the round's shortlist is settled: `name` and `logoUrl`
 * stay null and the row renders as a placeholder rather than a real nominee.
 */
export interface VoteCandidate {
  id: string
  name: string | null
  logoUrl: string | null
  /** Portrait for the leader crest; the crest stays empty without one. */
  photoUrl: string | null
  votes: number
}

/** The league run every section on the football page refers to. */
export const currentSeason: Localized = {
  en: 'Summer season 2026',
  ka: '2026 წლის ზაფხულის სეზონი',
}

export const clubs: Club[] = [
  // Group A
  { id: 'wasted-talents', name: 'FC Wasted Talents', logoUrl: null, universityId: 'btu' },
  { id: 'remontada-21', name: 'FC Remontada 21', logoUrl: null, universityId: 'btu' },
  { id: 'invictus', name: 'Invictus', logoUrl: null, universityId: 'btu' },
  { id: 'gorlocks', name: 'FC Gorlocks', logoUrl: null, universityId: 'btu' },
  { id: 'vazisubani', name: 'FC Vazisubani', logoUrl: null, universityId: 'btu' },

  // Group B
  { id: 'bravo', name: 'FC Bravo', logoUrl: null, universityId: 'btu' },
  { id: 'sunderland', name: 'Sunderland', logoUrl: null, universityId: 'btu' },
  {
    id: 'galacticos',
    name: 'FC Galacticos',
    logoUrl: '/teams/galacticos-logo.png',
    universityId: 'btu',
  },
  { id: 'winterfell', name: 'Winterfell', logoUrl: null, universityId: 'btu' },
  { id: 'wildcard-united', name: 'Wildcard United', logoUrl: null, universityId: 'btu' },

  // Group C
  { id: 'phoenix', name: 'FC Phoenix', logoUrl: null, universityId: 'btu' },
  { id: 'websteri', name: 'FC Websteri', logoUrl: null, universityId: 'btu' },
  { id: 'kenzo', name: 'FC Kenzo', logoUrl: null, universityId: 'btu' },
  { id: 'saztavi', name: 'FC Saztavi', logoUrl: null, universityId: 'btu' },
  { id: 'davaii', name: 'Davaii', logoUrl: null, universityId: 'btu' },

  // Group D
  { id: 'black-legion', name: 'Black Legion', logoUrl: null, universityId: 'btu' },
  { id: 'boixos-nois', name: 'Boixos Nois', logoUrl: null, universityId: 'btu' },
  { id: 'no-talent-united', name: 'NO Talent United', logoUrl: null, universityId: 'btu' },
  {
    id: 'rkinigzelebi',
    name: 'Rkinigzelebi',
    logoUrl: '/teams/rkinigzelebi-logo.png',
    universityId: 'btu',
  },
  { id: 'midnight', name: 'FC Midnight', logoUrl: null, universityId: 'btu' },

  // Group E
  { id: 'maestro', name: 'FC Maestro', logoUrl: null, universityId: 'btu' },
  {
    id: 'claudy-street',
    name: 'Claudy Street',
    logoUrl: '/teams/cloudy-street-logo.webp',
    universityId: 'btu',
  },
  { id: 'allstar', name: 'Allstar', logoUrl: null, universityId: 'btu' },
  { id: 'la-passion', name: 'La Passion', logoUrl: null, universityId: 'btu' },
  { id: 'mstovrebi', name: 'Mstovrebi', logoUrl: null, universityId: 'btu' },
]

export const tournamentGroups: TournamentGroup[] = [
  {
    id: 'btu-league-group-a',
    tournamentId: 'btu-football-league',
    code: 'A',
    name: { en: 'Group A', ka: 'ჯგუფი A' },
    clubIds: [null, null, null, null, null],
  },
  {
    id: 'btu-league-group-b',
    tournamentId: 'btu-football-league',
    code: 'B',
    name: { en: 'Group B', ka: 'ჯგუფი B' },
    clubIds: [null, null, null, null, null],
  },
  {
    id: 'btu-league-group-c',
    tournamentId: 'btu-football-league',
    code: 'C',
    name: { en: 'Group C', ka: 'ჯგუფი C' },
    clubIds: [null, null, null, null, null],
  },
  {
    id: 'btu-league-group-d',
    tournamentId: 'btu-football-league',
    code: 'D',
    name: { en: 'Group D', ka: 'ჯგუფი D' },
    clubIds: [null, null, null, null, null],
  },
  {
    id: 'btu-league-group-e',
    tournamentId: 'btu-football-league',
    code: 'E',
    name: { en: 'Group E', ka: 'ჯგუფი E' },
    clubIds: [null, null, null, null, null],
  },
]

/** The All-Star XI, as published on the match graphic. */
export const allstarSquad: AllstarSquad = {
  id: 'btu-allstar-2026',
  tournamentId: 'btu-football-league',
  round: 'A17',
  season: '2026',
  slots: [
    {
      id: 'st',
      role: 'striker',
      x: 50,
      y: 17,
      playerName: 'M. Asatiani',
      clubId: 'claudy-street',
      isCaptain: false,
    },
    {
      id: 'cm',
      role: 'midfielder',
      x: 50,
      y: 42,
      playerName: 'T. Kvatchadze',
      clubId: 'claudy-street',
      isCaptain: false,
    },
    {
      id: 'lb',
      role: 'defender',
      x: 23,
      y: 62,
      playerName: 'T. Meladze',
      clubId: 'galacticos',
      isCaptain: false,
    },
    {
      id: 'rb',
      role: 'defender',
      x: 77,
      y: 62,
      playerName: 'N. Surguladze',
      clubId: 'rkinigzelebi',
      isCaptain: false,
    },
    {
      id: 'gk',
      role: 'gk',
      x: 50,
      y: 84,
      playerName: 'D. Miminoshvili',
      clubId: null,
      isCaptain: true,
    },
  ],
  bench: [
    { id: 'sub-1', playerName: 'N. Pirtskalava', clubId: 'claudy-street' },
    { id: 'sub-2', playerName: 'L. Leqvinidze', clubId: 'galacticos' },
  ],
}

export const winnerTeams: WinnerTeam[] = [
  {
    clubId: 'rkinigzelebi',
    gold: 2,
    silver: 0,
    bronze: 0,
    photoUrl: '/teams/rkinigzelebi-team.webp',
    highlight: {
      en: 'Two titles — the most decorated club in the league.',
      ka: 'ორი ტიტული — ლიგის ყველაზე ტიტულოვანი კლუბი.',
    },
  },
  {
    clubId: 'claudy-street',
    gold: 1,
    silver: 2,
    bronze: 0,
    photoUrl: '/teams/cloudy-street-team.webp',
    highlight: {
      en: 'One title and runners-up twice — the most consistent side in the league.',
      ka: 'ერთი ტიტული და ორჯერ მეორე ადგილი — ლიგის ყველაზე სტაბილური გუნდი.',
    },
  },
  {
    clubId: 'galacticos',
    gold: 1,
    silver: 0,
    bronze: 2,
    photoUrl: '/teams/galacticos-team.webp',
    highlight: {
      en: 'One title and two third places — the league’s underdogs.',
      ka: 'ერთი ტიტული და ორჯერ მესამე ადგილი — ლიგის უნდერდოგები.',
    },
  },
]

/** Five empty slots — fill in `name` and `logoUrl` to open the vote. */
export const voteCandidates: VoteCandidate[] = [
  { id: 'cand-1', name: null, logoUrl: null, photoUrl: null, votes: 0 },
  { id: 'cand-2', name: null, logoUrl: null, photoUrl: null, votes: 0 },
  { id: 'cand-3', name: null, logoUrl: null, photoUrl: null, votes: 0 },
  { id: 'cand-4', name: null, logoUrl: null, photoUrl: null, votes: 0 },
  { id: 'cand-5', name: null, logoUrl: null, photoUrl: null, votes: 0 },
]
