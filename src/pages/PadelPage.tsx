import { useState } from 'react'
import { Link } from 'react-router-dom'

import { NewsCard, TournamentCard } from '@/components/cards'
import { UniversityFilter } from '@/components/UniversityFilter'
import { EmptyState, Pill, SectionHeading, Themed } from '@/components/ui'
import { useHub } from '@/data/HubProvider'
import {
  filterNews,
  filterTournaments,
  openForRegistration,
  sortByUrgency,
} from '@/data/selectors'
import { useI18n, type TranslationKey } from '@/lib/i18n'

const steps: Array<{ title: TranslationKey; body: TranslationKey }> = [
  { title: 'join.step1', body: 'join.step1Body' },
  { title: 'join.step2', body: 'join.step2Body' },
  { title: 'join.step3', body: 'join.step3Body' },
  { title: 'join.step4', body: 'join.step4Body' },
]

export function PadelPage() {
  const { t, l } = useI18n()
  const hub = useHub()
  const [universityId, setUniversityId] = useState(hub.myUniversityId)

  const sport = hub.sportById('padel')
  const all = sortByUrgency(filterTournaments(hub.tournaments, { sportId: 'padel', universityId }))
  const open = openForRegistration(all)
  const news = filterNews(hub.news, { sportId: 'padel', universityId }).slice(0, 3)

  const campuses = hub.universities.filter((university) =>
    hub.tournaments.some(
      (tournament) =>
        tournament.sportId === 'padel' && tournament.hostUniversityId === university.id,
    ),
  )

  return (
    <Themed theme="padel">
      {/* Hero — a court-blue panel, the way the reference leads with photography. */}
      <section className="shell pt-6">
        <div
          className="court-weave relative overflow-hidden rounded-[2rem] px-6 py-16 sm:px-12 sm:py-24"
          style={{
            backgroundImage:
              'linear-gradient(140deg, #17395c 0%, #1d4a74 45%, #0f2742 100%)',
          }}
        >
          <Pill variant="accent">{l(sport?.name)}</Pill>
          <h1 className="mt-5 max-w-3xl text-4xl leading-[1.05] font-semibold text-white sm:text-6xl">
            {l(sport?.blurb)}
          </h1>
          <p className="mt-5 max-w-lg text-white/75">{t('hero.lede')}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="rounded-pill bg-padel px-5 py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-90"
            >
              {t('hero.ctaRegister')} ↗
            </Link>
            <a
              href="#tournaments"
              className="rounded-pill bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/25 transition-colors hover:bg-white/20"
            >
              {t('section.tournaments')}
            </a>
          </div>

          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4 text-white">
            <Stat value={all.length} label={t('stat.tournaments')} />
            <Stat value={open.length} label={t('stat.open')} />
            <Stat value={campuses.length} label={t('stat.universities')} />
          </dl>
        </div>
      </section>

      <div className="shell py-12">
        <UniversityFilter
          universities={hub.universities}
          value={universityId}
          onChange={setUniversityId}
        />
      </div>

      {/* The lime block — the loudest moment on the page, reserved for what you can join today. */}
      {open.length > 0 && (
        <section className="bg-padel py-14">
          <div className="shell">
            <div className="mb-8 flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-ink text-[11px] font-bold text-white">
                1
              </span>
              <Pill variant="solid">{t('tab.open')}</Pill>
            </div>
            <h2 className="mb-8 max-w-2xl text-3xl font-semibold sm:text-4xl">
              {t('section.openNow')}
            </h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {open.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="tournaments" className="shell scroll-mt-20 py-14">
        <SectionHeading index={2} eyebrow={l(sport?.name)} title={t('section.tournaments')} />
        {all.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {all.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>

      <section className="shell py-14">
        <SectionHeading index={3} eyebrow={t('nav.register')} title={t('section.howToJoin')} />
        <ol className="divide-y divide-line border-y border-line">
          {steps.map((step, index) => (
            <li key={step.title} className="grid gap-2 py-6 sm:grid-cols-[4rem_1fr_1fr]">
              <span className="text-sm font-semibold text-slate tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-lg font-semibold">{t(step.title)}</h3>
              <p className="text-sm leading-relaxed text-slate">{t(step.body)}</p>
            </li>
          ))}
        </ol>
      </section>

      {news.length > 0 && (
        <section className="shell py-14">
          <SectionHeading
            index={4}
            eyebrow={t('nav.news')}
            title={t('section.news')}
            action={{ to: '/news?sport=padel', label: t('action.viewAll') }}
          />
          <div className="grid gap-6 md:grid-cols-3">
            {news.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      <section className="shell pb-6">
        <div className="rounded-[2rem] bg-padel px-6 py-14 text-center sm:px-12">
          <h2 className="mx-auto max-w-xl text-3xl font-semibold sm:text-4xl">
            {t('reg.title')}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-graphite">{t('reg.lede')}</p>
          <Link
            to="/register"
            className="mt-7 inline-block rounded-pill bg-ink px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {t('action.register')} ↗
          </Link>
        </div>
      </section>
    </Themed>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <dt className="text-xs tracking-wide text-white/60">{label}</dt>
      <dd className="text-3xl font-semibold">{value}</dd>
    </div>
  )
}
