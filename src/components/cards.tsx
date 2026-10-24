import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { useHub } from '@/data/HubProvider'
import { placesLeft } from '@/data/selectors'
import { formatDate, formatRange, formatTime } from '@/lib/format'
import { useI18n, type TranslationKey } from '@/lib/i18n'
import type { CampusEvent, NewsItem, Tournament } from '@/types'

import { Card, Media, Pill, UniversityChip } from './ui'

const statusKey: Record<Tournament['status'], TranslationKey> = {
  registration_open: 'status.registration_open',
  upcoming: 'status.upcoming',
  ongoing: 'status.ongoing',
  finished: 'status.finished',
}

const levelKey: Record<Tournament['level'], TranslationKey> = {
  beginner: 'level.beginner',
  intermediate: 'level.intermediate',
  advanced: 'level.advanced',
  open: 'level.open',
}

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  const { lang, t, l } = useI18n()
  const { universityById } = useHub()

  const host = universityById(tournament.hostUniversityId)
  const left = placesLeft(tournament)
  const open = tournament.status === 'registration_open'

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <Media
        src={tournament.imageUrl}
        alt={l(tournament.title)}
        kind={tournament.sportId}
        tint={host?.color}
        label={host?.shortName}
        focus={tournament.imageFocus ?? '50% 40%'}
        ratio="aspect-[16/9]"
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Pill variant={open ? 'accent' : 'outline'}>{t(statusKey[tournament.status])}</Pill>
          <Pill>{t(levelKey[tournament.level])}</Pill>
        </div>

        <h3 className="text-xl font-semibold">{l(tournament.title)}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate">
          {l(tournament.summary)}
        </p>

        <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 min-[360px]:grid-cols-[max-content_minmax(0,1fr)] min-[360px]:gap-y-1.5 text-sm">
          <Row label={t('label.format')} value={l(tournament.format)} />
          <Row
            label={t('label.dates')}
            value={formatRange(tournament.startDate, tournament.endDate, lang)}
          />
          <Row label={t('label.venue')} value={l(tournament.venue)} />
          <Row
            label={t('label.fee')}
            value={tournament.fee === null ? t('label.free') : `${tournament.fee} ₾`}
          />
        </dl>

        <div className="mt-5 flex items-center gap-2 border-t border-line pt-4">
          {host ? (
            <>
              <UniversityChip university={host} size="sm" />
              <span className="min-w-0 truncate text-xs font-semibold">{host.shortName}</span>
            </>
          ) : (
            <span className="truncate text-xs font-semibold text-slate">
              {t('label.openToAll')}
            </span>
          )}

          {left !== null && (
            <span className="ml-auto text-xs font-semibold text-slate">
              {left > 0 ? `${left} ${t('label.placesLeft')}` : t('label.full')}
            </span>
          )}
        </div>

        {open && (
          <Link
            to={`/register/${tournament.id}`}
            className="mt-4 rounded-pill bg-[var(--accent)] px-4 py-2.5 text-center text-sm font-semibold text-[var(--accent-ink)] transition-opacity hover:opacity-90"
          >
            {t('action.registerFor')} →
          </Link>
        )}
      </div>
    </Card>
  )
}

/* A two-column grid on the parent <dl> keeps every label aligned, whatever its
   length — Georgian labels run much longer than their English counterparts. */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-slate">{label}</dt>
      <dd className="min-w-0 font-medium">{value}</dd>
    </>
  )
}

const eventKey: Record<CampusEvent['kind'], TranslationKey> = {
  party: 'kind.party',
  ceremony: 'kind.ceremony',
  social: 'kind.social',
}

/** Poster on top, the practical details beneath, a ticket bar at the foot. */
export function EventCard({ event }: { event: CampusEvent }) {
  const { lang, t, l } = useI18n()
  const { universityById } = useHub()

  const host = universityById(event.universityId)
  const past = new Date(event.startsAt).getTime() < Date.now()

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-card border border-line bg-paper ${
        past ? 'opacity-90' : ''
      }`}
    >
      <div className="relative">
        <Media
          src={event.imageUrl}
          alt={l(event.title)}
          kind="event"
          tint={host?.color}
          label={host?.shortName}
          ratio="aspect-[4/5]"
        />
        {past && (
          <span className="absolute top-3 left-3 rounded-pill bg-ink/85 px-3 py-1.5 text-xs font-bold text-white">
            {t('event.past')}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg leading-snug font-bold">{l(event.title)}</h3>

        <div className="mt-3 flex flex-wrap gap-2">
          <Pill variant="soft">{t(eventKey[event.kind])}</Pill>
          {host && <Pill>{host.shortName}</Pill>}
        </div>

        <dl className="mt-4 space-y-2 text-sm">
          <Detail icon={<CalendarIcon />} value={formatDate(event.startsAt, lang)} />
          <Detail icon={<ClockIcon />} value={formatTime(event.startsAt)} />
          <Detail icon={<PinIcon />} value={`${l(event.venue)}, ${l(event.city)}`} />
        </dl>

        {event.lineup.length > 0 && (
          <div className="mt-4">
            <p className="text-[11px] font-bold tracking-wide text-slate uppercase">
              {t('event.lineup')}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {event.lineup.map((act) => (
                <span
                  key={act}
                  className="rounded-md bg-mist px-2 py-1 text-[11px] font-bold"
                >
                  {act}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="mt-4 flex-1 text-sm leading-relaxed text-slate">{l(event.summary)}</p>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line bg-[var(--accent-soft)] px-5 py-4">
        {past ? (
          <span className="text-sm font-semibold text-graphite">{t('event.past')}</span>
        ) : (
          <span className="text-sm font-semibold text-graphite">{t('action.tickets')}</span>
        )}
        {event.ticketUrl && (
          <a
            href={event.ticketUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-[var(--accent-ink)] transition-opacity hover:opacity-90"
            aria-label={t('action.tickets')}
          >
            <TicketIcon />
          </a>
        )}
      </div>
    </article>
  )
}

function Detail({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <dt className="shrink-0 text-slate">{icon}</dt>
      <dd className="min-w-0 leading-snug font-medium">{value}</dd>
    </div>
  )
}

const iconProps = {
  width: 15,
  height: 15,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

function CalendarIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M3 11h18" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg {...iconProps}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function TicketIcon() {
  return (
    <svg {...iconProps} width={16} height={16}>
      <path d="M3 9a2 2 0 0 0 0 6v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2a2 2 0 0 1 0-6V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z" />
      <path d="M13 5v14" strokeDasharray="2 2" />
    </svg>
  )
}

export function NewsCard({ item }: { item: NewsItem }) {
  const { lang, t, l } = useI18n()
  const { universityById, sportById } = useHub()

  const university = universityById(item.universityId)
  const sport = item.sportId ? sportById(item.sportId) : undefined

  return (
    <article className="group h-full overflow-hidden rounded-card border border-line bg-paper transition-colors hover:border-ink/20">
      <Link to={`/news/${item.slug}`} className="flex h-full flex-col">
        <Media
          src={item.imageUrl}
          alt={l(item.title)}
          kind={item.sportId ?? 'news'}
          tint={university?.color}
          label={university?.shortName}
          ratio="aspect-[16/10]"
        />

        <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-slate">
          {university ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: university.color }}
              />
              {university.shortName}
            </span>
          ) : (
            <span className="font-semibold text-ink">UniSport</span>
          )}
          <span>·</span>
          <span>{formatDate(item.publishedAt, lang)}</span>
        </div>

        <h3 className="mt-2 text-lg leading-snug font-semibold group-hover:underline">
          {l(item.title)}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate">
          {l(item.excerpt)}
        </p>

        <div className="mt-4 flex items-center gap-2 border-t border-line pt-3 text-xs">
          {item.isAnnouncement ? (
            <span className="font-semibold text-[var(--accent)]">{t('label.announcement')}</span>
          ) : (
            sport && <span className="font-semibold text-[var(--accent)]">{l(sport.name)}</span>
          )}
          <span className="text-slate">
            · {item.readMinutes} {t('label.minRead')}
          </span>
        </div>
        </div>
      </Link>
    </article>
  )
}

/** The lead story on the news page — same data, more room. */
export function FeatureNewsCard({ item }: { item: NewsItem }) {
  const { lang, t, l } = useI18n()
  const { universityById } = useHub()
  const university = universityById(item.universityId)

  return (
    <article className="group">
      <Link to={`/news/${item.slug}`} className="grid gap-6 md:grid-cols-2 md:items-center">
        <Media
          src={item.imageUrl}
          alt={l(item.title)}
          kind={item.sportId ?? 'news'}
          tint={university?.color}
          label={university?.shortName}
          ratio="aspect-[16/10]"
          className="rounded-card"
        />
        <div>
          <div className="flex items-center gap-2 text-xs text-slate">
            <span className="font-semibold text-ink">
              {university?.shortName ?? 'UniSport'}
            </span>
            <span>·</span>
            <span>{formatDate(item.publishedAt, lang)}</span>
          </div>
          <h2 className="mt-3 text-3xl leading-tight font-semibold group-hover:underline sm:text-4xl">
            {l(item.title)}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate">{l(item.excerpt)}</p>
          <p className="mt-4 text-xs font-semibold text-[var(--accent)]">
            {t('action.readMore')} · {item.readMinutes} {t('label.minRead')}
          </p>
        </div>
      </Link>
    </article>
  )
}
