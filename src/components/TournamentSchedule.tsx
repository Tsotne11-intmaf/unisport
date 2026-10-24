import type { ScheduleDay, ScheduleMatch } from '@/data/schedule'
import { useI18n } from '@/lib/i18n'

/**
 * The order of play, read down the clock rather than across a grid of courts.
 * A timetable with a column per court is unreadable on a phone, and the thing
 * a player actually wants is "when am I on, and where".
 */
export function TournamentSchedule({ days }: { days: ScheduleDay[] }) {
  const { t, l } = useI18n()

  return (
    <div className="space-y-5">
      {days.map((day) => (
        <section key={day.id} className="rounded-card border border-line bg-paper p-5">
          <h3 className="flex items-center gap-2.5 text-base font-bold">
            <span className="block h-4 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
            {l(day.title)}
          </h3>

          <ol className="mt-4 space-y-2">
            {day.slots.map((slot) => (
              <li
                key={slot.time}
                className={`grid grid-cols-[4.5rem_1fr] items-start gap-3 rounded-xl px-3 py-2.5 ${
                  slot.rest ? 'bg-mist' : 'bg-[var(--accent-soft)]'
                }`}
              >
                <span className="pt-0.5 text-sm font-bold tabular-nums">{slot.time}</span>

                {slot.rest ? (
                  <span className="pt-0.5 text-sm font-medium text-slate">{l(slot.rest)}</span>
                ) : (
                  <ul className="flex flex-wrap gap-1.5">
                    {slot.matches.map((match) => (
                      <MatchChip key={l(match.name)} match={match} courtLabel={t('schedule.court')} />
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>

          {day.note && (
            <p className="mt-4 text-xs leading-relaxed text-slate">{l(day.note)}</p>
          )}
        </section>
      ))}
    </div>
  )
}

function MatchChip({ match, courtLabel }: { match: ScheduleMatch; courtLabel: string }) {
  const { l } = useI18n()

  // The later it gets, the more the tie is worth looking at.
  const weight =
    match.stage === 'final'
      ? 'border-transparent bg-ink text-white'
      : match.stage === 'third' || match.stage === 'semi'
        ? 'border-ink/25 bg-paper font-bold'
        : 'border-line bg-paper'

  return (
    <li
      className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs ${weight}`}
    >
      {match.court !== null && (
        <span
          className={`shrink-0 text-[10px] font-semibold tabular-nums ${
            match.stage === 'final' ? 'text-white/60' : 'text-slate'
          }`}
        >
          {courtLabel} {match.court}
        </span>
      )}
      <span className="font-semibold">{l(match.name)}</span>
    </li>
  )
}
