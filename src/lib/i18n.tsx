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

  'hero.eyebrow': { en: 'Student sport', ka: 'სტუდენტური სპორტი' },
  'hero.titleLead': { en: 'Every university,', ka: 'ყველა უნივერსიტეტი' },
  'hero.titleMark': { en: 'in one place.', ka: 'ერთ სივრცეში.' },
  'padel.aboutEyebrow': { en: 'The challenge', ka: 'გამოწვევა' },
  'padel.aboutLead': {
    en: 'Step onto the court and prove that',
    ka: 'გამოდი კორტზე და დაამტკიცე, რომ',
  },
  'padel.aboutHighlight': { en: 'you are the best', ka: 'საუკეთესო შენ ხარ' },
  'padel.title': { en: 'Padel tournament', ka: 'პადელის ტურნირი' },
  'padel.placesLeft': { en: 'Places left', ka: 'თავისუფალი ადგილი' },
  'padel.openTournaments': { en: 'Open for entry', ka: 'ღია რეგისტრაციით' },
  'padel.totalPlaces': { en: 'Places in total', ka: 'ადგილი სულ' },
  'hero.ctaRegister': { en: 'Register for a tournament', ka: 'დარეგისტრირდი ტურნირზე' },

  'unite.eyebrow': { en: 'Our mission', ka: 'ჩვენი მისია' },
  'unite.titleLead': { en: 'Bringing students', ka: 'სტუდენტების' },
  'unite.titleMark': { en: 'together', ka: 'გაერთიანება' },
  'unite.titleTail': {
    en: 'beyond the lecture hall',
    ka: 'ლექციების მიღმა',
  },
  'unite.body': {
    en: 'Our main goal is to bring students together — outside lectures and outside the university walls, through the right, healthy kind of activity.',
    ka: 'ჩვენი მთავარი მიზანი სტუდენტების გაერთიანებაა — ლექციებისა და აუდიტორიების მიღმა, ჯანსაღი და აქტიური ცხოვრების წესით.',
  },
  'unite.quote': {
    en: 'One match, one tournament and one night out are enough for a room full of strangers to start playing as a team.',
    ka: 'ერთი მატჩი, ერთი ტურნირი და ერთი საღამო საკმარისია იმისთვის, რომ სტუდენტები ერთმანეთს გაეცნონ და გუნდად შეიკრან.',
  },
  'about.foundedLabel': { en: 'Founded in:', ka: 'დაარსდა:' },
  'about.eyebrow': { en: 'About us', ka: 'ჩვენ შესახებ' },
  'about.title': {
    en: 'What brings us together is more than a university.',
    ka: 'ის, რაც გვაერთიანებს, მხოლოდ უნივერსიტეტი არ არის.',
  },
  'about.body': {
    en: 'It started with weekend matches between friends and grew into a community where beginners and seasoned players share the same court.',
    ka: 'ყველაფერი მეგობრებს შორის შაბათ-კვირის მატჩებით დაიწყო და საზოგადოებად გადაიზარდა, სადაც დამწყებიც და გამოცდილი მოთამაშეც ერთსა და იმავე მოედანზე დგება.',
  },
  'cta.title': {
    en: 'Ready to step onto the court?',
    ka: 'მზად ხარ კორტზე გამოსვლისთვის?',
  },
  'cta.body': {
    en: 'Enter as a pair, play the weekend, and settle it on court.',
    ka: 'დარეგისტრირდი წყვილად, ითამაშე შაბათ-კვირას და კორტზე გაარკვიე ყველაფერი.',
  },
  'cta.button': { en: 'Register', ka: 'დარეგისტრირდი' },
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
  'filter.saved': { en: 'Saved — the site now opens on your university.', ka: 'შენახულია — საიტი ახლა შენს უნივერსიტეტზე იხსნება.' },

  'tab.tournaments': { en: 'Tournaments', ka: 'ტურნირები' },
  'tab.open': { en: 'Open now', ka: 'ღიაა ახლა' },
  'tab.news': { en: 'News', ka: 'სიახლეები' },
  'tab.events': { en: 'Events', ka: 'ივენთები' },

  'section.openNow': { en: 'Open for registration', ka: 'ღია რეგისტრაციით' },
  'section.tournaments': { en: 'Tournaments', ka: 'ტურნირები' },
  'section.events': { en: 'Events & parties', ka: 'ივენთები და წვეულებები' },
  'section.upcomingEvents': { en: 'Coming up', ka: 'მომავალი' },
  'section.pastEvents': { en: 'Already held', ka: 'ჩატარებული' },
  'event.past': { en: 'Already held', ka: 'ჩატარდა' },
  'event.lineup': { en: 'Line-up', ka: 'ლაინაპი' },
  'event.noneUpcoming': {
    en: 'Nothing announced yet. The next one lands here first.',
    ka: 'ჯერ არაფერია გამოცხადებული. მომდევნო სწორედ აქ გამოჩნდება პირველად.',
  },
  'section.news': { en: 'News & announcements', ka: 'სიახლეები და განცხადებები' },
  'addUni.lead': {
    en: 'To add your university, call',
    ka: 'უნივერსიტეტის დასამატებლად დარეკეთ',
  },
  'section.universities': { en: 'Universities on the hub', ka: 'უნივერსიტეტები ჰაბზე' },
  'section.howToJoin': { en: 'How to join', ka: 'როგორ შემოუერთდე' },
  'section.latest': { en: 'Latest', ka: 'უახლესი' },
  'section.mustRead': { en: 'Must read', ka: 'აუცილებლად წასაკითხი' },
  'section.fromCampus': { en: 'From the universities', ka: 'უნივერსიტეტებიდან' },
  'news.keyDates': { en: 'Key dates', ka: 'მნიშვნელოვანი თარიღები' },

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
  'social.eventsTitle': { en: 'Bitiuelebis Events', ka: 'ბითიუელების ივენთები' },
  'social.eventsBody': {
    en: 'Posters, line-ups and photos from every party.',
    ka: 'პოსტერები, ლაინაპები და ფოტოები ყოველი წვეულებიდან.',
  },

  'groups.lede': {
    en: 'Five groups, five places in each. The draw is announced before the season starts.',
    ka: 'ხუთი ჯგუფი, თითოეულში ხუთი ადგილი. წილისყრა სეზონის დაწყებამდე გამოცხადდება.',
  },
  'groups.teams': { en: 'teams', ka: 'გუნდი' },
  'groups.places': { en: 'places', ka: 'ადგილი' },
  'groups.placeholderTeam': { en: 'Team name', ka: 'გუნდის სახელი' },

  'allstar.bench': { en: 'Substitutes', ka: 'სათადარიგო' },
  'allstar.invite': {
    en: 'Enter the tournament and you have a shot at next season’s All-Star XI.',
    ka: 'მიიღე ტურნირში მონაწილეობა და მომავალი სეზონის ALLSTAR შემადგენლობაში მოხვედრის შანსი გექნება.',
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
    ka: 'მიეცი ხმა შენი ჯგუფის საუკეთესო მოთამაშეს და დაეხმარე გამარჯვებულის გამოვლენას.',
  },
  'vote.cta': { en: 'Vote', ka: 'მიეცი ხმა' },
  'vote.placeholderName': { en: 'Name Surname', ka: 'სახელი და გვარი' },
  'vote.leader': { en: 'Leading', ka: 'ლიდერობს' },
  'vote.noLeader': { en: 'No votes yet', ka: 'ხმა ჯერ არავის მიუღია' },
  'vote.pending': {
    en: 'Nominees are announced before each round.',
    ka: 'კანდიდატები ყოველი ტურის წინ ცხადდება.',
  },
  'vote.voted': { en: 'Voted', ka: 'ხმა მიცემულია' },
  'vote.thanks': { en: 'Thanks — your vote is counted.', ka: 'მადლობა — შენი ხმა დაფიქსირდა.' },
  'vote.total': { en: 'votes', ka: 'ხმა' },
  'vote.localOnly': {
    en: 'Counted in this browser only until Supabase is connected.',
    ka: 'ხმა მხოლოდ ამ ბრაუზერში ითვლება, სანამ Supabase დაკავშირებული არ იქნება.',
  },

  'status.registration_open': { en: 'Registration open', ka: 'რეგისტრაცია ღიაა' },
  'status.upcoming': { en: 'Upcoming', ka: 'მომავალი' },
  'status.ongoing': { en: 'Ongoing', ka: 'მიმდინარე' },
  'status.finished': { en: 'Finished', ka: 'დასრულებული' },

  'level.beginner': { en: 'Beginner', ka: 'დამწყები' },
  'level.intermediate': { en: 'Intermediate', ka: 'საშუალო' },
  'level.advanced': { en: 'Advanced', ka: 'გამოცდილი' },
  'level.amateur': { en: 'Amateur level', ka: 'მოყვარულთა დონე' },
  'level.open': { en: 'All levels', ka: 'ყველა დონე' },

  'kind.party': { en: 'Party', ka: 'წვეულება' },
  'kind.ceremony': { en: 'Ceremony', ka: 'ცერემონია' },
  'kind.social': { en: 'Social', ka: 'შეკრება' },

  'label.announcement': { en: 'Announcement', ka: 'განცხადება' },
  'label.host': { en: 'Hosted by', ka: 'მასპინძელი' },
  'label.openToAll': { en: 'Open to all universities', ka: 'ღიაა ყველა უნივერსიტეტისთვის' },
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
    en: 'No tournaments are open to your university right now. Try another one, or check back soon.',
    ka: 'ამჟამად შენი უნივერსიტეტისთვის ღია ტურნირი არ არის. სცადე სხვა უნივერსიტეტი ან მოგვიანებით შემოიარე.',
  },
  'reg.fullName': { en: 'Full name', ka: 'სახელი და გვარი' },
  'reg.email': { en: 'Email', ka: 'ელფოსტა' },
  'reg.phone': { en: 'Phone', ka: 'ტელეფონი' },
  'reg.level': { en: 'Your level', ka: 'შენი დონე' },
  'reg.partner': { en: 'Partner name', ka: 'პარტნიორის სახელი' },
  'reg.partnerHint': { en: 'Leave empty and we will pair you up', ka: 'დატოვე ცარიელი და პარტნიორს ჩვენ შეგირჩევთ' },
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
    ka: 'PNG ან JPG. საუკეთესოდ კვადრატული სურათი გამოიყურება.',
  },
  'reg.contact': { en: 'Captain’s contact', ka: 'კაპიტნის საკონტაქტო' },
  'reg.squad': { en: 'Squad', ka: 'შემადგენლობა' },
  'reg.soloEntry': { en: 'Your details', ka: 'შენი მონაცემები' },
  'reg.soloHint': {
    en: 'A solo tournament — you enter on your own.',
    ka: 'სოლო ტურნირია — ცალკე რეგისტრირდები.',
  },
  'reg.squadRange': { en: 'players', ka: 'მოთამაშე' },
  'reg.player': { en: 'Player', ka: 'მოთამაშე' },
  'reg.firstName': { en: 'First name', ka: 'სახელი' },
  'reg.lastName': { en: 'Last name', ka: 'გვარი' },
  'reg.playerPhoto': { en: 'Photo', ka: 'ფოტო' },
  'reg.addPlayer': { en: 'Add player', ka: 'მოთამაშის დამატება' },
  'reg.removePlayer': { en: 'Remove', ka: 'წაშლა' },
  'reg.chooseFile': { en: 'Choose image', ka: 'აირჩიე სურათი' },
  'reg.changeFile': { en: 'Change', ka: 'შეცვლა' },
  'valid.email': {
    en: 'This does not look like an email — it needs an @ and a domain.',
    ka: 'ეს ელფოსტას არ ჰგავს — სჭირდება @ და დომენი.',
  },
  'valid.phone': {
    en: 'A Georgian number is nine digits — for example 5XX XX XX XX.',
    ka: 'ქართული ნომერი ცხრა ციფრია — მაგალითად 5XX XX XX XX.',
  },
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
    en: 'The exact amount is set once registration closes and depends on how many teams enter.',
    ka: 'ზუსტი თანხა რეგისტრაციის დასრულების შემდეგ დაფიქსირდება და დამოკიდებულია დარეგისტრირებული გუნდების რაოდენობაზე.',
  },
  'prize.noteSolo': {
    en: 'The exact amount is set once registration closes and depends on how many players enter.',
    ka: 'ზუსტი თანხა რეგისტრაციის დასრულების შემდეგ დაფიქსირდება და დამოკიდებულია დარეგისტრირებული მონაწილეების რაოდენობაზე.',
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
  'section.schedule': { en: 'Order of play', ka: 'თამაშების განრიგი' },
  'schedule.court': { en: 'Court', ka: 'კორტი' },
  'rules.lede': {
    en: 'The federation’s official regulations.',
    ka: 'ფედერაციის ოფიციალური რეგლამენტი.',
  },
  'rules.duration': { en: 'Match length', ka: 'მატჩის ხანგრძლივობა' },
  'rules.minutes': { en: 'min', ka: 'წთ' },

  'join.step1': { en: 'Pick your university', ka: 'აირჩიე შენი უნივერსიტეტი' },
  'join.step1Body': {
    en: 'One tap and the whole site narrows down to your university.',
    ka: 'ერთი შეხებით მთელი საიტი შენს უნივერსიტეტზე გაიფილტრება.',
  },
  'join.step2': { en: 'Find a tournament', ka: 'იპოვე ტურნირი' },
  'join.step2Body': {
    en: 'Padel cups and the football league, with the places left shown up front.',
    ka: 'პადელის თასი და ფეხბურთის ლიგა — დარჩენილი ადგილები თავიდანვე ჩანს.',
  },
  'join.step3': { en: 'Register in a minute', ka: 'დარეგისტრირდი წუთში' },
  'join.step3Body': {
    en: 'Name, surname, email and a photo for every player in the squad.',
    ka: 'სახელი, გვარი, ელფოსტა და ფოტო შემადგენლობის ყოველი წევრისთვის.',
  },
  'join.step4': { en: 'Turn up and play', ka: 'მოდი და ითამაშე' },
  'join.step4Body': {
    en: 'The schedule lands in your inbox before the first match.',
    ka: 'განრიგი პირველ მატჩამდე შენს ელფოსტაზე მოვა.',
  },

  'empty.title': { en: 'Nothing here yet', ka: 'ჯერ აქ არაფერია' },
  'empty.body': {
    en: 'Try another university, or check back once the next announcement is published.',
    ka: 'სცადე სხვა უნივერსიტეტი ან მომდევნო განცხადების გამოქვეყნების შემდეგ შემოიარე.',
  },

  'footer.tagline': {
    en: 'Student sport from every university, in one place.',
    ka: 'სტუდენტური სპორტი ყველა უნივერსიტეტიდან — ერთ სივრცეში.',
  },
  'footer.rights': { en: 'All rights reserved.', ka: 'ყველა უფლება დაცულია.' },
  'footer.dataNotice': {
    en: 'Running on seed data — connect Supabase to go live.',
    ka: 'მუშაობს სატესტო მონაცემებზე — დააკავშირე Supabase გასაშვებად.',
  },

  'cookie.title': {
    en: 'Cookies on this site',
    ka: 'ქუქი-ფაილები ამ საიტზე',
  },
  'cookie.body': {
    en: 'We keep a little data in your browser so the site remembers your choices. Accept and we may also use it to improve the site.',
    ka: 'საიტი მცირე მონაცემებს ინახავს შენს ბრაუზერში, რომ შენი არჩევანი დაიმახსოვროს. თანხმობით ამ მონაცემებს საიტის გასაუმჯობესებლადაც გამოვიყენებთ.',
  },
  'cookie.accept': { en: 'Accept', ka: 'ვეთანხმები' },
  'cookie.essential': { en: 'Essential only', ka: 'მხოლოდ აუცილებელი' },

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
