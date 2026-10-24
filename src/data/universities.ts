import type { Sport, University } from '@/types'

/**
 * Only the universities that have actually agreed to be listed. BTU is the
 * first; add the next one here and every filter, picker and page picks it up.
 */
export const universities: University[] = [
  {
    id: 'btu',
    name: {
      en: 'Business and Technology University',
      ka: 'ბიზნესისა და ტექნოლოგიების უნივერსიტეტი',
    },
    shortName: 'BTU',
    city: { en: 'Tbilisi', ka: 'თბილისი' },
    color: '#c8102e',
    logoUrl: '/universities/btu.png',
    bannerUrl: '/banners/btu-campus.png',
  },
]

export const sports: Sport[] = [
  {
    id: 'padel',
    name: { en: 'Padel', ka: 'პადელი' },
    blurb: {
      en: 'Knockout cups for pairs, played over a weekend.',
      ka: 'ნოკაუტ თასები წყვილებისთვის, ერთი შაბათ-კვირის განმავლობაში.',
    },
  },
  {
    id: 'football',
    name: { en: 'Football', ka: 'ფეხბურთი' },
    blurb: {
      en: 'The federation league, its groups, its All-Star XI and its champions.',
      ka: 'ფედერაციის ლიგა, მისი ჯგუფები, ALLSTAR შემადგენლობა და ჩემპიონები.',
    },
  },
]
