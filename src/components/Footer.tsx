import { Link } from 'react-router-dom'

import { useHub } from '@/data/HubProvider'
import { useI18n, type TranslationKey } from '@/lib/i18n'

const columns: Array<{ to: string; key: TranslationKey }> = [
  { to: '/padel', key: 'nav.padel' },
  { to: '/football', key: 'nav.football' },
  { to: '/events', key: 'nav.events' },
  { to: '/news', key: 'nav.news' },
  { to: '/universities', key: 'nav.universities' },
  { to: '/register', key: 'nav.register' },
]

export function Footer() {
  const { t } = useI18n()
  const { source } = useHub()

  return (
    <footer className="mt-20 border-t border-line bg-mist">
      <div className="shell flex flex-col gap-8 py-12 sm:flex-row sm:justify-between">
        <div className="max-w-xs">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            UniSport
          </Link>
          <p className="mt-2 text-sm text-slate">{t('footer.tagline')}</p>
          {source === 'seed' && (
            <p className="mt-3 text-xs text-slate">{t('footer.dataNotice')}</p>
          )}
        </div>

        {/* py-1.5 is what makes each row a thumb-sized target on a phone;
            without it the links are 20px of text with gaps between them. */}
        <nav className="grid grid-cols-2 gap-x-10 text-sm sm:grid-cols-3">
          {columns.map((column) => (
            <Link
              key={column.to}
              to={column.to}
              className="py-1.5 text-slate transition-colors hover:text-ink"
            >
              {t(column.key)}
            </Link>
          ))}
        </nav>
      </div>

      <div className="shell border-t border-line py-5 text-xs text-slate">
        © {new Date().getFullYear()} UniSport. {t('footer.rights')}
      </div>
    </footer>
  )
}
