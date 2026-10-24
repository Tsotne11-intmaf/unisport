import { Link } from 'react-router-dom'

import { clubs, currentSeason, type AllstarRole, type AllstarSquad } from '@/data/football'
import { useI18n, type TranslationKey } from '@/lib/i18n'

const roleKey: Record<AllstarRole, TranslationKey> = {
  gk: 'role.gk',
  defender: 'role.defender',
  midfielder: 'role.midfielder',
  striker: 'role.striker',
}

const clubIndex = new Map(clubs.map((club) => [club.id, club]))

/**
 * The All-Star XI as a small pitch, mirroring the league's own match graphic:
 * one striker, a central midfielder, two wide defenders and the keeper, with
 * the named substitutes underneath.
 */
export function AllstarPitch({ squad }: { squad: AllstarSquad }) {
  const { t, l } = useI18n()

  return (
    <div
      className="overflow-hidden rounded-[1.75rem] p-4 sm:p-6"
      style={{
        backgroundImage:
          'radial-gradient(circle at 12% 8%, #ff4f9e 0%, transparent 42%), linear-gradient(145deg, #e5197d 0%, #c01267 55%, #8e0d4c 100%)',
      }}
    >
      <div className="mb-5 text-center">
        <p className="text-2xl font-bold tracking-tight text-white">ALLSTAR {squad.season}</p>
        <p className="mt-1 text-xs font-semibold text-white/85">{l(currentSeason)}</p>
      </div>

      <div className="relative mx-auto aspect-[4/5] w-full max-w-sm">
        <svg viewBox="0 0 100 125" className="absolute inset-0 size-full" aria-hidden="true">
          {/* Pitch surface, narrower at the top to fake a camera angle. */}
          <defs>
            <linearGradient id="turf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8fd43f" />
              <stop offset="100%" stopColor="#5faf21" />
            </linearGradient>
          </defs>
          <polygon points="14,0 86,0 100,125 0,125" fill="url(#turf)" />
          <g fill="none" stroke="rgb(255 255 255 / 0.85)" strokeWidth="0.8">
            <polygon points="14,0 86,0 100,125 0,125" />
            <polygon points="34,0 66,0 69,24 31,24" />
            <polygon points="44,0 56,0 57,5 43,5" />
            <polygon points="30,98 70,98 74,125 26,125" />
            <polygon points="44,119 56,119 58,125 42,125" />
            <line x1="7" y1="62.5" x2="93" y2="62.5" />
            <ellipse cx="50" cy="62.5" rx="13" ry="9" />
          </g>
        </svg>

        {squad.slots.map((slot) => {
          const club = slot.clubId ? clubIndex.get(slot.clubId) : undefined

          return (
            <div
              key={slot.id}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            >
              <Shirt crest={club?.logoUrl ?? null} crestAlt={club?.name ?? ''} />
              <span className="rounded-md bg-ink/85 px-2 py-0.5 text-center text-[10px] leading-tight font-bold whitespace-nowrap text-white">
                {slot.playerName ?? t(roleKey[slot.role])}
                {slot.isCaptain && <span className="ml-1 text-amber">C</span>}
              </span>
            </div>
          )
        })}
      </div>

      {squad.bench.length > 0 && (
        <div className="mt-5 border-t border-white/20 pt-4">
          <p className="mb-3 text-center text-[11px] font-bold tracking-wide text-white/70 uppercase">
            {t('allstar.bench')}
          </p>
          <ul className="flex flex-wrap justify-center gap-6">
            {squad.bench.map((player) => {
              const club = player.clubId ? clubIndex.get(player.clubId) : undefined
              return (
                <li key={player.id} className="flex flex-col items-center gap-1.5">
                  <Shirt crest={club?.logoUrl ?? null} crestAlt={club?.name ?? ''} />
                  <span className="rounded-md bg-ink/85 px-2 py-0.5 text-[10px] font-bold whitespace-nowrap text-white">
                    {player.playerName}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/12 p-4 ring-1 ring-white/20">
        <p className="max-w-sm text-sm leading-relaxed font-medium text-white">
          {t('allstar.invite')}
        </p>
        <Link
          to="/register"
          className="shrink-0 rounded-pill bg-white px-4 py-2.5 text-sm font-bold text-ink transition-opacity hover:opacity-90"
        >
          {t('allstar.inviteCta')} →
        </Link>
      </div>
    </div>
  )
}

function Shirt({ crest, crestAlt }: { crest: string | null; crestAlt: string }) {
  return (
    <span className="grid size-11 place-items-center rounded-full bg-white shadow-md sm:size-12">
      {crest ? (
        <img src={crest} alt={crestAlt} className="size-9 rounded-full object-contain" />
      ) : (
        <ShirtIcon />
      )}
    </span>
  )
}

function ShirtIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="text-ink/80"
    >
      <path d="M8.5 2 4 4.2a1 1 0 0 0-.54 1.11l.7 3.1a1 1 0 0 0 1.2.75l1.14-.26V21a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V8.9l1.14.26a1 1 0 0 0 1.2-.75l.7-3.1A1 1 0 0 0 20 4.2L15.5 2a3.6 3.6 0 0 1-7 0Z" />
    </svg>
  )
}
