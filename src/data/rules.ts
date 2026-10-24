import type { Localized } from '@/types'

export interface RuleSection {
  id: string
  title: Localized
  body?: Localized
  items?: Localized[]
}

/** Match lengths differ by stage. */
export const matchDurations: Array<{ stage: Localized; minutes: number }> = [
  { stage: { en: 'Group stage', ka: 'ჯგუფური ეტაპი' }, minutes: 20 },
  { stage: { en: 'Play-off', ka: 'პლეიოფი' }, minutes: 24 },
  { stage: { en: 'Final', ka: 'ფინალი' }, minutes: 30 },
]

/** Every FIFA match is the same length, whatever the stage. */
export const fifaMatchFormat: Array<{ stage: Localized; minutes: number }> = [
  { stage: { en: 'Every match', ka: 'ყოველი მატჩი' }, minutes: 7 },
]

/** How the console tournament is played. */
export const fifaRules: RuleSection[] = [
  {
    id: 'fifa-entry',
    title: { en: 'Who enters', ka: 'ვინ რეგისტრირდება' },
    body: {
      en: 'A solo tournament: every player enters on their own, with a name, a photo, a phone number and an email. Entry is 20 GEL per player.',
      ka: 'სოლო ტურნირია: თითოეული მოთამაშე ცალკე რეგისტრირდება — სახელი, გვარი, ფოტო, ტელეფონის ნომერი და ელფოსტა. მონაწილეობა კაცზე 20 ლარია.',
    },
  },
  {
    id: 'fifa-playoff',
    title: { en: 'Play-offs', ka: 'პლეიოფი' },
    body: {
      en: 'First to two wins — best of three.',
      ka: 'ორ მოგებამდე — best of 3.',
    },
  },
  {
    id: 'fifa-final',
    title: { en: 'Semi-final and final', ka: 'ნახევარფინალი და ფინალი' },
    body: {
      en: 'First to three wins.',
      ka: 'სამ მოგებამდე.',
    },
  },
]

/** The federation's official rules, as published by the league. */
export const leagueRules: RuleSection[] = [
  {
    id: 'squad',
    title: { en: 'Squad size', ka: 'გუნდის შემადგენლობა' },
    body: {
      en: 'Each team must have a minimum of 6 and a maximum of 9 players.',
      ka: 'თითო გუნდი უნდა შედგებოდეს მინიმუმ 6, მაქსიმუმ 9 მოთამაშისგან.',
    },
  },
  {
    id: 'play',
    title: { en: 'Rules of play', ka: 'თამაშის წესები' },
    items: [
      {
        en: '6 fouls = penalty — a penalty is awarded on the sixth foul of each half.',
        ka: '6 ჯარიმა = პენალტი — თითო ტაიმში 6 ჯარიმაზე ინიშნება პენალტი.',
      },
      {
        en: 'No slide tackles — sliding for a loose ball is not allowed.',
        ka: 'პატკატი აკრძალულია — გაუგდებელ ბურთზე პატკატი აკრძალულია.',
      },
      {
        en: 'Throw-ins are taken with the foot, below the knee.',
        ka: 'აუტი — აუტი წოდება ფეხით, მუხლს ქვემოთ.',
      },
      {
        en: 'The keeper may use their hands up to the halfway line, and their feet anywhere.',
        ka: 'მეკარე — ხელით თამაში შეუძლია მოედნის ნახევრამდე, ფეხით მთელ მოედანზე.',
      },
      { en: 'Studded boots are not allowed.', ka: 'ბუცები აკრძალულია.' },
    ],
  },
  {
    id: 'red-card',
    title: { en: 'Red cards', ka: 'წითელი ბარათის წესი' },
    body: {
      en: 'After a red card the team plays a man down for 5 minutes, after which a replacement may come on. Yellow and red cards do not carry over into the play-offs.',
      ka: 'წითელი ბარათის მიღების შემთხვევაში, გუნდი 5 წუთის განმავლობაში კაცნაკლული თამაშობს. ამის შემდეგ შეიძლება სხვა მოთამაშის შესვლა. წითელი და ყვითელი ბარათი არ გადადის პლეიოფში.',
    },
  },
  {
    id: 'eligibility',
    title: { en: 'Ineligible players', ka: 'აკრძალულია' },
    body: {
      en: 'Fielding anyone who is not a BTU student, or who is not on your registered squad, is forbidden. A team that does so is withdrawn from the tournament.',
      ka: 'აკრძალულია ფეხბურთელის დამატება, რომელიც არ არის BTU-ში ან არ გყავთ დარეგისტრირებული გუნდში. დარღვევის შემთხვევაში გუნდი ჩაიხსნება.',
    },
  },
  {
    id: 'conduct',
    title: { en: 'Unsporting conduct', ka: 'არასპორტული საქციელი' },
    body: {
      en: 'Starting a fight, or any other unsporting behaviour, withdraws the team from the tournament. Whoever started it is banned for 2 seasons.',
      ka: 'ჩხუბის დაწყების ან სხვა არასპორტული საქციელის შემდეგ — გუნდი ჩაეხსნება ტურნირს. ინიციატორი იქნება 2 სეზონით დაბანილი.',
    },
  },
  {
    id: 'fair-play',
    title: { en: 'Fair play', ka: 'Fair Play' },
    body: {
      en: 'The league stands for fair play and sporting spirit. Respect your opponents, the referees and the crowd.',
      ka: 'ლიგა მოწოდებულია სამართლიანი თამაშისა და სპორტული სულისკვეთებისთვის. პატივი ეცით მოწინააღმდეგეს, მსაჯებსა და მაყურებელს.',
    },
  },
]
