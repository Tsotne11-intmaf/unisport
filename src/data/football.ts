import type { Localized } from '@/types'

/** A club playing inside a university's own football league. */
export interface Club {
  id: string
  name: string
  logoUrl: string | null
  universityId: string
}

export interface GroupStanding {
  clubId: string
  played: number
  won: number
  drawn: number
  lost: number
  points: number
}

/** The groups a university's tournament is split into — rendered as collapsible rows. */
export interface TournamentGroup {
  id: string
  tournamentId: string
  code: string
  name: Localized
  standings: GroupStanding[]
}

export type AllstarRole = 'gk' | 'defender' | 'midfielder' | 'striker'

/** One position on the mini pitch. `x`/`y` are percentages inside the pitch shape. */
export interface AllstarSlot {
  id: string
  role: AllstarRole
  x: number
  y: number
  /** Filled in once voting closes; empty slots render as open positions. */
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
}

export interface WinnerTeam {
  clubId: string
  gold: number
  silver: number
  bronze: number
  photoUrl: string
  highlight: Localized
}

export interface VoteCandidate {
  id: string
  name: string
  clubId: string
  position: Localized
  votes: number
}

export const clubs: Club[] = [
  {
    id: 'rkinigzelebi',
    name: 'FC Rkinigzelebi',
    logoUrl: '/teams/rkinigzelebi-logo.png',
    universityId: 'btu',
  },
  {
    id: 'cloudy-street',
    name: 'Cloudy Street FC',
    logoUrl: '/teams/cloudy-street-logo.webp',
    universityId: 'btu',
  },
  {
    id: 'galacticos',
    name: 'FC Galacticos',
    logoUrl: '/teams/galacticos-logo.png',
    universityId: 'btu',
  },
  { id: 'atlantis', name: 'FC Atlantis', logoUrl: null, universityId: 'btu' },
  { id: 'vake-united', name: 'Vake United', logoUrl: null, universityId: 'btu' },
  { id: 'mtatsminda', name: 'FC Mtatsminda', logoUrl: null, universityId: 'btu' },
  { id: 'saburtalo-students', name: 'Saburtalo Students', logoUrl: null, universityId: 'btu' },
  { id: 'old-tbilisi', name: 'Old Tbilisi FC', logoUrl: null, universityId: 'btu' },
]

export const tournamentGroups: TournamentGroup[] = [
  {
    id: 'btu-league-group-a',
    tournamentId: 'btu-football-league',
    code: 'A',
    name: { en: 'Group A', ka: 'ჯგუფი A' },
    standings: [
      { clubId: 'rkinigzelebi', played: 5, won: 4, drawn: 1, lost: 0, points: 13 },
      { clubId: 'cloudy-street', played: 5, won: 3, drawn: 1, lost: 1, points: 10 },
      { clubId: 'atlantis', played: 5, won: 1, drawn: 2, lost: 2, points: 5 },
      { clubId: 'vake-united', played: 5, won: 0, drawn: 0, lost: 5, points: 0 },
    ],
  },
  {
    id: 'btu-league-group-b',
    tournamentId: 'btu-football-league',
    code: 'B',
    name: { en: 'Group B', ka: 'ჯგუფი B' },
    standings: [
      { clubId: 'galacticos', played: 5, won: 4, drawn: 0, lost: 1, points: 12 },
      { clubId: 'mtatsminda', played: 5, won: 3, drawn: 0, lost: 2, points: 9 },
      { clubId: 'saburtalo-students', played: 5, won: 2, drawn: 1, lost: 2, points: 7 },
      { clubId: 'old-tbilisi', played: 5, won: 0, drawn: 1, lost: 4, points: 1 },
    ],
  },
]

/**
 * The ALLSTAR XI. Slots stay empty until the vote closes — the pitch is the
 * place the winners get announced, so the shape is drawn even while unfilled.
 */
export const allstarSquad: AllstarSquad = {
  id: 'btu-allstar-2026',
  tournamentId: 'btu-football-league',
  round: 'A17',
  season: '2026',
  slots: [
    { id: 'st', role: 'striker', x: 50, y: 17, playerName: null, clubId: null, isCaptain: false },
    { id: 'cm', role: 'midfielder', x: 50, y: 42, playerName: null, clubId: null, isCaptain: false },
    { id: 'lb', role: 'defender', x: 23, y: 62, playerName: null, clubId: null, isCaptain: false },
    { id: 'rb', role: 'defender', x: 77, y: 62, playerName: null, clubId: null, isCaptain: false },
    { id: 'gk', role: 'gk', x: 50, y: 84, playerName: null, clubId: null, isCaptain: true },
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
      en: 'Two titles and still unbeaten at the top of Group A.',
      ka: 'ორი ტიტული და კვლავ უმარცხოდ ჯგუფი A-ს სათავეში.',
    },
  },
  {
    clubId: 'cloudy-street',
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

export const voteCandidates: VoteCandidate[] = [
  {
    id: 'cand-1',
    name: 'D. Miminoshvili',
    clubId: 'rkinigzelebi',
    position: { en: 'Goalkeeper', ka: 'მეკარე' },
    votes: 184,
  },
  {
    id: 'cand-2',
    name: 'M. Asatiani',
    clubId: 'cloudy-street',
    position: { en: 'Striker', ka: 'თავდამსხმელი' },
    votes: 167,
  },
  {
    id: 'cand-3',
    name: 'T. Kvatchadze',
    clubId: 'cloudy-street',
    position: { en: 'Midfielder', ka: 'ნახევარმცველი' },
    votes: 142,
  },
  {
    id: 'cand-4',
    name: 'N. Surguladze',
    clubId: 'rkinigzelebi',
    position: { en: 'Defender', ka: 'მცველი' },
    votes: 118,
  },
  {
    id: 'cand-5',
    name: 'T. Meladze',
    clubId: 'galacticos',
    position: { en: 'Defender', ka: 'მცველი' },
    votes: 96,
  },
]
