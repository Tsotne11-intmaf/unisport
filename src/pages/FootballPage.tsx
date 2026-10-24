import { useState } from 'react'

import { AllstarPitch } from '@/components/AllstarPitch'
import { NewsCard, TournamentCard } from '@/components/cards'
import { MatchGallery } from '@/components/MatchGallery'
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

  const picked = universityId === ALL ? undefined : hub.universityById(universityId)
  const banner = picked?.bannerUrl ?? '/banners/football-default.png'

  const pick = (next: string) => {
    setUniversityId(next)
    hub.setMyUniversityId(next)
  }

  return (
    <Themed theme="football">
      {/* The banner swaps to the campus once a university is picked; until then
          it is the neutral one, since no tournament has been chosen either. */}
      <section className="shell pt-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink">
          <img
            src={banner}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/15" />
          <div className="relative px-6 py-14 sm:px-10 sm:py-20">
            <Pill variant="accent">{l(sport?.name)}</Pill>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              {l(sport?.name)}
            </h1>
            <p className="mt-2 max-w-xl text-white/80">{l(sport?.blurb)}</p>
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
          <SectionHeading index={3} title={t('section.groups')} />
          <p className="mb-5 -mt-2 text-sm text-slate">{t('groups.lede')}</p>
          <TournamentGroups groups={groups} />
        </section>
      )}

      {showSquad && (
        <section className="shell py-8">
          <SectionHeading
            index={4}
            eyebrow={l(currentSeason)}
            eyebrowStrong
            title={t('section.allstar')}
          />
          <AllstarPitch squad={allstarSquad} />
        </section>
      )}

      {winners.length > 0 && (
        <section className="shell py-8">
          <SectionHeading
            index={5}
            eyebrow={l(currentSeason)}
            eyebrowStrong
            title={t('section.winners')}
          />
          <WinnerTeams teams={winners} />
        </section>
      )}

      {candidates.length > 0 && (
        <section className="shell py-8">
          <SectionHeading
            index={6}
            eyebrow={l(currentSeason)}
            eyebrowStrong
            title={t('section.vote')}
          />
          <p className="mb-5 -mt-2 text-sm text-slate">{t('vote.lede')}</p>
          <PlayerVote candidates={candidates} />
        </section>
      )}

      <section className="shell py-8">
        <SectionHeading
          index={7}
          eyebrow={t('gallery.eyebrow')}
          title={t('section.gallery')}
        />
        <p className="mb-5 -mt-2 text-sm text-slate">{t('gallery.lede')}</p>
        <MatchGallery />
      </section>

      {news.length > 0 && (
        <section className="shell py-8 pb-14">
          <SectionHeading
            index={8}
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
