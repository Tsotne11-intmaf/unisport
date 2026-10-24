import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import type { Lang, Localized } from '@/types'

const dictionary = {
  'nav.home': { en: 'Home', ka: 'მთავარი' },
  'nav.padel': { en: 'Padel', ka: 'პადელი' },
  'nav.football': { en: 'Football', ka: 'ფეხბურთი' },
  'nav.events': { en: 'Events', ka: 'ივენთები' },
  'nav.news': { en: 'News', ka: 'სიახლეები' },
  'nav.universities': { en: 'Universities', ka: 'უნივერსიტეტები' },
  'nav.register': { en: 'Register', ka: 'რეგისტრაცია' },
  'nav.menu': { en: 'Menu', ka: 'მენიუ' },

  'hero.eyebrow': { en: 'Student sport, all campuses', ka: 'სტუდენტური სპორტი, ყველა კამპუსი' },
  'hero.title': {
    en: 'Every university’s sport, in one place.',
    ka: 'ყველა უნივერსიტეტის სპორტი ერთ სივრცეში.',
  },
  'hero.lede': {
    en: 'Padel cups, futsal tournaments, parties and announcements from universities across Tbilisi. Pick your campus and the whole site follows you.',
    ka: 'პადელის თასები, ფუტსალის ტურნირები, წვეულებები და განცხადებები თბილისის უნივერსიტეტებიდან. აირჩიე შენი კამპუსი და მთელი საიტი მოგყვება.',
  },
  'hero.ctaPadel': { en: 'Padel', ka: 'პადელი' },
  'padel.aboutEyebrow': { en: 'About', ka: 'ჩვენ შესახებ' },
  'padel.about': {
    en: 'UniSport brings students, pairs and campus courts together in one place, where every padel tournament starts.',
    ka: 'UniSport ერთ სივრცეში კრებს სტუდენტებს, წყვილებსა და კამპუსის კორტებს — სწორედ აქ იწყება პადელის ყოველი ტურნირი.',
  },
  'padel.photoLabel': { en: 'On the campus courts', ka: 'კამპუსის კორტებზე' },
  'padel.placesLeft': { en: 'Places left', ka: 'თავისუფალი ადგილი' },
  'padel.openTournaments': { en: 'Open for entry', ka: 'ღია რეგისტრაციით' },
  'padel.totalPlaces': { en: 'Places in total', ka: 'ადგილი სულ' },
  'padel.lede': {
    en: 'Cups and open draws on the campus courts. Enter as a pair and play the weekend.',
    ka: 'თასები და ღია ბადეები კამპუსის კორტებზე. დარეგისტრირდი წყვილად და ითამაშე შაბათ-კვირას.',
  },
  'hero.ctaFootball': { en: 'Football', ka: 'ფეხბურთი' },
  'hero.ctaRegister': { en: 'Register for a tournament', ka: 'დარეგისტრირდი ტურნირზე' },

  'stat.universities': { en: 'Universities', ka: 'უნივერსიტეტი' },
  'stat.tournaments': { en: 'Tournaments listed', ka: 'ტურნირი სიაში' },
  'stat.open': { en: 'Open for registration', ka: 'ღია რეგისტრაციით' },
  'stat.events': { en: 'Events this term', ka: 'ივენთი სემესტრში' },

  'filter.university': { en: 'Filter by university', ka: 'გაფილტრე უნივერსიტეტით' },
  'filter.all': { en: 'All universities', ka: 'ყველა უნივერსიტეტი' },
  'filter.sport': { en: 'Filter by sport', ka: 'გაფილტრე სპორტით' },
  'filter.allSports': { en: 'All sports', ka: 'ყველა სპორტი' },
  'filter.showing': { en: 'Showing', ka: 'ნაჩვენებია' },
  'filter.myUniversity': { en: 'My university', ka: 'ჩემი უნივერსიტეტი' },
  'filter.saved': { en: 'Saved — the site now opens on your campus.', ka: 'შენახულია — საიტი ახლა შენს კამპუსზე იხსნება.' },

  'tab.tournaments': { en: 'Tournaments', ka: 'ტურნირები' },
  'tab.open': { en: 'Open now', ka: 'ღიაა ახლა' },
  'tab.news': { en: 'News', ka: 'სიახლეები' },
  'tab.events': { en: 'Events', ka: 'ივენთები' },

  'section.openNow': { en: 'Open for registration', ka: 'ღია რეგისტრაციით' },
  'section.tournaments': { en: 'Tournaments', ka: 'ტურნირები' },
  'section.events': { en: 'Events & parties', ka: 'ივენთები და წვეულებები' },
  'section.news': { en: 'News & announcements', ka: 'სიახლეები და განცხადებები' },
  'section.universities': { en: 'Universities on the hub', ka: 'უნივერსიტეტები ჰაბზე' },
  'section.howToJoin': { en: 'How to join', ka: 'როგორ შემოუერთდე' },
  'section.latest': { en: 'Latest', ka: 'უახლესი' },
  'section.mustRead': { en: 'Must read', ka: 'აუცილებლად წასაკითხი' },
  'section.fromCampus': { en: 'From the campuses', ka: 'კამპუსებიდან' },

  'section.pickUniversity': { en: 'Choose a university', ka: 'აირჩიე უნივერსიტეტი' },
  'section.groups': { en: 'Tournament groups', ka: 'ტურნირის ჯგუფები' },
  'section.allstar': { en: 'All-Star XI', ka: 'ALLSTAR შემადგენლობა' },
  'section.winners': { en: 'Winner teams', ka: 'გამარჯვებული გუნდები' },
  'section.vote': { en: 'Player of the week', ka: 'კვირის საუკეთესო მოთამაშე' },
  'section.gallery': { en: 'From the pitch', ka: 'მოედნიდან' },
  'gallery.eyebrow': { en: 'Photos', ka: 'ფოტოები' },

  'gallery.lede': {
    en: 'Shots from this season’s matchdays.',
    ka: 'კადრები ამ სეზონის ტურებიდან.',
  },
  'social.title': {
    en: 'BTU Football Federation',
    ka: 'BTU-ს ფეხბურთის ფედერაცია',
  },
  'social.body': {
    en: 'Fixtures, results, line-ups and photos from every matchday.',
    ka: 'მატჩები, შედეგები, შემადგენლობები და ფოტოები ყოველი ტურიდან.',
  },
  'social.cta': { en: 'Follow on Instagram', ka: 'გამოგვყევი Instagram-ზე' },

  'groups.lede': {
    en: 'Five groups, five places in each. The draw is announced before the season starts.',
    ka: 'ხუთი ჯგუფი, თითოში ხუთი ადგილი. ბადე სეზონის დაწყებამდე გამოცხადდება.',
  },
  'groups.teams': { en: 'teams', ka: 'გუნდი' },
  'groups.places': { en: 'places', ka: 'ადგილი' },
  'groups.placeholderTeam': { en: 'Team name', ka: 'გუნდის სახელი' },

  'allstar.bench': { en: 'Substitutes', ka: 'სათადარიგო' },
  'allstar.invite': {
    en: 'Enter the tournament and you have a shot at next season’s All-Star XI.',
    ka: 'მიიღე მონაწილეობა ტურნირში და შანსი გექნება მომავალი სეზონის ALLSTAR შემადგენლობაში მოხვდე.',
  },
  'allstar.inviteCta': { en: 'Enter now', ka: 'დარეგისტრირდი' },

  'role.gk': { en: 'Goalkeeper', ka: 'მეკარე' },
  'role.defender': { en: 'Defender', ka: 'მცველი' },
  'role.midfielder': { en: 'Midfielder', ka: 'ნახევარმცველი' },
  'role.striker': { en: 'Striker', ka: 'თავდამსხმელი' },

  'label.captain': { en: 'Captain', ka: 'კაპიტანი' },
  'label.titles': { en: 'Titles', ka: 'ტიტული' },
  'label.first': { en: '1st', ka: 'I ადგილი' },
  'label.second': { en: '2nd', ka: 'II ადგილი' },
  'label.third': { en: '3rd', ka: 'III ადგილი' },

  'table.club': { en: 'Club', ka: 'კლუბი' },
  'table.played': { en: 'P', ka: 'თ' },
  'table.won': { en: 'W', ka: 'მ' },
  'table.drawn': { en: 'D', ka: 'ფ' },
  'table.lost': { en: 'L', ka: 'წ' },
  'table.points': { en: 'PTS', ka: 'ქულა' },

  'vote.lede': {
    en: 'Vote for your group’s best player and help decide who takes the award.',
    ka: 'მიეცი ხმა ჯგუფის საუკეთესო მოთამაშეს და დაგვეხმარე ჯილდოს პრიზიორის გამოვლენაში.',
  },
  'vote.cta': { en: 'Vote', ka: 'მიეცი ხმა' },
  'vote.placeholderName': { en: 'Name Surname', ka: 'სახელი და გვარი' },
  'vote.leader': { en: 'Leading', ka: 'ლიდერობს' },
  'vote.noLeader': { en: 'No votes yet', ka: 'ხმები ჯერ არ არის' },
  'vote.pending': {
    en: 'Nominees are announced before each round.',
    ka: 'კანდიდატები ყოველი ტურის წინ ცხადდება.',
  },
  'vote.voted': { en: 'Voted', ka: 'ხმა მიცემულია' },
  'vote.thanks': { en: 'Thanks — your vote is counted.', ka: 'მადლობა — შენი ხმა დაფიქსირდა.' },
  'vote.total': { en: 'votes', ka: 'ხმა' },
  'vote.localOnly': {
    en: 'Counted in this browser only until Supabase is connected.',
    ka: 'ითვლება მხოლოდ ამ ბრაუზერში, სანამ Supabase არ დაუკავშირდება.',
  },

  'status.registration_open': { en: 'Registration open', ka: 'რეგისტრაცია ღიაა' },
  'status.upcoming': { en: 'Upcoming', ka: 'მომავალი' },
  'status.ongoing': { en: 'Ongoing', ka: 'მიმდინარე' },
  'status.finished': { en: 'Finished', ka: 'დასრულებული' },

  'level.beginner': { en: 'Beginner', ka: 'დამწყები' },
  'level.intermediate': { en: 'Intermediate', ka: 'საშუალო' },
  'level.advanced': { en: 'Advanced', ka: 'გამოცდილი' },
  'level.open': { en: 'All levels', ka: 'ყველა დონე' },

  'kind.party': { en: 'Party', ka: 'წვეულება' },
  'kind.ceremony': { en: 'Ceremony', ka: 'ცერემონია' },
  'kind.social': { en: 'Social', ka: 'შეკრება' },

  'label.announcement': { en: 'Announcement', ka: 'განცხადება' },
  'label.host': { en: 'Hosted by', ka: 'მასპინძელი' },
  'label.openToAll': { en: 'Open to all campuses', ka: 'ღიაა ყველა კამპუსისთვის' },
  'label.format': { en: 'Format', ka: 'ფორმატი' },
  'label.venue': { en: 'Venue', ka: 'ადგილი' },
  'label.dates': { en: 'Dates', ka: 'თარიღები' },
  'label.level': { en: 'Level', ka: 'დონე' },
  'label.fee': { en: 'Entry', ka: 'მონაწილეობა' },
  'label.free': { en: 'Free', ka: 'უფასო' },
  'label.placesLeft': { en: 'places left', ka: 'ადგილი დარჩა' },
  'label.full': { en: 'Full', ka: 'ადგილები ამოიწურა' },
  'label.deadline': { en: 'Entries close', ka: 'რეგისტრაცია იხურება' },
  'label.minRead': { en: 'min read', ka: 'წთ საკითხავი' },

  'action.viewAll': { en: 'View all', ka: 'ყველას ნახვა' },
  'action.readMore': { en: 'Read more', ka: 'ვრცლად' },
  'action.tickets': { en: 'Get tickets', ka: 'ბილეთები' },
  'action.register': { en: 'Register', ka: 'რეგისტრაცია' },
  'action.registerFor': { en: 'Register for this', ka: 'დარეგისტრირდი' },
  'action.back': { en: 'Back', ka: 'უკან' },

  'reg.title': { en: 'Tournament registration', ka: 'ტურნირზე რეგისტრაცია' },
  'reg.lede': {
    en: 'Start by telling us which university you are from — we will only show the tournaments you can enter.',
    ka: 'დასაწყისისთვის მიუთითე, რომელი უნივერსიტეტიდან ხარ — მხოლოდ იმ ტურნირებს გაჩვენებთ, რომლებზეც შეგიძლია განაცხადის შეტანა.',
  },
  'reg.step1': { en: 'Your university', ka: 'შენი უნივერსიტეტი' },
  'reg.step2': { en: 'Pick a tournament', ka: 'აირჩიე ტურნირი' },
  'reg.step3': { en: 'Your details', ka: 'შენი მონაცემები' },
  'reg.chooseUniversity': { en: 'Choose your university to continue', ka: 'გასაგრძელებლად აირჩიე უნივერსიტეტი' },
  'reg.noTournaments': {
    en: 'No tournaments are open to your campus right now. Try another university or check back soon.',
    ka: 'ამჟამად შენი კამპუსისთვის ღია ტურნირები არ არის. სცადე სხვა უნივერსიტეტი ან შემოიარე მოგვიანებით.',
  },
  'reg.fullName': { en: 'Full name', ka: 'სახელი და გვარი' },
  'reg.email': { en: 'Email', ka: 'ელფოსტა' },
  'reg.phone': { en: 'Phone', ka: 'ტელეფონი' },
  'reg.level': { en: 'Your level', ka: 'შენი დონე' },
  'reg.partner': { en: 'Partner name', ka: 'პარტნიორის სახელი' },
  'reg.partnerHint': { en: 'Leave empty and we will pair you up', ka: 'დატოვე ცარიელი და წყვილს ჩვენ შეგირჩევთ' },
  'reg.notes': { en: 'Anything else?', ka: 'სხვა რამე?' },
  'reg.submit': { en: 'Send registration', ka: 'რეგისტრაციის გაგზავნა' },
  'reg.sending': { en: 'Sending…', ka: 'იგზავნება…' },
  'reg.successTitle': { en: 'You are in', ka: 'შენ დარეგისტრირდი' },
  'reg.successBody': {
    en: 'The organisers have your details and will email you the schedule before the first match.',
    ka: 'ორგანიზატორებს შენი მონაცემები აქვთ და პირველ მატჩამდე განრიგს ელფოსტით გამოგიგზავნიან.',
  },
  'reg.successLocal': {
    en: 'Saved in this browser only — connect Supabase to receive entries for real.',
    ka: 'შენახულია მხოლოდ ამ ბრაუზერში — დააკავშირე Supabase, რომ განაცხადები ნამდვილად მიიღო.',
  },
  'reg.another': { en: 'Register someone else', ka: 'დაარეგისტრირე სხვა' },
  'reg.failed': { en: 'That did not send. Please try again.', ka: 'გაგზავნა ვერ მოხერხდა. სცადე თავიდან.' },

  'reg.teamName': { en: 'Team name', ka: 'გუნდის სახელი' },
  'reg.teamLogo': { en: 'Team crest', ka: 'გუნდის ლოგო' },
  'reg.logoHint': {
    en: 'PNG or JPG. A square image works best.',
    ka: 'PNG ან JPG. კვადრატული სურათი საუკეთესოდ გამოიყურება.',
  },
  'reg.contact': { en: 'Captain’s contact', ka: 'კაპიტნის საკონტაქტო' },
  'reg.squad': { en: 'Squad', ka: 'შემადგენლობა' },
  'reg.squadRange': { en: 'players', ka: 'მოთამაშე' },
  'reg.player': { en: 'Player', ka: 'მოთამაშე' },
  'reg.firstName': { en: 'First name', ka: 'სახელი' },
  'reg.lastName': { en: 'Last name', ka: 'გვარი' },
  'reg.playerPhoto': { en: 'Photo', ka: 'ფოტო' },
  'reg.addPlayer': { en: 'Add player', ka: 'მოთამაშის დამატება' },
  'reg.removePlayer': { en: 'Remove', ka: 'წაშლა' },
  'reg.chooseFile': { en: 'Choose image', ka: 'აირჩიე სურათი' },
  'reg.changeFile': { en: 'Change', ka: 'შეცვლა' },
  'reg.needMorePlayers': {
    en: 'Fill in every player before sending.',
    ka: 'გაგზავნამდე შეავსე ყველა მოთამაშის ველი.',
  },
  'reg.opensOn': { en: 'Entries open', ka: 'რეგისტრაცია იხსნება' },
  'reg.window': { en: 'Entry window', ka: 'რეგისტრაციის პერიოდი' },
  'reg.chooseAnother': { en: 'Pick a different tournament', ka: 'აირჩიე სხვა ტურნირი' },
  'reg.conditions': { en: 'Conditions', ka: 'პირობები' },
  'prize.label': { en: 'Prize pool', ka: 'მოსაგები ფონდი' },
  'prize.tbd': { en: 'To be announced', ka: 'დაზუსტდება' },
  'prize.afterEntries': { en: 'After entries close', ka: 'რეგისტრაციის შემდეგ' },
  'prize.title': { en: 'Prize pool', ka: 'მოსაგები ფონდი' },
  'prize.note': {
    en: 'The exact amount is set once team registration closes and depends on how many teams enter.',
    ka: 'ზუსტი თანხა გუნდების რეგისტრაციის დასრულების შემდეგ დაფიქსირდება და დამოკიდებულია მონაწილე გუნდების რაოდენობაზე.',
  },
  'reg.indexLede': {
    en: 'Each tournament has its own conditions. Pick one to read them and enter.',
    ka: 'თითოეულ ტურნირს თავისი პირობები აქვს. აირჩიე, წაიკითხე და დარეგისტრირდი.',
  },
  'reg.noneOpen': {
    en: 'No tournaments are open for registration right now.',
    ka: 'ამჟამად რეგისტრაციისთვის ღია ტურნირები არ არის.',
  },

  'section.rules': { en: 'Tournament rules', ka: 'ტურნირის წესები' },
  'rules.lede': {
    en: 'The federation’s official regulations.',
    ka: 'ფედერაციის ოფიციალური რეგლამენტი.',
  },
  'rules.duration': { en: 'Match length', ka: 'მატჩის ხანგრძლივობა' },
  'rules.minutes': { en: 'min', ka: 'წთ' },

  'join.step1': { en: 'Pick your university', ka: 'აირჩიე შენი უნივერსიტეტი' },
  'join.step1Body': {
    en: 'One tap and the hub filters down to your campus everywhere.',
    ka: 'ერთი შეხება და ჰაბი ყველგან შენს კამპუსზე იფილტრება.',
  },
  'join.step2': { en: 'Find a tournament', ka: 'იპოვე ტურნირი' },
  'join.step2Body': {
    en: 'Padel cups, beginner nights and futsal weekends, with places left shown up front.',
    ka: 'პადელის თასები, დამწყებთა საღამოები და ფუტსალის შაბათ-კვირები — დარჩენილი ადგილებით თვალსაჩინოდ.',
  },
  'join.step3': { en: 'Register in a minute', ka: 'დარეგისტრირდი წუთში' },
  'join.step3Body': {
    en: 'Name, email, level. Bring a partner or let the organisers pair you.',
    ka: 'სახელი, ელფოსტა, დონე. მოიყვანე პარტნიორი ან ორგანიზატორებს მიანდე შერჩევა.',
  },
  'join.step4': { en: 'Turn up and play', ka: 'მოდი და ითამაშე' },
  'join.step4Body': {
    en: 'The schedule lands in your inbox before the first match.',
    ka: 'განრიგი პირველ მატჩამდე შენს ელფოსტაზე მოვა.',
  },

  'empty.title': { en: 'Nothing here yet', ka: 'ჯერ აქ არაფერია' },
  'empty.body': {
    en: 'Try another university, or check back once the next announcement is published.',
    ka: 'სცადე სხვა უნივერსიტეტი ან შემოიარე მომდევნო განცხადების გამოქვეყნების შემდეგ.',
  },

  'footer.tagline': {
    en: 'Student sport from every campus, in one place.',
    ka: 'სტუდენტური სპორტი ყველა კამპუსიდან ერთ სივრცეში.',
  },
  'footer.rights': { en: 'All rights reserved.', ka: 'ყველა უფლება დაცულია.' },
  'footer.dataNotice': {
    en: 'Running on seed data — connect Supabase to go live.',
    ka: 'მუშაობს სატესტო მონაცემებზე — დააკავშირე Supabase გასაშვებად.',
  },

  'notFound.title': { en: 'Page not found', ka: 'გვერდი ვერ მოიძებნა' },
  'notFound.body': {
    en: 'That link has gone off the court. Head back to the home page.',
    ka: 'ეს ბმული კორტს გასცდა. დაბრუნდი მთავარ გვერდზე.',
  },
} satisfies Record<string, Localized>

export type TranslationKey = keyof typeof dictionary

interface I18nValue {
  lang: Lang
  setLang: (next: Lang) => void
  t: (key: TranslationKey) => string
  /** Read the active language off a Localized field. */
  l: (value: Localized | undefined) => string
}

const I18nContext = createContext<I18nValue | null>(null)

const STORAGE_KEY = 'campus-hub-lang'

function readStoredLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'ka') return stored
  } catch {
    // Private mode or blocked storage — fall through to the default.
  }
  return 'ka'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // Nothing to do — the choice just won't survive a reload.
    }
  }, [lang])

  const setLang = useCallback((next: Lang) => setLangState(next), [])

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang,
      t: (key) => dictionary[key][lang],
      l: (localized) => (localized ? localized[lang] : ''),
    }),
    [lang, setLang],
  )

  return <I18nContext value={value}>{children}</I18nContext>
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used inside <I18nProvider>')
  return value
}
