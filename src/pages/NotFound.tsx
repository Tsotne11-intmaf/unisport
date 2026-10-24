import { Link } from 'react-router-dom'

import { useI18n } from '@/lib/i18n'

export function NotFound() {
  const { t } = useI18n()

  return (
    <div className="shell flex flex-col items-center py-28 text-center">
      <p className="text-7xl font-semibold text-line">404</p>
      <h1 className="mt-4 text-3xl font-semibold">{t('notFound.title')}</h1>
      <p className="mt-3 max-w-sm text-sm text-slate">{t('notFound.body')}</p>
      <Link
        to="/"
        className="mt-7 rounded-pill bg-ink px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        {t('nav.home')}
      </Link>
    </div>
  )
}
