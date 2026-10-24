import type { CampusEvent, NewsItem } from '@/types'

const tbilisi = { en: 'Tbilisi', ka: 'თბილისი' }

export const events: CampusEvent[] = [
  {
    id: 'btu-welcome-party-2026',
    title: { en: 'BTU Welcome Party', ka: 'ბითიუელების ველქამ ფართი' },
    summary: {
      en: 'The students’ welcome party, where BTU students get to know each other, make new friends and build memories worth keeping.',
      ka: 'სტუდენტების ველქამ ფართი, სადაც ბითიუელები ერთმანეთს უკეთ გაიცნობენ, ახალ მეგობრებს შეიძენენ და დაუვიწყარ მოგონებებს შექმნიან.',
    },
    kind: 'party',
    startsAt: '2026-10-11T21:00:00+04:00',
    venue: { en: 'Tsameti', ka: 'ცამეტი' },
    city: tbilisi,
    universityId: 'btu',
    ticketUrl: 'https://biletebi.ge/concerts/btu-welcome-party',
    imageUrl: '/events/welcome-party-2026.webp',
    lineup: ['TOBIASS', 'TAMTA', 'LOMJ'],
  },
]

export const news: NewsItem[] = [
  {
    id: 'football-season-opens',
    slug: 'football-season-opens',
    title: {
      en: 'The football season is back',
      ka: 'ფეხბურთის სეზონი ბრუნდება',
    },
    excerpt: {
      en: 'Entries for the BTU Football League open on 1 November, and the first whistle follows on the 15th.',
      ka: 'BTU-ს ფეხბურთის ლიგაზე განაცხადების მიღება 1 ნოემბერს იწყება, პირველი სასტვენი კი 15 ნოემბერს გაისმის.',
    },
    body: {
      en: 'The federation league returns with five groups of five, and once the group stage is done a knockout play-off settles the title. A squad of six to nine players may enter for 210 GEL. Entries are taken between 1 and 10 November, and the draw is made as soon as that window closes. Matches run until 20 December, and the full regulations are published on the entry page.',
      ka: 'ფედერაციის ლიგა ხუთი ხუთგუნდიანი ჯგუფით ბრუნდება, ჯგუფური ეტაპის დასრულების შემდეგ კი ტიტულს ნოკაუტ პლეიოფი გადაწყვეტს. მონაწილეობა ექვსიდან ცხრამდე მოთამაშისგან შემდგარ გუნდს შეუძლია, შენატანი კი 210 ლარია. განაცხადების მიღება 1-დან 10 ნოემბრამდე მიმდინარეობს და წილისყრა სწორედ ამ ვადის ამოწურვისთანავე გაიმართება. მატჩები 20 დეკემბრამდე გაგრძელდება, სრული რეგლამენტი კი რეგისტრაციის გვერდზეა გამოქვეყნებული.',
    },
    sportId: 'football',
    universityId: 'btu',
    publishedAt: '2026-10-22T10:00:00+04:00',
    isAnnouncement: true,
    readMinutes: 2,
    imageUrl: '/gallery/match-2.webp',
    keyDates: [
      { label: { en: 'Entries open', ka: 'რეგისტრაცია იხსნება' }, date: '2026-11-01' },
      { label: { en: 'Entries close', ka: 'რეგისტრაცია იხურება' }, date: '2026-11-10' },
      { label: { en: 'First whistle', ka: 'პირველი სასტვენი' }, date: '2026-11-15' },
    ],
  },
  {
    id: 'padel-cup-opens',
    slug: 'padel-cup-opens',
    title: {
      en: 'The padel cup takes over the weekend',
      ka: 'პადელის თასი შაბათ-კვირას გაიმართება',
    },
    excerpt: {
      en: 'Sixteen pairs and a straight knockout, on 12 and 13 November at Padel Park Saburtalo.',
      ka: 'თექვსმეტი წყვილი და პირდაპირი ნოკაუტი — 12 და 13 ნოემბერს, პადელ პარკ საბურთალოზე.',
    },
    body: {
      en: 'The BTU Padel Cup is played over two days at Padel Park Saburtalo. The format is a straight knockout, so a single defeat ends your weekend. A pair enters for 160 GEL, and both players give their name, surname, email, phone number and photo on the form. Entries are open from 1 to 10 November, and with only sixteen places the draw fills quickly.',
      ka: 'BTU-ს პადელის თასი ორი დღის განმავლობაში, პადელ პარკ საბურთალოზე გაიმართება. ფორმატი პირდაპირი ნოკაუტია, ამიტომ პირველივე მარცხი ტურნირიდან გასვლას ნიშნავს. წყვილის შენატანი 160 ლარია, ფორმაში კი ორივე მოთამაშე უთითებს სახელს, გვარს, ელფოსტას, ტელეფონის ნომერსა და ფოტოს. რეგისტრაცია 1-დან 10 ნოემბრამდე გრძელდება და, რადგან ადგილი სულ თექვსმეტია, ბადე სწრაფად ივსება.',
    },
    sportId: 'padel',
    universityId: 'btu',
    publishedAt: '2026-10-20T12:00:00+04:00',
    isAnnouncement: true,
    readMinutes: 2,
    imageUrl: '/gallery/padel-3.webp',
    keyDates: [
      { label: { en: 'Entries close', ka: 'რეგისტრაცია იხურება' }, date: '2026-11-10' },
      { label: { en: 'Match days', ka: 'სათამაშო დღეები' }, date: '2026-11-12' },
    ],
  },
  {
    id: 'welcome-party-recap',
    slug: 'welcome-party-sold-out',
    title: {
      en: 'The Welcome Party sold out',
      ka: 'ველქამ ფართი წარმატებით ჩატარდა',
    },
    excerpt: {
      en: 'Every ticket went before the doors opened, and Tsameti stayed full until six in the morning.',
      ka: 'ბილეთები კარის გაღებამდე გაიყიდა, ცამეტი კი დილის ექვს საათამდე სავსე დარჩა.',
    },
    body: {
      en: 'On 11 October the students’ welcome party filled Tsameti, and the tickets had gone long before the night began. TOBIASS opened at half past nine, TAMTA held midnight to two, and LOMJ carried the room through to six in the morning. Thank you to everyone who came — the next one is already being planned, and it will be announced here first.',
      ka: '11 ოქტომბერს სტუდენტების ველქამ ფართმა ცამეტი აავსო, ბილეთები კი ღამის დაწყებამდე დიდი ხნით ადრე ამოიწურა. საღამო TOBIASS-მა 21:30-ზე გახსნა, შუაღამიდან ორ საათამდე TAMTA დადგა, ბოლო სეტი კი LOMJ-ს ერგო და დილის ექვს საათამდე გაგრძელდა. მადლობა ყველას, ვინც მობრძანდა — შემდეგი ფართი უკვე იგეგმება და პირველად სწორედ აქ გამოცხადდება.',
    },
    sportId: null,
    universityId: 'btu',
    publishedAt: '2026-10-12T14:00:00+04:00',
    isAnnouncement: false,
    readMinutes: 2,
    imageUrl: '/events/welcome-party-2026.webp',
    keyDates: [{ label: { en: 'Held on', ka: 'ჩატარდა' }, date: '2026-10-11' }],
  },
]
