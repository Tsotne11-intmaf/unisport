import { useSearchParams } from 'react-router-dom'

import { EventCard, NewsCard } from '@/components/cards'
import { EVENTS_INSTAGRAM_URL, InstagramCard } from '@/components/MatchGallery'
import { UniversityPicker } from '@/components/UniversityPicker'
import { Pill, SectionHeading, Themed } from '@/components/ui'
import { useHub } from '@/data/HubProvider'
import { ALL, filterEvents, filterNews } from '@/data/selectors'
import { useI18n } from '@/lib/i18n'

export function EventsPage() {
  const [params, setParams] = useSearchParams()
  const { t, l } = useI18n()
  const hub = useHub()

  const universityId = params.get('uni') ?? hub.myUniversityId
  const events = filterEvents(hub.events, { universityId })
  // No sport filter here — events are not tied to one.
  const news = filterNews(hub.news, { universityId }).slice(0, 4)

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
      <section className="shell pt-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink">
          <img
            src="/banners/events-default.webp"
            alt=""
            className="absolute inset-0 size-full object-cover"
            style={{ objectPosition: '50% 45%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/60 to-ink/15" />
          <div className="relative px-6 py-14 sm:px-10 sm:py-20">
            <Pill variant="accent">{t('nav.events')}</Pill>
            <h1
              className="mt-4 text-4xl font-semibold text-white sm:text-5xl"
              style={{ textShadow: '0 2px 24px rgb(0 0 0 / 0.45)' }}
            >
              {t('section.events')}
            </h1>
            <p className="mt-3 text-sm text-white/75">
              {t('filter.showing')}: {events.length}
            </p>
          </div>
        </div>
      </section>

      {/* Events run under their own brand, so the picker shows that name and mark. */}
      <section className="shell py-12">
        <SectionHeading
          index={1}
          eyebrow={t('nav.universities')}
          title={t('section.pickUniversity')}
        />
        <UniversityPicker
          universities={hub.universities}
          value={universityId}
          onChange={setUniversity}
          nameOf={(university) => l(university.eventsName ?? university.name)}
          logoOf={(university) => university.eventsLogoUrl ?? university.logoUrl}
          markClassName="h-16 w-28 rounded-2xl text-sm"
          counts={Object.fromEntries(
            hub.universities.map((university) => [
              university.id,
              hub.events.filter((event) => event.universityId === university.id).length,
            ]),
          )}
        />
      </section>

      <section className="shell pb-12">
        <SectionHeading index={2} title={t('section.upcomingEvents')} />
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
        <section className="shell pb-12">
          <SectionHeading index={3} title={t('section.pastEvents')} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      <section className="shell pb-14">
        <InstagramCard
          url={EVENTS_INSTAGRAM_URL}
          title={t('social.eventsTitle')}
          body={t('social.eventsBody')}
        />
      </section>

      {news.length > 0 && (
        <section className="shell pb-14">
          <SectionHeading
            index={4}
            eyebrow={t('nav.news')}
            title={t('section.news')}
            action={{ to: '/news', label: t('action.viewAll') }}
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
