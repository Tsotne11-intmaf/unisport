import { Link } from 'react-router-dom'

import { EventCard, NewsCard, TournamentCard } from '@/components/cards'
import { UniversityPicker } from '@/components/UniversityPicker'
import { UniteBlock } from '@/components/UniteBlock'
import { SectionHeading, Themed } from '@/components/ui'
import { useHub } from '@/data/HubProvider'
import {
  ALL,
  filterEvents,
  filterNews,
  filterTournaments,
  openForRegistration,
  sortByUrgency,
  upcomingEvents,
} from '@/data/selectors'
import { useI18n, type TranslationKey } from '@/lib/i18n'

const steps: Array<{ title: TranslationKey; body: TranslationKey }> = [
  { title: 'join.step1', body: 'join.step1Body' },
  { title: 'join.step2', body: 'join.step2Body' },
  { title: 'join.step3', body: 'join.step3Body' },
  { title: 'join.step4', body: 'join.step4Body' },
]

export function Home() {
  const { t, l } = useI18n()
  const hub = useHub()

  const universityId = hub.myUniversityId
  const scoped = filterTournaments(hub.tournaments, { universityId })
  const open = sortByUrgency(openForRegistration(scoped)).slice(0, 3)
  const events = upcomingEvents(filterEvents(hub.events, { universityId }), 3)
  const news = filterNews(hub.news, { universityId }).slice(0, 4)
  const picked = universityId === ALL ? undefined : hub.universityById(universityId)
  const hostedCounts = Object.fromEntries(
    hub.universities.map((university) => [
      university.id,
      hub.tournaments.filter((item) => item.hostUniversityId === university.id).length,
    ]),
  )

  return (
    <Themed theme="neutral">
      {/* A photograph carries the hero. The copy is one line and three buttons. */}
      <section className="relative isolate overflow-hidden bg-ink">
        <img
          src="/gallery/match-1.webp"
          alt=""
          className="absolute inset-0 -z-10 size-full object-cover"
          style={{ objectPosition: '50% 30%' }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-ink/95 via-ink/80 to-ink/50" />

        <div className="shell py-24 sm:py-32 lg:py-40">
          <span className="inline-flex items-center rounded-pill bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white ring-1 ring-white/25 backdrop-blur-sm">
            {t('hero.eyebrow')}
          </span>

          <h1
            className="mt-6 max-w-4xl text-5xl leading-[1.05] font-semibold text-balance text-white sm:text-6xl lg:text-7xl"
            style={{ textShadow: '0 2px 32px rgb(0 0 0 / 0.5)' }}
          >
            {t('hero.title')}
          </h1>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="rounded-pill bg-paper px-5 py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-90"
            >
              {t('hero.ctaRegister')} ↗
            </Link>
            <Link
              to="/padel"
              className="rounded-pill bg-padel px-5 py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-90"
            >
              {t('hero.ctaPadel')}
            </Link>
            <Link
              to="/football"
              className="rounded-pill bg-football px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {t('hero.ctaFootball')}
            </Link>
          </div>
        </div>
      </section>

      {/* Picking a campus here is what the rest of the site remembers. */}
      <section className="border-b border-line bg-mist">
        <div className="shell py-12">
          <SectionHeading
            index={1}
            eyebrow={t('nav.universities')}
            title={t('section.pickUniversity')}
          />
          <UniversityPicker
            universities={hub.universities}
            value={universityId}
            onChange={hub.setMyUniversityId}
            counts={hostedCounts}
          />
          {picked && <p className="mt-4 text-xs text-slate">{t('filter.saved')}</p>}
        </div>
      </section>

      <section className="shell py-14">
        <div className="grid gap-5 sm:grid-cols-2">
          <SportTile
            to="/padel"
            title={l(hub.sportById('padel')?.name)}
            blurb={l(hub.sportById('padel')?.blurb)}
            className="bg-padel text-ink"
            count={hub.tournaments.filter((item) => item.sportId === 'padel').length}
            countLabel={t('stat.tournaments')}
          />
          <SportTile
            to="/football"
            title={l(hub.sportById('football')?.name)}
            blurb={l(hub.sportById('football')?.blurb)}
            className="bg-football text-white"
            count={hub.tournaments.filter((item) => item.sportId === 'football').length}
            countLabel={t('stat.tournaments')}
          />
        </div>
      </section>

      {/* The mission, stated once, where the sports have just been introduced. */}
      <section className="shell pb-6">
        <Themed theme="news">
          <UniteBlock />
        </Themed>
      </section>

      {open.length > 0 && (
        <section className="shell py-10">
          <SectionHeading
            index={2}
            eyebrow={t('tab.open')}
            title={t('section.openNow')}
            action={{ to: '/register', label: t('action.register') }}
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {open.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        </section>
      )}

      <section className="shell py-10">
        <Themed theme="events">
          <SectionHeading
            index={3}
            eyebrow={t('nav.events')}
            title={t('section.events')}
            action={{ to: '/events', label: t('action.viewAll') }}
          />
          <div className="grid gap-5 md:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </Themed>
      </section>


      {/* A dark band so the four steps read as one run, not four loose cards. */}
      <section className="my-6 border-y border-line bg-mist py-14">
        <div className="shell">
          <SectionHeading
            index={4}
            eyebrow={t('nav.register')}
            title={t('section.howToJoin')}
          />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-2xl border border-line bg-paper p-6 transition-colors hover:border-ink/20"
              >
                <span className="grid size-10 place-items-center rounded-full bg-padel text-base font-bold text-ink">
                  {index + 1}
                </span>
                <h3 className="mt-5 font-bold">{t(step.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{t(step.body)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="shell py-10">
        <Themed theme="news">
          <SectionHeading
            index={5}
            eyebrow={t('nav.news')}
            title={t('section.news')}
            action={{ to: '/news', label: t('action.viewAll') }}
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {news.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </Themed>
      </section>
    </Themed>
  )
}

function SportTile({
  to,
  title,
  blurb,
  className,
  count,
  countLabel,
}: {
  to: string
  title: string
  blurb: string
  className: string
  count: number
  countLabel: string
}) {
  return (
    <Link
      to={to}
      className={`court-weave group flex min-h-56 flex-col justify-between rounded-card p-7 transition-transform hover:-translate-y-0.5 ${className}`}
    >
      <div>
        <h3 className="text-3xl font-semibold">{title}</h3>
        <p className="mt-2 max-w-xs text-sm opacity-80">{blurb}</p>
      </div>
      <p className="mt-8 text-sm font-semibold">
        {count} {countLabel.toLowerCase()} →
      </p>
    </Link>
  )
}
