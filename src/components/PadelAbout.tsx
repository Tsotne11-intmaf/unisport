import { Pill } from '@/components/ui'
import { placesLeft } from '@/data/selectors'
import { useI18n } from '@/lib/i18n'
import type { Tournament } from '@/types'

/**
 * The padel page's statement block: one line about the hub, a photo carrying
 * the headline figure, then two stat cards. Every number is counted from the
 * tournaments on the page, never written in by hand.
 */
export function PadelAbout({ tournaments }: { tournaments: Tournament[] }) {
  const { t } = useI18n()

  const open = tournaments.filter((item) => item.status === 'registration_open')
  const totalPlaces = tournaments.reduce((sum, item) => sum + (item.slots ?? 0), 0)
  const freePlaces = open.reduce((sum, item) => sum + (placesLeft(item) ?? 0), 0)

  return (
    <div>
      <div className="mx-auto max-w-3xl text-center">
        <Pill variant="soft">{t('padel.aboutEyebrow')}</Pill>
        {/* A heading, so it picks up the display face, with the payoff
            highlighted the way the accent is used elsewhere. */}
        <h2 className="mt-6 text-3xl leading-[1.15] font-semibold text-balance sm:text-5xl">
          {t('padel.aboutLead')}{' '}
          <span className="relative inline-block whitespace-nowrap">
            <span
              className="absolute inset-x-[-0.12em] bottom-[0.08em] block h-[0.42em] rounded-sm bg-padel"
              aria-hidden="true"
            />
            <span className="relative">{t('padel.aboutHighlight')}</span>
          </span>
        </h2>
      </div>

      <div className="mt-10 grid gap-4">
        <figure className="relative overflow-hidden rounded-[1.75rem]">
          <img
            src="/gallery/padel-feature.webp"
            alt=""
            loading="lazy"
            className="aspect-[16/9] w-full object-cover"
            style={{ objectPosition: '50% 32%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-ink/25" />

          <figcaption className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7">
            <span>
              <span className="block text-4xl font-bold text-white tabular-nums sm:text-5xl">
                {freePlaces}
              </span>
              <span className="mt-0.5 block text-sm font-medium text-white/80">
                {t('padel.placesLeft')}
              </span>
            </span>
          </figcaption>
        </figure>

        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            value={open.length}
            label={t('padel.openTournaments')}
            className="bg-padel text-ink"
            ballClass="bg-ink/10"
          />
          <StatCard
            value={totalPlaces}
            label={t('padel.totalPlaces')}
            className="bg-[#2f6bf3] text-white"
            ballClass="bg-white/15"
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({
  value,
  label,
  className,
  ballClass,
}: {
  value: number
  label: string
  className: string
  ballClass: string
}) {
  return (
    <div className={`relative overflow-hidden rounded-[1.75rem] p-6 sm:p-7 ${className}`}>
      {/* The faint ball in the corner, as on the reference layout. */}
      <span
        className={`absolute -right-8 -bottom-10 size-44 rounded-full ${ballClass}`}
        aria-hidden="true"
      />
      <p className="relative text-4xl font-bold tabular-nums sm:text-5xl">{value}</p>
      <p className="relative mt-1 text-sm font-medium opacity-80">{label}</p>
    </div>
  )
}
