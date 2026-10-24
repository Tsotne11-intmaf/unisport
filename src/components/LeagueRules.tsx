import { leagueRules, matchDurations } from '@/data/rules'
import { useI18n } from '@/lib/i18n'

/** The federation's regulations, as published by the league. */
export function LeagueRules() {
  const { t, l } = useI18n()

  return (
    <div className="space-y-5">
      <div className="rounded-card border border-line bg-paper p-5">
        <p className="mb-4 text-xs font-bold tracking-wide text-slate uppercase">
          {t('rules.duration')}
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {matchDurations.map((entry) => (
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
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {leagueRules.map((section) => (
          <section
            key={section.id}
            className="rounded-card border border-line bg-paper p-5"
          >
            <h3 className="flex items-center gap-2.5 text-base font-bold">
              <span className="block h-4 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
              {l(section.title)}
            </h3>

            {section.body && (
              <p className="mt-2.5 text-sm leading-relaxed text-slate">{l(section.body)}</p>
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
