import type { Localized } from '@/types'

/** A club playing inside a university's own league. */
export interface Club {
  id: string
  name: string
  logoUrl: string | null
  universityId: string
}

/** A group in the league draw — five clubs each, shown as a compact tile. */
export interface TournamentGroup {
  id: string
  tournamentId: string
  code: string
  name: Localized
  clubIds: string[]
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
  isCaptain: boolean
}

export interface AllstarSquad {
  id: string
  tournamentId: string
  round: string
  season: string
  slots: AllstarSlot[]
  /** Named substitutes, listed under the pitch the way the match graphic does. */
  bench: Array<{ id: string; playerName: string; clubId: string | null }>
}

export interface WinnerTeam {
  clubId: string
  gold: number
  silver: number
  bronze: number
  photoUrl: string
  highlight: Localized
}

/** Nothing but a name until the round's shortlist is settled. */
export interface VoteCandidate {
  id: string
  name: string
  votes: number
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
    clubIds: ['wasted-talents', 'remontada-21', 'invictus', 'gorlocks', 'vazisubani'],
  },
  {
    id: 'btu-league-group-b',
    tournamentId: 'btu-football-league',
    code: 'B',
    name: { en: 'Group B', ka: 'ჯგუფი B' },
    clubIds: ['bravo', 'sunderland', 'galacticos', 'winterfell', 'wildcard-united'],
  },
  {
    id: 'btu-league-group-c',
    tournamentId: 'btu-football-league',
    code: 'C',
    name: { en: 'Group C', ka: 'ჯგუფი C' },
    clubIds: ['phoenix', 'websteri', 'kenzo', 'saztavi', 'davaii'],
  },
  {
    id: 'btu-league-group-d',
    tournamentId: 'btu-football-league',
    code: 'D',
    name: { en: 'Group D', ka: 'ჯგუფი D' },
    clubIds: ['black-legion', 'boixos-nois', 'no-talent-united', 'rkinigzelebi', 'midnight'],
  },
  {
    id: 'btu-league-group-e',
    tournamentId: 'btu-football-league',
    code: 'E',
    name: { en: 'Group E', ka: 'ჯგუფი E' },
    clubIds: ['maestro', 'claudy-street', 'allstar', 'la-passion', 'mstovrebi'],
  },
]

/** The 2025 All-Star XI, as published on the match graphic. */
export const allstarSquad: AllstarSquad = {
  id: 'btu-allstar-2025',
  tournamentId: 'btu-football-league',
  round: 'A17',
  season: '2025',
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
      en: 'Champions once, on the podium three seasons running.',
      ka: 'ერთხელ ჩემპიონები, სამი სეზონია კვარცხლბეკზე.',
    },
  },
]

/** Placeholder shortlist — swap the names once the round's nominees are set. */
export const voteCandidates: VoteCandidate[] = [
  { id: 'cand-1', name: 'D. Miminoshvili', votes: 184 },
  { id: 'cand-2', name: 'M. Asatiani', votes: 167 },
  { id: 'cand-3', name: 'T. Kvatchadze', votes: 142 },
  { id: 'cand-4', name: 'N. Surguladze', votes: 118 },
  { id: 'cand-5', name: 'T. Meladze', votes: 96 },
]
