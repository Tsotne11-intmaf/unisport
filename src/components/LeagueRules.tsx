import { leagueRules, matchDurations, type RuleSection } from '@/data/rules'
import type { Localized } from '@/types'
import { useI18n } from '@/lib/i18n'

/**
 * A set of regulations. It defaults to the football league's, which is what
 * most entry sheets show; the console tournament passes its own.
 */
export function LeagueRules({
  sections = leagueRules,
  durations = matchDurations,
}: {
  sections?: RuleSection[]
  durations?: Array<{ stage: Localized; minutes: number }>
} = {}) {
  const { t, l } = useI18n()

  return (
    <div className="space-y-5">
      {/* One length for the whole tournament reads as a statement; several
          read as a table, so the single case gets the full width. */}
      <div
        className={`overflow-hidden rounded-card border border-line bg-[var(--accent-soft)] ${
          durations.length === 1 ? '' : 'bg-paper p-5'
        }`}
      >
        {durations.length === 1 ? (
          <div className="flex flex-col items-center gap-1 px-6 py-8 text-center">
            <p className="text-xs font-bold tracking-widest text-slate uppercase">
              {t('rules.duration')}
            </p>
            <p className="mt-1 text-5xl font-bold tabular-nums sm:text-6xl">
              {durations[0].minutes}
              <span className="ml-2 text-xl font-semibold text-slate sm:text-2xl">
                {t('rules.minutes')}
              </span>
            </p>
            <p className="text-sm font-medium text-graphite">{l(durations[0].stage)}</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-xs font-bold tracking-wide text-slate uppercase">
              {t('rules.duration')}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {durations.map((entry) => (
                <div
                  key={entry.minutes}
                  className="rounded-xl bg-[var(--accent-soft)] px-4 py-3 text-center"
                >
                  <p className="text-2xl font-bold tabular-nums">
                    {entry.minutes}
                    <span className="ml-1 text-sm font-semibold text-slate">
                      {t('rules.minutes')}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-graphite">{l(entry.stage)}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div
        className={`grid gap-4 md:grid-cols-2 ${
          sections.length % 3 === 0 ? "lg:grid-cols-3" : ""
        }`}
      >
        {sections.map((section, index) => (
          <section
            key={section.id}
            className="rounded-card border border-line bg-paper p-5 transition-colors hover:border-ink/20"
          >
            <h3 className="flex items-start gap-3 text-base font-bold">
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent)] tabular-nums">
                {index + 1}
              </span>
              <span className="leading-snug">{l(section.title)}</span>
            </h3>

            {section.body && (
              <p className="mt-3 pl-10 text-sm leading-relaxed text-slate">
                {l(section.body)}
              </p>
            )}

            {section.items && (
              <ol className="mt-3 space-y-2">
                {section.items.map((item, index) => (
                  <li key={l(item)} className="flex gap-3 text-sm leading-relaxed">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-mist text-[10px] font-bold text-slate tabular-nums">
                      {index + 1}
                    </span>
                    <span className="text-slate">{l(item)}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
