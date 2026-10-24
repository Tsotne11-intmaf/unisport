import { useState } from 'react'
import { Link } from 'react-router-dom'

import { NewsCard, TournamentCard } from '@/components/cards'
import { UniversityFilter } from '@/components/UniversityFilter'
import { Card, EmptyState, Media, Pill, SectionHeading, Themed } from '@/components/ui'
import { useHub } from '@/data/HubProvider'
import {
  filterNews,
  filterTournaments,
  openForRegistration,
  placesLeft,
  sortByUrgency,
} from '@/data/selectors'
import { formatDate, formatRange } from '@/lib/format'
import { useI18n } from '@/lib/i18n'

export function FootballPage() {
  const { lang, t, l } = useI18n()
  const hub = useHub()
  const [universityId, setUniversityId] = useState(hub.myUniversityId)

  const sport = hub.sportById('football')
  const all = sortByUrgency(
    filterTournaments(hub.tournaments, { sportId: 'football', universityId }),
  )
  const open = openForRegistration(all)
  const ongoing = all.filter((tournament) => tournament.status === 'ongoing')
  const rest = all.filter(
    (tournament) => tournament.status === 'upcoming' || tournament.status === 'finished',
  )
  const news = filterNews(hub.news, { sportId: 'football', universityId }).slice(0, 4)

  const featured = open[0] ?? ongoing[0] ?? all[0]
  const featuredHost = hub.universityById(featured?.hostUniversityId)
  const featuredLeft = featured ? placesLeft(featured) : null

  return (
    <Themed theme="football">
      <section className="border-b border-line bg-mist">
        <div className="shell py-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Pill variant="accent">{l(sport?.name)}</Pill>
              <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">{l(sport?.name)}</h1>
              <p className="mt-2 max-w-xl text-slate">{l(sport?.blurb)}</p>
            </div>
            <Link
              to="/register"
              className="rounded-pill bg-football px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {t('hero.ctaRegister')}
            </Link>
          </div>
        </div>
      </section>

      {/* Banner card — the match-day hero from the reference, pointed at the next entry deadline. */}
      {featured && (
        <section className="shell py-8">
          <Card className="overflow-hidden lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-stretch">
            <Media
              src={featured.imageUrl}
              alt={l(featured.title)}
              kind="football"
              tint={featuredHost?.color ?? '#e5362c'}
              label={featuredHost?.shortName}
              ratio="aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-72"
            />
            <div className="flex flex-col justify-center p-6 sm:p-9">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-pill bg-football/10 px-2.5 py-1 text-xs font-semibold text-football">
                  <span className="size-2 rounded-full bg-football" />
                  {t(
                    featured.status === 'registration_open'
                      ? 'status.registration_open'
                      : 'status.ongoing',
                  )}
                </span>
                {featuredHost && <Pill>{featuredHost.shortName}</Pill>}
              </div>

              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">{l(featured.title)}</h2>
              <p className="mt-3 text-slate">{l(featured.summary)}</p>

              <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                <Fact label={t('label.dates')} value={formatRange(featured.startDate, featured.endDate, lang)} />
                <Fact label={t('label.venue')} value={l(featured.venue)} />
                {featured.registrationDeadline && (
                  <Fact
                    label={t('label.deadline')}
                    value={formatDate(featured.registrationDeadline, lang)}
                  />
                )}
                {featuredLeft !== null && (
                  <Fact
                    label={t('label.placesLeft')}
                    value={featuredLeft > 0 ? String(featuredLeft) : t('label.full')}
                  />
                )}
              </div>

              {featured.status === 'registration_open' && (
                <Link
                  to={`/register?tournament=${featured.id}`}
                  className="mt-7 self-start rounded-pill bg-ink px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  {t('action.registerFor')} →
                </Link>
              )}
            </div>
          </Card>
        </section>
      )}

      <div className="shell pb-6">
        <UniversityFilter
          universities={hub.universities}
          value={universityId}
          onChange={setUniversityId}
        />
      </div>

      {open.length > 0 && (
        <section className="shell py-8">
          <SectionHeading index={1} eyebrow={t('tab.open')} title={t('section.openNow')} />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {open.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        </section>
      )}

      <section className="shell py-8">
        <SectionHeading index={2} eyebrow={l(sport?.name)} title={t('section.tournaments')} />
        {ongoing.length + rest.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[...ongoing, ...rest].map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>

      {news.length > 0 && (
        <section className="shell py-8">
          <SectionHeading
            index={3}
            eyebrow={t('nav.news')}
            title={t('section.news')}
            action={{ to: '/news?sport=football', label: t('action.viewAll') }}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {news.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </Themed>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  )
}
