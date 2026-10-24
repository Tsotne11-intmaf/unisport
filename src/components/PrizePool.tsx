import type { PrizePlace } from '@/data/schedule'
import { useI18n, type TranslationKey } from '@/lib/i18n'

const placeKey: Record<PrizePlace['place'], TranslationKey> = {
  first: 'label.first',
  second: 'label.second',
  third: 'label.third',
}

/**
 * What the tournament pays out. Where the amounts are set they are named; where
 * they are not, the section says so rather than quoting a figure, because the
 * pot depends on how many enter.
 */
export function PrizePool({
  solo = false,
  places,
}: {
  solo?: boolean
  places?: PrizePlace[]
} = {}) {
  const { t } = useI18n()

  if (places?.length) {
    // Thin space for thousands: a comma reads as a decimal point here.
    const total = places.reduce((sum, place) => sum + place.amount, 0)

    return (
      <div className="rounded-card border border-line bg-[var(--accent-soft)] px-5 py-10 sm:px-8">
        <p className="text-center text-xs font-bold tracking-widest text-slate uppercase">
          {t('prize.label')}
        </p>
        <p className="mt-3 text-center text-4xl font-bold tabular-nums sm:text-5xl">
          {total.toLocaleString('en-US').replace(/,/g, ' ')} ₾
        </p>

        <ol className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
          {places.map((place, index) => (
            <li
              key={place.place}
              className="rounded-2xl border border-line bg-paper px-4 py-5 text-center"
            >
              <span
                className="mx-auto grid size-8 place-items-center rounded-full text-xs font-bold"
                style={{
                  backgroundColor: ['#f5d67a', '#dfe3e8', '#e3bb94'][index],
                  color: '#0d0e11',
                }}
              >
                {index + 1}
              </span>
              <p className="mt-3 text-xs font-semibold text-slate">{t(placeKey[place.place])}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{place.amount} ₾</p>
            </li>
          ))}
        </ol>
      </div>
    )
  }

  return (
    <div className="rounded-card border border-line bg-[var(--accent-soft)] px-6 py-14 text-center">
      <p className="text-xs font-bold tracking-widest text-slate uppercase">
        {t('prize.label')}
      </p>
      <p className="mt-4 text-3xl font-bold min-[360px]:text-4xl sm:text-5xl">{t('prize.tbd')}</p>
      <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-graphite">
        {t(solo ? 'prize.noteSolo' : 'prize.note')}
      </p>
    </div>
  )
}
