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
    id: 'btu-padel-cup-open',
    slug: 'btu-padel-cup-registration-open',
    title: {
      en: 'BTU Padel Cup registration is open',
      ka: 'BTU-ს პადელის თასზე რეგისტრაცია გახსნილია',
    },
    excerpt: {
      en: 'Eighteen of thirty-two places are already taken. Entries close on 10 November.',
      ka: 'ოცდათორმეტიდან თვრამეტი ადგილი უკვე დაკავებულია. რეგისტრაცია 10 ნოემბერს იხურება.',
    },
    body: {
      en: 'BTU opens its autumn padel cup to students from every campus on the hub. The draw is mixed doubles, with a Saturday group stage across four courts and the knockout rounds on Sunday. Entry is 40 GEL per player and includes court time, balls and a shirt. Pick your university on the registration form so the organisers can seed the groups fairly.',
      ka: 'BTU შემოდგომის პადელის თასს ხსნის ჰაბზე წარმოდგენილი ყველა კამპუსის სტუდენტისთვის. ბადე შერეული წყვილებისაა: შაბათს ჯგუფური ეტაპი ოთხ კორტზე, კვირას კი ნოკაუტი. მონაწილეობის საფასური მოთამაშეზე 40 ლარია და მოიცავს კორტის დროს, ბურთებს და მაისურს. რეგისტრაციისას მიუთითე შენი უნივერსიტეტი, რომ ორგანიზატორებმა ჯგუფები სამართლიანად დათესონ.',
    },
    sportId: 'padel',
    universityId: 'btu',
    publishedAt: '2026-10-22T10:00:00+04:00',
    isAnnouncement: true,
    readMinutes: 2,
    imageUrl: null,
  },
  {
    id: 'new-padel-courts',
    slug: 'two-new-padel-courts-open-at-saburtalo',
    title: {
      en: 'Two new padel courts open at Saburtalo',
      ka: 'საბურთალოზე ორი ახალი პადელის კორტი გაიხსნა',
    },
    excerpt: {
      en: 'Weekday mornings are free for students with a university ID from November.',
      ka: 'ნოემბრიდან სამუშაო დღეების დილის საათები უფასოა სტუდენტური ბარათის მქონეთათვის.',
    },
    body: {
      en: 'Padel Park Saburtalo has added two covered courts, taking the venue to six. Free weekday morning slots between 08:00 and 12:00 have been agreed for students holding a university ID, bookable through each campus sports office. The extra capacity is what allows the BTU cup to run four courts in parallel next month.',
      ka: 'პადელ პარკ საბურთალოს დაემატა ორი დახურული კორტი და ობიექტზე ჯამში ექვსი გახდა. სამუშაო დღეებში 08:00-დან 12:00-მდე უფასო სლოტები შეთანხმდა სტუდენტური ბარათის მქონე სტუდენტებისთვის, დაჯავშნა კი თითოეული კამპუსის სპორტის ოფისის მეშვეობითაა შესაძლებელი. სწორედ დამატებული სიმძლავრე იძლევა იმის საშუალებას, რომ BTU-ს თასმა მომავალ თვეში ოთხი კორტი პარალელურად გამოიყენოს.',
    },
    sportId: 'padel',
    universityId: null,
    publishedAt: '2026-10-20T09:00:00+04:00',
    isAnnouncement: true,
    readMinutes: 3,
    imageUrl: null,
  },
  {
    id: 'hub-expansion',
    slug: 'two-more-universities-join-the-hub',
    title: {
      en: 'BTU is first — more universities to follow',
      ka: 'BTU პირველია — სხვა უნივერსიტეტებიც შემოგვიერთდებიან',
    },
    excerpt: {
      en: 'The hub launches with BTU. Other campuses join as soon as their federations sign up.',
      ka: 'ჰაბი BTU-თი იწყებს. სხვა კამპუსები შემოუერთდებიან, როგორც კი მათი ფედერაციები დაადასტურებენ.',
    },
    body: {
      en: 'The hub opens with the Business and Technology University, whose football federation publishes its league, groups, All-Star XI and champions here. Each campus keeps control of what it publishes — its own tournaments, its own registration deadlines, its own announcements — and students filter the site down to whichever universities they care about. Talks with other federations are under way.',
      ka: 'ჰაბი იხსნება ბიზნესისა და ტექნოლოგიების უნივერსიტეტით, რომლის ფეხბურთის ფედერაციაც აქ აქვეყნებს თავის ლიგას, ჯგუფებს, ALLSTAR შემადგენლობასა და ჩემპიონებს. თითოეული კამპუსი თავად აკონტროლებს, რას აქვეყნებს — საკუთარ ტურნირებს, საკუთარ ვადებს, საკუთარ განცხადებებს — სტუდენტები კი საიტს იმ უნივერსიტეტებზე ფილტრავენ, რომლებიც მათ აინტერესებთ. სხვა ფედერაციებთან მოლაპარაკებები მიმდინარეობს.',
    },
    sportId: null,
    universityId: null,
    publishedAt: '2026-10-14T11:00:00+04:00',
    isAnnouncement: true,
    readMinutes: 2,
    imageUrl: null,
  },
]
