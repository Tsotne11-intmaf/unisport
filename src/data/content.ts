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
      en: 'Entries for the BTU Football League open on 1 November; the first whistle follows on 15 November.',
      ka: 'BTU-ს ფეხბურთის ლიგაზე რეგისტრაცია 1 ნოემბერს იხსნება, პირველი სასტვენი კი 15 ნოემბერს გაისმის.',
    },
    body: {
      en: 'The federation league returns with five groups of five and a knockout play-off to decide the title. Squads of six to nine enter for 210 GEL, and the window runs from 1 to 10 November — the draw is made once it closes. Matches are played at the BTU campus pitch through to 20 December, and the regulations are published on the entry page.',
      ka: 'ფედერაციის ლიგა ბრუნდება ხუთი ხუთგუნდიანი ჯგუფით და ნოკაუტ პლეიოფით, რომელიც ტიტულს გადაწყვეტს. ექვსიდან ცხრა მოთამაშემდე შემადგენლობები 210 ლარად რეგისტრირდებიან, ფანჯარა კი 1-დან 10 ნოემბრამდეა ღია — ბადე მის დახურვისთანავე გათამაშდება. მატჩები BTU-ს კამპუსის მოედანზე 20 დეკემბრამდე გაგრძელდება, რეგლამენტი კი რეგისტრაციის გვერდზეა გამოქვეყნებული.',
    },
    sportId: 'football',
    universityId: 'btu',
    publishedAt: '2026-10-22T10:00:00+04:00',
    isAnnouncement: true,
    readMinutes: 2,
    imageUrl: '/gallery/match-2.webp',
  },
  {
    id: 'padel-cup-opens',
    slug: 'padel-cup-opens',
    title: {
      en: 'The padel cup takes over the weekend',
      ka: 'პადელის თასი შაბათ-კვირას იბარებს',
    },
    excerpt: {
      en: 'Sixteen pairs, straight knockout, played across 12 and 13 November at Padel Park Saburtalo.',
      ka: 'თექვსმეტი წყვილი, პირდაპირი ნოკაუტი, 12 და 13 ნოემბერს პადელ პარკ საბურთალოზე.',
    },
    body: {
      en: 'The BTU Padel Cup is a straight knockout over two days on four courts — lose once and your weekend is over. Pairs enter for 160 GEL between 1 and 10 November, and both players give their name, email, phone and photo on the entry form. Sixteen places only, so the draw fills quickly.',
      ka: 'BTU-ს პადელის თასი ორდღიანი პირდაპირი ნოკაუტია ოთხ კორტზე — ერთი მარცხი და შაბათ-კვირა დასრულდა. წყვილები 160 ლარად რეგისტრირდებიან 1-დან 10 ნოემბრამდე, ორივე მოთამაშე კი ფორმაში უთითებს სახელს, ელფოსტას, ტელეფონსა და ფოტოს. ადგილები მხოლოდ თექვსმეტია, ამიტომ ბადე სწრაფად ივსება.',
    },
    sportId: 'padel',
    universityId: 'btu',
    publishedAt: '2026-10-20T12:00:00+04:00',
    isAnnouncement: true,
    readMinutes: 2,
    imageUrl: '/gallery/padel-3.webp',
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
      ka: 'ყველა ბილეთი კარის გაღებამდე გაიყიდა, ცამეტი კი დილის ექვს საათამდე სავსე იყო.',
    },
    body: {
      en: 'The students’ welcome party filled Tsameti on 11 October and sold out before the night began. TOBIASS opened at half nine, TAMTA took midnight to two, and LOMJ carried it through to six. Thanks to everyone who came — the next one is already being planned, and it will be announced here first.',
      ka: 'სტუდენტების ველქამ ფართმა 11 ოქტომბერს ცამეტი აავსო და ბილეთები ღამის დაწყებამდე გაიყიდა. TOBIASS ცხრანახევარზე გაუშვა, TAMTA შუაღამიდან ორამდე დადგა, LOMJ-მა კი ექვსამდე მიიყვანა. მადლობა ყველას, ვინც მოხვედით — შემდეგი უკვე იგეგმება და პირველად აქ გამოცხადდება.',
    },
    sportId: null,
    universityId: 'btu',
    publishedAt: '2026-10-12T14:00:00+04:00',
    isAnnouncement: false,
    readMinutes: 2,
    imageUrl: '/events/welcome-party-2026.webp',
  },
]
