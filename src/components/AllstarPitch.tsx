import { clubs, type AllstarRole, type AllstarSquad } from '@/data/football'
import { useI18n, type TranslationKey } from '@/lib/i18n'

const roleKey: Record<AllstarRole, TranslationKey> = {
  gk: 'role.gk',
  defender: 'role.defender',
  midfielder: 'role.midfielder',
  striker: 'role.striker',
}

const clubIndex = new Map(clubs.map((club) => [club.id, club]))

/**
 * The All-Star XI as a small pitch. Positions are fixed; the names arrive when
 * voting closes, so an unfilled slot is a normal state rather than an error.
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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xl font-bold tracking-tight text-white">ALLSTAR {squad.season}</p>
          <p className="text-xs text-white/70">{t('allstar.lede')}</p>
        </div>
        <span className="rounded-pill bg-white/15 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-white/25">
          {t('allstar.round')} {squad.round}
        </span>
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
          const filled = Boolean(slot.playerName)

          return (
            <div
              key={slot.id}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            >
              <span
                className={`grid size-11 place-items-center rounded-full text-white sm:size-12 ${
                  filled
                    ? 'bg-ink shadow-lg'
                    : 'border-2 border-dashed border-white/80 bg-white/20 backdrop-blur-[2px]'
                }`}
              >
                {filled && club?.logoUrl ? (
                  <img
                    src={club.logoUrl}
                    alt={club.name}
                    className="size-9 rounded-full bg-white object-contain p-0.5"
                  />
                ) : (
                  <ShirtIcon />
                )}
              </span>

              <span className="rounded-md bg-ink/85 px-2 py-0.5 text-center text-[10px] leading-tight font-bold whitespace-nowrap text-white">
                {slot.playerName ?? t(roleKey[slot.role])}
                {slot.isCaptain && <span className="ml-1 text-amber">C</span>}
              </span>
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-center text-xs text-white/70">
        {l({ en: 'Positions', ka: 'პოზიციები' })}: {squad.slots.length}
      </p>
    </div>
  )
}

function ShirtIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="opacity-90"
    >
      <path d="M8.5 2 4 4.2a1 1 0 0 0-.54 1.11l.7 3.1a1 1 0 0 0 1.2.75l1.14-.26V21a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V8.9l1.14.26a1 1 0 0 0 1.2-.75l.7-3.1A1 1 0 0 0 20 4.2L15.5 2a3.6 3.6 0 0 1-7 0Z" />
    </svg>
  )
}
