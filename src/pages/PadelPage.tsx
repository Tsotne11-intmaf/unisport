import { useState } from 'react'
import { Link } from 'react-router-dom'

import { NewsCard, TournamentCard } from '@/components/cards'
import { InstagramCard } from '@/components/MatchGallery'
import { CourtCta } from '@/components/CourtCta'
import { PadelAbout } from '@/components/PadelAbout'
import { EmptyState, Pill, SectionHeading, Themed } from '@/components/ui'
import { UniversityPicker } from '@/components/UniversityPicker'
import { useHub } from '@/data/HubProvider'
import { filterNews, filterTournaments, sortByUrgency } from '@/data/selectors'
import { useI18n } from '@/lib/i18n'

export function PadelPage() {
  const { t, l } = useI18n()
  const hub = useHub()
  const [universityId, setUniversityId] = useState(hub.myUniversityId)

  const sport = hub.sportById('padel')
  const tournaments = sortByUrgency(
    filterTournaments(hub.tournaments, { sportId: 'padel', universityId }),
  )
  const news = filterNews(hub.news, { sportId: 'padel', universityId }).slice(0, 3)

  const hostedCounts = Object.fromEntries(
    hub.universities.map((university) => [
      university.id,
      hub.tournaments.filter(
        (tournament) =>
          tournament.sportId === 'padel' && tournament.hostUniversityId === university.id,
      ).length,
    ]),
  )

  const pick = (next: string) => {
    setUniversityId(next)
    hub.setMyUniversityId(next)
  }

  return (
    <Themed theme="padel">
      <section className="shell pt-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-court px-6 py-16 sm:px-12 sm:py-24">
          <img
            src="/banners/padel-default.webp"
            alt=""
            className="absolute inset-0 size-full object-cover"
            style={{ objectPosition: '50% 45%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/65 to-ink/20" />
          <div className="relative">
            <Pill variant="accent">{l(sport?.name)}</Pill>
            <h1 className="mt-5 max-w-3xl text-4xl leading-[1.05] font-semibold text-white sm:text-6xl">
              {t('padel.title')}
            </h1>

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
          </div>
        </div>
      </section>

      <section className="shell py-12">
        <SectionHeading
          index={1}
          eyebrow={t('nav.universities')}
          title={t('section.pickUniversity')}
        />
        <UniversityPicker
          universities={hub.universities}
          value={universityId}
          onChange={pick}
          counts={hostedCounts}
        />
      </section>

      {/* Everything open to enter lives here — there is no second list. */}
      <section id="tournaments" className="scroll-mt-20 bg-padel py-14">
        <div className="shell">
          <div className="mb-4 flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-full bg-ink text-[11px] font-bold text-white">
              2
            </span>
            <Pill variant="solid">{l(sport?.name)}</Pill>
          </div>
          <h2 className="mb-8 max-w-2xl text-3xl font-semibold sm:text-4xl">
            {t('section.tournaments')}
          </h2>
          {tournaments.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {tournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>

      <section className="shell py-14">
        <PadelAbout tournaments={tournaments} />
      </section>

      <section className="shell pb-14">
        <CourtCta photo="/gallery/padel-cta.webp" />
      </section>

      <section className="shell pb-14">
        <InstagramCard />
      </section>

      {news.length > 0 && (
        <section className="shell pb-14">
          <SectionHeading
            index={3}
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
    </Themed>
  )
}
