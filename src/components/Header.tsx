import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

import { useHub } from '@/data/HubProvider'
import { ALL } from '@/data/selectors'
import { useI18n, type TranslationKey } from '@/lib/i18n'

const links: Array<{ to: string; key: TranslationKey }> = [
  { to: '/', key: 'nav.home' },
  { to: '/padel', key: 'nav.padel' },
  { to: '/football', key: 'nav.football' },
  { to: '/events', key: 'nav.events' },
  { to: '/news', key: 'nav.news' },
  { to: '/universities', key: 'nav.universities' },
]

export function Header() {
  const { t, lang, setLang } = useI18n()
  const { universityById, myUniversityId } = useHub()
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // A tap on a nav link should close the sheet it was tapped in.
  useEffect(() => setOpen(false), [location.pathname])

  const myUniversity = myUniversityId === ALL ? undefined : universityById(myUniversityId)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-xl">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-ink text-sm font-bold text-white">
            U
          </span>
          <span className="text-lg font-semibold tracking-tight">UniSport</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-mist text-ink' : 'text-slate hover:text-ink'
                }`
              }
            >
              {t(link.key)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {myUniversity && (
            <span
              className="hidden items-center gap-1.5 rounded-pill border border-line px-2.5 py-1.5 text-xs font-semibold sm:inline-flex"
              title={t('filter.myUniversity')}
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: myUniversity.color }}
              />
              {myUniversity.shortName}
            </span>
          )}

          <div className="flex rounded-lg border border-line p-0.5">
            {(['ka', 'en'] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={`cursor-pointer rounded-md px-2 py-1 text-xs font-bold uppercase transition-colors ${
                  lang === code ? 'bg-ink text-white' : 'text-slate hover:text-ink'
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          <Link
            to="/register"
            className="hidden rounded-pill bg-ink px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:inline-block"
          >
            {t('nav.register')}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={t('nav.menu')}
            className="grid size-9 cursor-pointer place-items-center rounded-lg border border-line lg:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 block h-0.5 w-4 bg-ink transition-transform ${
                  open ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute top-1.5 left-0 block h-0.5 w-4 bg-ink transition-opacity ${
                  open ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-4 bg-ink transition-transform ${
                  open ? 'top-1.5 -rotate-45' : 'top-3'
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-paper lg:hidden">
          <div className="shell grid gap-1 py-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-mist text-ink' : 'text-slate'
                  }`
                }
              >
                {t(link.key)}
              </NavLink>
            ))}
            <Link
              to="/register"
              className="mt-1 rounded-lg bg-ink px-3 py-2.5 text-center text-sm font-semibold text-white"
            >
              {t('nav.register')}
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
