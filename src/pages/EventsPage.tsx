import { useSearchParams } from 'react-router-dom'

import { EventCard } from '@/components/cards'
import { UniversityFilter } from '@/components/UniversityFilter'
import { EmptyState, Pill, Themed } from '@/components/ui'
import { useHub } from '@/data/HubProvider'
import { ALL, filterEvents } from '@/data/selectors'
import { useI18n } from '@/lib/i18n'

export function EventsPage() {
  const [params, setParams] = useSearchParams()
  const { t } = useI18n()
  const hub = useHub()

  const universityId = params.get('uni') ?? hub.myUniversityId
  const events = filterEvents(hub.events, { universityId })

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
          <div className="mt-8">
            <UniversityFilter
              universities={hub.universities}
              value={universityId}
              onChange={setUniversity}
            />
          </div>
        </div>
      </section>

      <div className="shell py-12">
        {events.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </Themed>
  )
}
