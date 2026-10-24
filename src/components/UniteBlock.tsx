import { useI18n } from '@/lib/i18n'

/**
 * The mission statement: two overlapping photos on one side, the message on the
 * other. The overlap is what keeps it from reading as a plain two-column row.
 */
export function UniteBlock() {
  const { t } = useI18n()

  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      {/* Left photo sits high, right photo drops below it and covers one corner. */}
      <div className="relative pb-16 sm:pb-24 lg:pb-28">
        <img
          src="/gallery/unite-football.webp"
          alt=""
          loading="lazy"
          className="aspect-[4/5] w-[72%] rounded-sm object-cover"
          style={{ objectPosition: '50% 45%' }}
        />
        <img
          src="/gallery/unite-padel.webp"
          alt=""
          loading="lazy"
          className="absolute right-0 bottom-0 aspect-[4/5] w-[58%] rounded-sm border-[6px] border-paper object-cover sm:w-[52%]"
          style={{ objectPosition: '50% 55%' }}
        />
      </div>

      <div>
        <p className="inline-block border-b-2 border-[var(--accent)] pb-0.5 text-xs font-bold tracking-wider text-[var(--accent)] uppercase">
          {t('unite.eyebrow')}
        </p>

        <h2 className="mt-5 text-4xl leading-[1.12] font-semibold text-balance sm:text-5xl">
          {t('unite.titleLead')}{' '}
          <span className="underline decoration-[var(--accent)] decoration-4 underline-offset-[6px]">
            {t('unite.titleMark')}
          </span>{' '}
          {t('unite.titleTail')}
        </h2>

        <p className="mt-6 max-w-lg leading-relaxed text-slate">{t('unite.body')}</p>

        <blockquote className="mt-7 max-w-lg border-l-[3px] border-[var(--accent)] pl-5 text-[15px] leading-relaxed font-medium">
          {t('unite.quote')}
        </blockquote>
      </div>
    </div>
  )
}
