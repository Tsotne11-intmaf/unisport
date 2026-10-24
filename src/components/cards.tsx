import { Link } from 'react-router-dom'

import { useHub } from '@/data/HubProvider'
import { placesLeft } from '@/data/selectors'
import { formatDate, formatDateTime, formatRange } from '@/lib/format'
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

        <dl className="mt-4 space-y-1.5 text-sm">
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
            to={`/register?tournament=${tournament.id}`}
            className="mt-4 rounded-pill bg-[var(--accent)] px-4 py-2.5 text-center text-sm font-semibold text-[var(--accent-ink)] transition-opacity hover:opacity-90"
          >
            {t('action.registerFor')} →
          </Link>
        )}
      </div>
    </Card>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-20 shrink-0 text-slate">{label}</dt>
      <dd className="min-w-0 flex-1 font-medium">{value}</dd>
    </div>
  )
}

const eventKey: Record<CampusEvent['kind'], TranslationKey> = {
  party: 'kind.party',
  ceremony: 'kind.ceremony',
  social: 'kind.social',
}

export function EventCard({ event }: { event: CampusEvent }) {
  const { lang, t, l } = useI18n()
  const { universityById } = useHub()
  const host = universityById(event.universityId)

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <Media
        src={event.imageUrl}
        alt={l(event.title)}
        kind="event"
        tint={host?.color}
        label={host?.shortName}
        ratio="aspect-[16/9]"
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Pill variant="soft">{t(eventKey[event.kind])}</Pill>
          <span className="text-xs font-semibold text-slate">
            {formatDateTime(event.startsAt, lang)}
          </span>
        </div>

        <h3 className="text-xl font-semibold">{l(event.title)}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate">{l(event.summary)}</p>

        <p className="mt-4 text-xs font-medium text-slate">
          {l(event.venue)} · {l(event.city)}
        </p>

        <div className="mt-4 flex items-center gap-2 border-t border-line pt-4">
          {host ? (
            <>
              <UniversityChip university={host} size="sm" />
              <span className="truncate text-xs font-semibold">{host.shortName}</span>
            </>
          ) : (
            <span className="text-xs font-semibold text-slate">{t('label.openToAll')}</span>
          )}
          {event.ticketUrl && (
            <a
              href={event.ticketUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="ml-auto rounded-pill bg-ink px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              {t('action.tickets')}
            </a>
          )}
        </div>
      </div>
    </Card>
  )
}

export function NewsCard({ item }: { item: NewsItem }) {
  const { lang, t, l } = useI18n()
  const { universityById, sportById } = useHub()

  const university = universityById(item.universityId)
  const sport = item.sportId ? sportById(item.sportId) : undefined

  return (
    <article className="group h-full">
      <Link to={`/news/${item.slug}`} className="flex h-full flex-col">
        <Media
          src={item.imageUrl}
          alt={l(item.title)}
          kind={item.sportId ?? 'news'}
          tint={university?.color}
          label={university?.shortName}
          ratio="aspect-[16/10]"
          className="rounded-card"
        />

        <div className="mt-3.5 flex items-center gap-2 text-xs text-slate">
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

        <div className="mt-3 flex items-center gap-2 text-xs">
          {item.isAnnouncement ? (
            <span className="font-semibold text-[var(--accent)]">{t('label.announcement')}</span>
          ) : (
            sport && <span className="font-semibold text-[var(--accent)]">{l(sport.name)}</span>
          )}
          <span className="text-slate">
            · {item.readMinutes} {t('label.minRead')}
          </span>
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
