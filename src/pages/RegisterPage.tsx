import { TournamentCard } from '@/components/cards'
import { Pill, Themed } from '@/components/ui'
import { useHub } from '@/data/HubProvider'
import { openForRegistration, sortByUrgency } from '@/data/selectors'
import { useI18n } from '@/lib/i18n'

/**
 * The way in when no tournament has been chosen yet. Each card leads to that
 * tournament's own page, because their conditions have nothing in common.
 */
export function RegisterPage() {
  const { t } = useI18n()
  const hub = useHub()

  const open = sortByUrgency(openForRegistration(hub.tournaments))

  return (
    <Themed theme="neutral">
      <section className="border-b border-line bg-mist">
        <div className="shell py-12 sm:py-16">
          <Pill variant="solid">{t('nav.register')}</Pill>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold sm:text-5xl">
            {t('section.openNow')}
          </h1>
          <p className="mt-4 max-w-xl text-slate">{t('reg.indexLede')}</p>
        </div>
      </section>

      <div className="shell py-12">
        {open.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {open.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        ) : (
          <div className="rounded-card border border-dashed border-line bg-mist px-6 py-16 text-center">
            <p className="text-lg font-semibold">{t('reg.noneOpen')}</p>
          </div>
        )}
      </div>
    </Themed>
  )
}
