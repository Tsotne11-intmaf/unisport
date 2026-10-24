import { clubs, type TournamentGroup } from '@/data/football'
import { useI18n } from '@/lib/i18n'

const clubIndex = new Map(clubs.map((club) => [club.id, club]))

/** The league draw: one tile per group, five places in each. */
export function TournamentGroups({ groups }: { groups: TournamentGroup[] }) {
  const { t, l } = useI18n()

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {groups.map((group) => (
        <section
          key={group.id}
          className="group/card flex flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_16px_34px_-22px_rgb(13_14_17_/_0.5)]"
        >
          {/* A hairline of the section accent, so the tiles read as a set. */}
          <span className="block h-1 bg-[var(--accent)]" />

          <header className="flex items-center gap-3 bg-[var(--accent-soft)] px-4 py-3.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[var(--accent)] text-base font-bold text-[var(--accent-ink)] shadow-sm">
              {group.code}
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold">{l(group.name)}</h3>
              <p className="text-[11px] font-medium text-slate">
                {group.clubIds.length} {t('groups.teams')}
              </p>
            </div>
          </header>

          <ol className="flex-1 divide-y divide-line px-4">
            {group.clubIds.map((clubId, index) => (
              <li
                key={clubId}
                className="flex items-center gap-3 py-2.5 text-sm transition-colors hover:bg-mist/70"
              >
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-mist text-[10px] font-bold text-slate tabular-nums">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 truncate font-medium">
                  {clubIndex.get(clubId)?.name ?? clubId}
                </span>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}
