import { clubs, type TournamentGroup } from '@/data/football'
import { useI18n } from '@/lib/i18n'

const clubIndex = new Map(clubs.map((club) => [club.id, club]))

/** The league draw: one compact tile per group, five places in each. */
export function TournamentGroups({ groups }: { groups: TournamentGroup[] }) {
  const { t, l } = useI18n()

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {groups.map((group) => (
        <section
          key={group.id}
          className="flex flex-col rounded-2xl border border-line bg-paper p-4"
        >
          <header className="mb-3 flex items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--accent)] text-sm font-bold text-[var(--accent-ink)]">
              {group.code}
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold">{l(group.name)}</h3>
              <p className="text-[11px] text-slate">
                {group.clubIds.length} {t('groups.teams')}
              </p>
            </div>
          </header>

          <ol className="flex-1 space-y-0.5">
            {group.clubIds.map((clubId, index) => (
              <li
                key={clubId}
                className="flex items-center gap-2.5 rounded-lg px-1.5 py-2 text-sm transition-colors hover:bg-mist"
              >
                <span className="w-4 shrink-0 text-[11px] font-semibold text-slate tabular-nums">
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
