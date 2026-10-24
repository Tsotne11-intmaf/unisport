import { clubs, type WinnerTeam } from '@/data/football'
import { useI18n } from '@/lib/i18n'

const clubIndex = new Map(clubs.map((club) => [club.id, club]))

const medals = [
  { key: 'gold', color: '#e8b228', labelKey: 'label.first' },
  { key: 'silver', color: '#9aa3ad', labelKey: 'label.second' },
  { key: 'bronze', color: '#c2763c', labelKey: 'label.third' },
] as const

export function WinnerTeams({ teams }: { teams: WinnerTeam[] }) {
  const { t, l } = useI18n()

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {teams.map((team, index) => {
        const club = clubIndex.get(team.clubId)
        const total = team.gold + team.silver + team.bronze

        return (
          <article
            key={team.clubId}
            className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-paper"
          >
            {/* Only the photo clips — the crest hangs over its edge, so the
                overflow has to stay off this wrapper or it gets cut in half. */}
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden bg-ink">
                <img
                  src={team.photoUrl}
                  alt={club?.name ?? team.clubId}
                  loading="lazy"
                  className="size-full object-cover"
                />
              </div>
              <span className="absolute top-3 left-3 grid size-7 place-items-center rounded-full bg-ink/85 text-xs font-bold text-white">
                {index + 1}
              </span>
              {club?.logoUrl && (
                <img
                  src={club.logoUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute -bottom-8 left-5 size-20 rounded-2xl border-4 border-paper bg-paper object-contain shadow-[0_8px_20px_-10px_rgb(13_14_17_/_0.5)]"
                />
              )}
            </div>

            <div className="flex flex-1 flex-col p-5 pt-14">
              <h3 className="text-lg font-bold">{club?.name}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate">
                {l(team.highlight)}
              </p>

              <dl className="mt-4 flex gap-2 border-t border-line pt-4">
                {medals.map((medal) => {
                  const count = team[medal.key]
                  return (
                    <div
                      key={medal.key}
                      className={`flex flex-1 flex-col items-center rounded-xl py-2 ${
                        count > 0 ? 'bg-mist' : 'opacity-40'
                      }`}
                    >
                      <dd className="flex items-center gap-1 text-base font-bold">
                        <MedalIcon color={medal.color} />
                        {count}
                      </dd>
                      <dt className="mt-0.5 text-[10px] font-semibold text-slate">
                        {t(medal.labelKey)}
                      </dt>
                    </div>
                  )
                })}
              </dl>

              <p className="mt-3 text-center text-xs text-slate">
                {total} {t('label.titles').toLowerCase()}
              </p>
            </div>
          </article>
        )
      })}
    </div>
  )
}

function MedalIcon({ color }: { color: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <circle cx="12" cy="15" r="7" />
      <path d="M8 2h3l-2 6-3-4Zm8 0h-3l2 6 3-4Z" />
    </svg>
  )
}
