import type { Lang } from '@/types'

/**
 * Dates are formatted by hand rather than through Intl's locale data: not every
 * browser build ships Georgian (`ka-GE` silently falls back to en-US, 12-hour
 * clock and all), and a league site cannot show "03:00 PM" to Georgian readers.
 *
 * Everything is rendered in Tbilisi time, so a 15:00 kick-off reads 15:00 no
 * matter where the page is opened.
 */
const TIME_ZONE = 'Asia/Tbilisi'

const monthsShort: Record<Lang, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  ka: ['იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ', 'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ'],
}

const partsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

interface DateParts {
  day: number
  monthIndex: number
  year: number
  hour: string
  minute: string
}

function partsOf(iso: string): DateParts {
  const found = partsFormatter.formatToParts(new Date(iso))
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    found.find((part) => part.type === type)?.value ?? '0'

  return {
    day: Number(get('day')),
    monthIndex: Number(get('month')) - 1,
    year: Number(get('year')),
    hour: get('hour').padStart(2, '0'),
    minute: get('minute').padStart(2, '0'),
  }
}

export function formatDayMonth(iso: string, lang: Lang): string {
  const { day, monthIndex } = partsOf(iso)
  return `${day} ${monthsShort[lang][monthIndex]}`
}

export function formatDate(iso: string, lang: Lang): string {
  const { year } = partsOf(iso)
  return `${formatDayMonth(iso, lang)} ${year}`
}

export function formatTime(iso: string): string {
  const { hour, minute } = partsOf(iso)
  return `${hour}:${minute}`
}

export function formatDateTime(iso: string, lang: Lang): string {
  return `${formatDayMonth(iso, lang)} · ${formatTime(iso)}`
}

export function formatRange(startIso: string, endIso: string, lang: Lang): string {
  return `${formatDayMonth(startIso, lang)} — ${formatDate(endIso, lang)}`
}
