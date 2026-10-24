import { useState } from 'react'

import { clubs, type TournamentGroup } from '@/data/football'
import { useI18n } from '@/lib/i18n'

const clubIndex = new Map(clubs.map((club) => [club.id, club]))

export function TournamentGroups({ groups }: { groups: TournamentGroup[] }) {
  const { t, l } = useI18n()
  // The first group starts open so the section never reads as an empty list of buttons.
  const [open, setOpen] = useState<string[]>(() => groups.slice(0, 1).map((group) => group.id))

  const toggle = (id: string) =>
    setOpen((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )

  return (
    <div className="overflow-hidden rounded-card border border-line bg-paper">
      {groups.map((group) => {
        const expanded = open.includes(group.id)
        const table = [...group.standings].sort((a, b) => b.points - a.points)

        return (
          <div key={group.id} className="border-b border-line last:border-b-0">
            <button
              type="button"
              onClick={() => toggle(group.id)}
              aria-expanded={expanded}
              className="flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-mist"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--accent)] text-sm font-bold text-[var(--accent-ink)]">
                {group.code}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{l(group.name)}</span>
                <span className="text-xs text-slate">
                  {group.standings.length} {t('groups.teams')}
                </span>
              </span>
              <Chevron open={expanded} />
            </button>

            {expanded && (
              <div className="overflow-x-auto border-t border-line">
                <table className="w-full min-w-[30rem] border-collapse text-sm">
                  <thead>
                    <tr className="text-xs text-slate">
                      <th className="w-10 py-2.5 pl-5 text-left font-semibold">#</th>
                      <th className="py-2.5 text-left font-semibold">{t('table.club')}</th>
                      <th className="w-10 py-2.5 text-center font-semibold">{t('table.played')}</th>
                      <th className="w-10 py-2.5 text-center font-semibold">{t('table.won')}</th>
                      <th className="w-10 py-2.5 text-center font-semibold">{t('table.drawn')}</th>
                      <th className="w-10 py-2.5 text-center font-semibold">{t('table.lost')}</th>
                      <th className="w-14 py-2.5 pr-5 text-center font-semibold">
                        {t('table.points')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.map((row, index) => {
                      const club = clubIndex.get(row.clubId)
                      return (
                        <tr key={row.clubId} className="border-t border-line">
                          <td className="py-3 pl-5">
                            <span
                              className={`grid size-6 place-items-center rounded-md text-xs font-bold ${
                                index === 0
                                  ? 'bg-[var(--accent)] text-[var(--accent-ink)]'
                                  : 'text-slate'
                              }`}
                            >
                              {index + 1}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="flex items-center gap-2.5">
                              <ClubCrest name={club?.name ?? row.clubId} src={club?.logoUrl ?? null} size={32} />
                              <span className="truncate font-semibold">{club?.name}</span>
                            </span>
                          </td>
                          <td className="py-3 text-center tabular-nums">{row.played}</td>
                          <td className="py-3 text-center tabular-nums">{row.won}</td>
                          <td className="py-3 text-center tabular-nums">{row.drawn}</td>
                          <td className="py-3 text-center tabular-nums">{row.lost}</td>
                          <td className="py-3 pr-5 text-center font-bold tabular-nums">
                            {row.points}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function ClubCrest({
  name,
  src,
  size = 28,
}: {
  name: string
  src: string | null
  size?: number
}) {
  if (src) {
    // object-contain, so a crest with its own margins is never cropped.
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        className="shrink-0 rounded-md bg-mist object-contain"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <span
      className="grid shrink-0 place-items-center rounded-md bg-mist text-[10px] font-bold text-slate"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {name.slice(0, 2).toUpperCase()}
    </span>
  )
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 text-slate transition-transform ${open ? 'rotate-180' : ''}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
