import { useEffect, useRef, useState } from 'react'

import { useI18n } from '@/lib/i18n'

const PHONE_DISPLAY = '597 56 16 70'
const PHONE_HREF = 'tel:+995597561670'

/**
 * A magnifying glass over the one line nobody would otherwise stop to read.
 * The sentence is set tiny and faint across the band; as the band scrolls into
 * view the lens swings in and the words come into focus inside it.
 */
export function AddUniversityLens() {
  const { t } = useI18n()
  const band = useRef<HTMLDivElement>(null)
  const [found, setFound] = useState(false)

  useEffect(() => {
    const el = band.current
    if (!el) return

    // Once it has been read there is nothing left to reveal, so stop watching.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setFound(true)
        observer.disconnect()
      },
      { threshold: 0.45 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={band}
      className="relative flex min-h-[22rem] items-center justify-center overflow-hidden sm:min-h-[26rem]"
    >
      {/* What the lens is reading — the same sentence, too small to bother with. */}
      <p
        aria-hidden
        className="pointer-events-none absolute inset-x-0 text-center text-[11px] tracking-wide text-slate/45 blur-[0.6px] select-none"
      >
        {t('addUni.lead')} {PHONE_DISPLAY}
      </p>

      <div
        className={`relative transition-all duration-700 ease-out motion-reduce:transition-none ${
          found ? 'translate-y-0 rotate-0 opacity-100' : '-rotate-6 translate-y-8 opacity-0'
        }`}
      >
        {/* The handle is drawn first so the rim covers the joint. */}
        <span
          aria-hidden
          className="absolute h-24 w-5 rounded-full bg-ink sm:h-28"
          style={{
            left: '85.35%',
            top: '85.35%',
            transform: 'translateX(-50%) rotate(-45deg)',
            transformOrigin: 'top center',
          }}
        />

        {/* On a phone the lens comes down a size: at size-64 the handle runs
            past the right edge and the page scrolls sideways. */}
        <div className="relative grid size-52 place-items-center overflow-hidden rounded-full border-[7px] border-ink bg-paper shadow-[0_26px_60px_-26px_rgb(13_14_17_/_0.55)] min-[360px]:size-56 sm:size-72">
          <div
            className={`px-5 text-center transition-all delay-200 duration-700 ease-out motion-reduce:transition-none min-[360px]:px-6 sm:px-9 ${
              found ? 'scale-100 opacity-100 blur-0' : 'scale-50 opacity-0 blur-[3px]'
            }`}
          >
            <p className="text-[13px] leading-snug font-semibold text-graphite">
              {t('addUni.lead')}
            </p>
            <a
              href={PHONE_HREF}
              className="mt-2.5 block text-2xl font-bold tracking-tight underline decoration-padel decoration-[6px] underline-offset-4 sm:text-[1.75rem]"
            >
              {PHONE_DISPLAY}
            </a>
          </div>

          {/* The glint that makes it read as glass rather than a plain circle. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/80 via-white/5 to-transparent"
          />
        </div>
      </div>
    </div>
  )
}
