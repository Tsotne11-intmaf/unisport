import { useState } from 'react'
import { Link } from 'react-router-dom'

import { AllstarPitch } from '@/components/AllstarPitch'
import { NewsCard, TournamentCard } from '@/components/cards'
import { PlayerVote } from '@/components/PlayerVote'
import { TournamentGroups } from '@/components/TournamentGroups'
import { EmptyState, Pill, SectionHeading, Themed } from '@/components/ui'
import { UniversityPicker } from '@/components/UniversityPicker'
import { WinnerTeams } from '@/components/WinnerTeams'
import { useHub } from '@/data/HubProvider'
import {
  allstarSquad,
  clubs,
  currentSeason,
  tournamentGroups,
  voteCandidates,
  winnerTeams,
} from '@/data/football'
import {
  ALL,
  filterNews,
  filterTournaments,
  openForRegistration,
  sortByUrgency,
} from '@/data/selectors'
import { useI18n } from '@/lib/i18n'

const clubIndex = new Map(clubs.map((club) => [club.id, club]))

/** Clubs, squads and polls belong to a campus; keep them in step with the picker. */
const belongsTo = (clubId: string, universityId: string) =>
  universityId === ALL || clubIndex.get(clubId)?.universityId === universityId

export function FootballPage() {
  const { t, l } = useI18n()
  const hub = useHub()
  const [universityId, setUniversityId] = useState(hub.myUniversityId)

  const sport = hub.sportById('football')
  const tournaments = sortByUrgency(
    filterTournaments(hub.tournaments, { sportId: 'football', universityId }),
  )
  const open = openForRegistration(tournaments)
  const news = filterNews(hub.news, { sportId: 'football', universityId }).slice(0, 4)

  const visibleIds = new Set(tournaments.map((tournament) => tournament.id))
  const groups = tournamentGroups.filter((group) => visibleIds.has(group.tournamentId))
  const winners = winnerTeams.filter((team) => belongsTo(team.clubId, universityId))
  const showSquad = visibleIds.has(allstarSquad.tournamentId)
  // The poll is run by the same league as the All-Star squad, so they appear together.
  const candidates = showSquad ? voteCandidates : []

  const hostedCounts = Object.fromEntries(
    hub.universities.map((university) => [
      university.id,
      hub.tournaments.filter(
        (tournament) =>
          tournament.sportId === 'football' && tournament.hostUniversityId === university.id,
      ).length,
    ]),
  )

  const pick = (next: string) => {
    setUniversityId(next)
    hub.setMyUniversityId(next)
  }

  return (
    <Themed theme="football">
      <section className="border-b border-line bg-mist">
        <div className="shell py-10 sm:py-12">
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

      <section className="shell py-8">
        <SectionHeading
          index={2}
          eyebrow={open.length ? t('tab.open') : l(sport?.name)}
          title={t('section.tournaments')}
        />
        {tournaments.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {tournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>

      {groups.length > 0 && (
        <section className="shell py-8">
          <SectionHeading
            index={3}
            eyebrow={l(currentSeason)}
            title={t('section.groups')}
          />
          <p className="mb-5 -mt-2 text-sm text-slate">{t('groups.lede')}</p>
          <TournamentGroups groups={groups} />
        </section>
      )}

      {showSquad && (
        <section className="shell py-8">
          <SectionHeading index={4} eyebrow={l(currentSeason)} title={t('section.allstar')} />
          <AllstarPitch squad={allstarSquad} />
        </section>
      )}

      {winners.length > 0 && (
        <section className="shell py-8">
          <SectionHeading
            index={5}
            eyebrow={l(currentSeason)}
            title={t('section.winners')}
          />
          <WinnerTeams teams={winners} />
        </section>
      )}

      {candidates.length > 0 && (
        <section className="shell py-8">
          <SectionHeading index={6} eyebrow={l(currentSeason)} title={t('section.vote')} />
          <p className="mb-5 -mt-2 text-sm text-slate">{t('vote.lede')}</p>
          <PlayerVote candidates={candidates} />
        </section>
      )}

      {news.length > 0 && (
        <section className="shell py-8 pb-14">
          <SectionHeading
            index={7}
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
