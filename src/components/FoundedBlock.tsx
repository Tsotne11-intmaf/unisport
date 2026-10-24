import { Pill } from '@/components/ui'
import { useI18n } from '@/lib/i18n'

const FOUNDED_YEAR = '2026'

/** Who we are: the year on one side, the story and two photos on the other. */
export function FoundedBlock() {
  const { t } = useI18n()

  return (
    <div className="grid gap-10 rounded-[2rem] border border-line bg-mist p-7 sm:p-10 lg:grid-cols-[13rem_1fr] lg:gap-14 lg:p-14">
      <div>
        <p className="text-sm font-medium text-slate">{t('about.foundedLabel')}</p>
        <p className="mt-3 inline-block rounded-xl bg-padel px-5 py-2 text-5xl font-bold text-ink tabular-nums sm:text-6xl">
          {FOUNDED_YEAR}
        </p>
      </div>

      <div>
        <div className="mb-4">
          <Pill>{t('about.eyebrow')}</Pill>
        </div>

        <h2 className="max-w-2xl text-3xl leading-tight font-semibold text-balance sm:text-4xl">
          {t('about.title')}
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <img
            src="/gallery/about-1.webp"
            alt=""
            loading="lazy"
            className="aspect-[3/4] w-full rounded-2xl border-4 border-paper object-cover"
            style={{ objectPosition: '55% 50%' }}
          />
          <div className="flex flex-col gap-4">
            <img
              src="/gallery/about-2.webp"
              alt=""
              loading="lazy"
              className="aspect-[4/3] w-full rounded-2xl border-4 border-paper object-cover"
              style={{ objectPosition: '50% 45%' }}
            />
            <p className="text-sm leading-relaxed text-slate">{t('about.body')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
