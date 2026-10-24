import { useSearchParams } from 'react-router-dom'

import { EventCard } from '@/components/cards'
import { UniversityFilter } from '@/components/UniversityFilter'
import { Pill, SectionHeading, Themed } from '@/components/ui'
import { useHub } from '@/data/HubProvider'
import { ALL, filterEvents } from '@/data/selectors'
import { useI18n } from '@/lib/i18n'

export function EventsPage() {
  const [params, setParams] = useSearchParams()
  const { t } = useI18n()
  const hub = useHub()

  const universityId = params.get('uni') ?? hub.myUniversityId
  const events = filterEvents(hub.events, { universityId })

  const now = Date.now()
  const upcoming = events.filter((event) => new Date(event.startsAt).getTime() >= now)
  // Most recent first, so the last party is the one you see.
  const past = events
    .filter((event) => new Date(event.startsAt).getTime() < now)
    .reverse()

  const setUniversity = (next: string) => {
    const updated = new URLSearchParams(params)
    if (next === ALL) updated.delete('uni')
    else updated.set('uni', next)
    setParams(updated, { replace: true })
  }

  return (
    <Themed theme="events">
      <section className="border-b border-line bg-mist">
        <div className="shell py-10 sm:py-14">
          <Pill variant="accent">{t('nav.events')}</Pill>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">{t('section.events')}</h1>
          <p className="mt-2 text-sm text-slate">
            {t('filter.showing')}: {events.length}
          </p>
          {hub.universities.length > 1 && (
            <div className="mt-8">
              <UniversityFilter
                universities={hub.universities}
                value={universityId}
                onChange={setUniversity}
              />
            </div>
          )}
        </div>
      </section>

      <section className="shell py-12">
        <SectionHeading index={1} title={t('section.upcomingEvents')} />
        {upcoming.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="rounded-card border border-dashed border-line bg-mist px-6 py-14 text-center text-sm text-slate">
            {t('event.noneUpcoming')}
          </p>
        )}
      </section>

      {past.length > 0 && (
        <section className="shell pb-14">
          <SectionHeading index={2} title={t('section.pastEvents')} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
    </Themed>
  )
}
