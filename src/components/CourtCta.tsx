import { Link } from 'react-router-dom'

import { useI18n } from '@/lib/i18n'

/**
 * The closing call to action: a photo with a ball halo on one side, the
 * invitation on a dark panel on the other.
 */
export function CourtCta({ photo }: { photo: string }) {
  const { t } = useI18n()

  return (
    <div className="grid overflow-hidden rounded-[1.75rem] bg-ink lg:grid-cols-2">
      <div className="relative min-h-64 overflow-hidden">
        {/* The ball halo sits behind the player, as on the reference layout. */}
        <span
          className="absolute top-1/2 left-1/2 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-padel sm:size-72"
          aria-hidden="true"
        />
        <img
          src={photo}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover mix-blend-luminosity"
          style={{ objectPosition: '58% 68%' }}
        />
        <span
          className="absolute inset-0 bg-court/35 mix-blend-multiply"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-col justify-center gap-5 p-7 sm:p-10">
        <h2 className="max-w-md text-3xl leading-tight font-semibold text-white sm:text-4xl">
          {t('cta.title')}
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-white/70">{t('cta.body')}</p>
        <Link
          to="/register"
          className="w-fit rounded-pill bg-padel px-5 py-3 text-sm font-bold text-ink transition-opacity hover:opacity-90"
        >
          {t('cta.button')} →
        </Link>
      </div>
    </div>
  )
}
