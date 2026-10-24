import type { Sport, University } from '@/types'

export const universities: University[] = [
  {
    id: 'btu',
    name: {
      en: 'Business and Technology University',
      ka: 'ბიზნესისა და ტექნოლოგიების უნივერსიტეტი',
    },
    shortName: 'BTU',
    city: { en: 'Tbilisi', ka: 'თბილისი' },
    color: '#ff2e7e',
  },
  {
    id: 'tsu',
    name: { en: 'Tbilisi State University', ka: 'თბილისის სახელმწიფო უნივერსიტეტი' },
    shortName: 'TSU',
    city: { en: 'Tbilisi', ka: 'თბილისი' },
    color: '#3f7dff',
  },
  {
    id: 'gtu',
    name: { en: 'Georgian Technical University', ka: 'საქართველოს ტექნიკური უნივერსიტეტი' },
    shortName: 'GTU',
    city: { en: 'Tbilisi', ka: 'თბილისი' },
    color: '#f2a516',
  },
  {
    id: 'cu',
    name: { en: 'Caucasus University', ka: 'კავკასიის უნივერსიტეტი' },
    shortName: 'CU',
    city: { en: 'Tbilisi', ka: 'თბილისი' },
    color: '#0f9d58',
  },
  {
    id: 'freeuni',
    name: { en: 'Free University of Tbilisi', ka: 'თავისუფალი უნივერსიტეტი' },
    shortName: 'FreeUni',
    city: { en: 'Tbilisi', ka: 'თბილისი' },
    color: '#00a39b',
  },
  {
    id: 'iliauni',
    name: { en: 'Ilia State University', ka: 'ილიას სახელმწიფო უნივერსიტეტი' },
    shortName: 'IliaUni',
    city: { en: 'Tbilisi', ka: 'თბილისი' },
    color: '#8b5cf6',
  },
  {
    id: 'gau',
    name: { en: 'Georgian American University', ka: 'საქართველოს ამერიკული უნივერსიტეტი' },
    shortName: 'GAU',
    city: { en: 'Tbilisi', ka: 'თბილისი' },
    color: '#ef6c25',
  },
  {
    id: 'agruni',
    name: { en: 'Agricultural University of Georgia', ka: 'საქართველოს აგრარული უნივერსიტეტი' },
    shortName: 'AgrUni',
    city: { en: 'Tbilisi', ka: 'თბილისი' },
    color: '#2f9e44',
  },
]

export const sports: Sport[] = [
  {
    id: 'padel',
    name: { en: 'Padel', ka: 'პადელი' },
    blurb: {
      en: 'Cups, ladders and beginner nights hosted across campus courts.',
      ka: 'თასები, კიბეები და დამწყებთა საღამოები კამპუსების კორტებზე.',
    },
  },
  {
    id: 'football',
    name: { en: 'Football', ka: 'ფეხბურთი' },
    blurb: {
      en: 'Futsal cups, faculty leagues and winter tournaments, university by university.',
      ka: 'ფუტსალის თასები, ფაკულტეტების ლიგები და ზამთრის ტურნირები უნივერსიტეტების მიხედვით.',
    },
  },
]
