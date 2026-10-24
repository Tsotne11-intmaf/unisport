import type { Localized } from '@/types'

/**
 * The order of play and the prize money for a tournament. Only what a player
 * needs in order to turn up and know what they are playing for — the running
 * costs behind the event are not published.
 */

export interface ScheduleMatch {
  /** Which court it is on, or null when the slot is not tied to one. */
  court: number | null
  name: Localized
  /** A knockout tie reads differently from a group match. */
  stage?: 'group' | 'quarter' | 'semi' | 'third' | 'final'
}

export interface ScheduleSlot {
  time: string
  matches: ScheduleMatch[]
  /** A gap in play, with no matches under it. */
  rest?: Localized
}

export interface ScheduleDay {
  id: string
  title: Localized
  slots: ScheduleSlot[]
  note?: Localized
}

export interface PrizePlace {
  place: 'first' | 'second' | 'third'
  amount: number
}

const pair = (a: number, b: number): Localized => ({
  en: `G${a} — G${b}`,
  ka: `გ${a} — გ${b}`,
})

export const padelSchedule: ScheduleDay[] = [
  {
    id: 'day-1',
    title: {
      en: 'Day 1 — group stage and quarter-finals',
      ka: 'დღე 1 — ჯგუფური ეტაპი და 1/4 ფინალები',
    },
    slots: [
      {
        time: '12:00',
        matches: [
          { court: 1, name: pair(1, 2), stage: 'group' },
          { court: 2, name: pair(3, 4), stage: 'group' },
          { court: 3, name: pair(5, 6), stage: 'group' },
          { court: 4, name: pair(7, 8), stage: 'group' },
        ],
      },
      {
        time: '12:45',
        matches: [
          { court: 1, name: pair(9, 10), stage: 'group' },
          { court: 2, name: pair(11, 12), stage: 'group' },
          { court: 3, name: pair(13, 14), stage: 'group' },
          { court: 4, name: pair(15, 16), stage: 'group' },
        ],
      },
      {
        time: '13:30',
        matches: [],
        rest: { en: 'Break', ka: 'შესვენება' },
      },
      {
        time: '14:00',
        matches: [
          { court: 1, name: { en: 'Quarter-final 1', ka: '1/4 ფინალი 1' }, stage: 'quarter' },
          { court: 2, name: { en: 'Quarter-final 2', ka: '1/4 ფინალი 2' }, stage: 'quarter' },
          { court: 3, name: { en: 'Quarter-final 3', ka: '1/4 ფინალი 3' }, stage: 'quarter' },
          { court: 4, name: { en: 'Quarter-final 4', ka: '1/4 ფინალი 4' }, stage: 'quarter' },
        ],
      },
    ],
    note: {
      en: 'Group matches run 45 minutes. The four quarter-finals are played at the same time, 14:00 to 15:00.',
      ka: 'ჯგუფური მატჩები 45 წუთია. ოთხივე 1/4 ფინალი პარალელურად მიმდინარეობს, 14:00-დან 15:00-მდე.',
    },
  },
  {
    id: 'day-2',
    title: {
      en: 'Day 2 — semi-finals and finals',
      ka: 'დღე 2 — ნახევარფინალები და ფინალები',
    },
    slots: [
      {
        time: '12:00',
        matches: [
          { court: 1, name: { en: 'Semi-final 1', ka: 'ნახევარფინალი 1' }, stage: 'semi' },
          { court: 2, name: { en: 'Semi-final 2', ka: 'ნახევარფინალი 2' }, stage: 'semi' },
        ],
      },
      {
        time: '13:00',
        matches: [
          {
            court: 1,
            name: { en: 'Third place match', ka: 'მატჩი III ადგილზე' },
            stage: 'third',
          },
        ],
      },
      {
        time: '14:00',
        matches: [
          { court: 1, name: { en: 'Grand final', ka: 'დიდი ფინალი' }, stage: 'final' },
        ],
      },
    ],
    note: {
      en: 'The finalists rest while the third place match is played. The day ends at 15:00.',
      ka: 'ფინალისტები III ადგილის მატჩის დროს ისვენებენ. დღე 15:00-ზე სრულდება.',
    },
  },
]

export const padelPrizes: PrizePlace[] = [
  { place: 'first', amount: 850 },
  { place: 'second', amount: 400 },
  { place: 'third', amount: 200 },
]
