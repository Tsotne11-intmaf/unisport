import { useI18n } from '@/lib/i18n'

/**
 * The pot depends on how many teams enter, and that is not known yet, so the
 * section states the fact rather than quoting a figure.
 */
export function PrizePool() {
  const { t } = useI18n()

  return (
    <div className="rounded-card border border-line bg-[var(--accent-soft)] px-6 py-14 text-center">
      <p className="text-xs font-bold tracking-widest text-slate uppercase">
        {t('prize.label')}
      </p>
      <p className="mt-4 text-4xl font-bold sm:text-5xl">{t('prize.tbd')}</p>
      <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-graphite">
        {t('prize.note')}
      </p>
    </div>
  )
}
