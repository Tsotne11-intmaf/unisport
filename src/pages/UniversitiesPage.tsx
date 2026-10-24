import { Link } from 'react-router-dom'

import { AddUniversityLens } from '@/components/AddUniversityLens'
import { Card, Pill, Themed, UniversityChip } from '@/components/ui'
import { useHub } from '@/data/HubProvider'
import { useI18n } from '@/lib/i18n'

export function UniversitiesPage() {
  const { t, l } = useI18n()
  const hub = useHub()

  return (
    <Themed theme="neutral">
      <section className="border-b border-line bg-mist">
        <div className="shell py-10 sm:py-14">
          <Pill variant="solid">{t('nav.universities')}</Pill>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            {t('section.universities')}
          </h1>
          <p className="mt-2 max-w-xl text-slate">
            {hub.universities.length} {t('stat.universities').toLowerCase()}
          </p>
        </div>
      </section>

      <div className="shell grid gap-5 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {hub.universities.map((university) => {
          const hosted = hub.tournaments.filter(
            (tournament) => tournament.hostUniversityId === university.id,
          )
          const openCount = hosted.filter(
            (tournament) => tournament.status === 'registration_open',
          ).length
          const newsCount = hub.news.filter(
            (item) => item.universityId === university.id,
          ).length
          const eventCount = hub.events.filter(
            (event) => event.universityId === university.id,
          ).length
          const sports = hub.sports.filter((sport) =>
            hosted.some((tournament) => tournament.sportId === sport.id),
          )

          return (
            <Card key={university.id} className="flex h-full flex-col p-5">
              <div className="flex items-start gap-3">
                <UniversityChip university={university} />
                <div className="min-w-0">
                  <h2 className="leading-snug font-semibold">{l(university.name)}</h2>
                  <p className="mt-0.5 text-xs text-slate">{l(university.city)}</p>
                </div>
              </div>

              <dl className="mt-5 grid grid-cols-3 gap-2 border-y border-line py-4 text-center">
                <Metric value={hosted.length} label={t('section.tournaments')} />
                <Metric value={eventCount} label={t('nav.events')} />
                <Metric value={newsCount} label={t('nav.news')} />
              </dl>

              <div className="mt-4 flex flex-1 flex-wrap items-end gap-2">
                {sports.map((sport) => (
                  <Link
                    key={sport.id}
                    to={`/${sport.id}`}
                    className="rounded-pill border border-line px-2.5 py-1.5 text-xs font-semibold text-graphite transition-colors hover:border-ink"
                  >
                    {l(sport.name)}
                  </Link>
                ))}
                <Link
                  to={`/news?uni=${university.id}`}
                  className="rounded-pill border border-line px-2.5 py-1.5 text-xs font-semibold text-graphite transition-colors hover:border-ink"
                >
                  {t('nav.news')}
                </Link>
                {openCount > 0 && (
                  <Link
                    to="/register"
                    className="ml-auto rounded-pill bg-ink px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    {openCount} {t('tab.open').toLowerCase()}
                  </Link>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      <div className="shell pb-16">
        <AddUniversityLens />
      </div>
    </Themed>
  )
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <dd className="text-xl font-semibold">{value}</dd>
      <dt className="truncate text-[11px] text-slate">{label}</dt>
    </div>
  )
}
