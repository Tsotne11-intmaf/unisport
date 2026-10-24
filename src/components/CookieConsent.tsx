import { useEffect, useState } from 'react'

import { useI18n } from '@/lib/i18n'

const STORAGE_KEY = 'unisport:consent'

export type Consent = 'accepted' | 'essential'

/** What the visitor chose, or null while they have not chosen yet. */
export function readConsent(): Consent | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'accepted' || stored === 'essential' ? stored : null
  } catch {
    // Private browsing can refuse storage; treat that as "not asked yet".
    return null
  }
}

/**
 * The cookie bar. It asks once, remembers the answer, and stays out of the way
 * afterwards. Declining is one click, the same size as accepting.
 */
export function CookieConsent() {
  const { t } = useI18n()
  const [choice, setChoice] = useState<Consent | null | undefined>(undefined)

  // Read after mount so the server-rendered markup and the first paint agree.
  useEffect(() => setChoice(readConsent()), [])

  const decide = (next: Consent) => {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Nothing to do — the bar closes for this visit either way.
    }
    setChoice(next)
  }

  if (choice !== null) return null

  return (
    <div
      role="dialog"
      aria-label={t('cookie.title')}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper/95 backdrop-blur-xl"
    >
      <div className="shell flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex-1">
          <p className="text-sm font-bold">{t('cookie.title')}</p>
          <p className="mt-1 text-sm leading-relaxed text-slate">{t('cookie.body')}</p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide('essential')}
            className="flex-1 cursor-pointer rounded-pill border border-line px-4 py-2.5 text-sm font-semibold text-graphite transition-colors hover:border-ink sm:flex-none"
          >
            {t('cookie.essential')}
          </button>
          <button
            type="button"
            onClick={() => decide('accepted')}
            className="flex-1 cursor-pointer rounded-pill bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:flex-none"
          >
            {t('cookie.accept')}
          </button>
        </div>
      </div>
    </div>
  )
}
