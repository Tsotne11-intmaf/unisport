import { Link, useSearchParams } from 'react-router-dom'

import { FeatureNewsCard, NewsCard } from '@/components/cards'
import { UniversityFilter } from '@/components/UniversityFilter'
import { EmptyState, Pill, SectionHeading, Themed } from '@/components/ui'
import { useHub } from '@/data/HubProvider'
import { ALL, filterNews } from '@/data/selectors'
import { formatDate } from '@/lib/format'
import { useI18n } from '@/lib/i18n'
import type { SportId } from '@/types'

export function NewsPage() {
  const [params, setParams] = useSearchParams()
  const { lang, t, l } = useI18n()
  const hub = useHub()

  const universityId = params.get('uni') ?? hub.myUniversityId
  const sportParam = params.get('sport')
  const sportId =
    sportParam === 'football' || sportParam === 'padel' ? (sportParam as SportId) : undefined

  const news = filterNews(hub.news, { sportId, universityId })
  const [lead, ...rest] = news
  const mustRead = news.filter((item) => item.isAnnouncement).slice(0, 4)

  const setParam = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(params)
    if (!value || (key === 'uni' && value === ALL)) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  return (
    <Themed theme="news">
      <section className="border-b border-line">
        <div className="shell py-10 sm:py-14">
          <Pill variant="accent">{t('nav.news')}</Pill>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">{t('section.news')}</h1>
          <p className="mt-2 text-sm text-slate">
            {t('filter.showing')}: {news.length}
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <p className="mb-2.5 text-xs font-semibold tracking-wide text-slate">
                {t('filter.sport')}
              </p>
              <div className="flex gap-2">
                <SportChip
                  active={!sportId}
                  label={t('filter.allSports')}
                  onClick={() => setParam('sport', undefined)}
                />
                {hub.sports.map((sport) => (
                  <SportChip
                    key={sport.id}
                    active={sportId === sport.id}
                    label={l(sport.name)}
                    onClick={() => setParam('sport', sport.id)}
                  />
                ))}
              </div>
            </div>

            <UniversityFilter
              universities={hub.universities}
              value={universityId}
              onChange={(next) => setParam('uni', next)}
            />
          </div>
        </div>
      </section>

      {/* Campus row — a quick jump into any single university's coverage. */}
      <section className="border-b border-line bg-mist">
        <div className="shell hide-scrollbar flex gap-5 overflow-x-auto py-5">
          {hub.universities.map((university) => (
            <Link
              key={university.id}
              to={`/news?uni=${university.id}`}
              className="flex w-16 shrink-0 flex-col items-center gap-1.5 text-center"
            >
              <span
                className="grid size-12 place-items-center rounded-full text-[11px] font-bold ring-2 ring-offset-2 ring-offset-mist transition-transform hover:scale-105"
                style={{
                  backgroundColor: `${university.color}1f`,
                  color: university.color,
                  // @ts-expect-error -- custom property for the ring colour
                  '--tw-ring-color': university.color,
                }}
              >
                {university.shortName.slice(0, 4)}
              </span>
              <span className="w-full truncate text-[11px] text-slate">
                {university.shortName}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {news.length === 0 ? (
        <div className="shell py-14">
          <EmptyState />
        </div>
      ) : (
        <>
          <section className="shell py-12">
            <FeatureNewsCard item={lead} />
          </section>

          <div className="shell grid gap-12 pb-12 lg:grid-cols-[1fr_20rem]">
            <section>
              <SectionHeading index={1} eyebrow={t('nav.news')} title={t('section.latest')} />
              {rest.length ? (
                <div className="grid gap-8 sm:grid-cols-2">
                  {rest.map((item) => (
                    <NewsCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </section>

            {mustRead.length > 0 && (
              <aside className="lg:border-l lg:border-line lg:pl-8">
                <h2 className="mb-5 text-xl font-semibold">{t('section.mustRead')}</h2>
                <ul className="divide-y divide-line">
                  {mustRead.map((item) => (
                    <li key={item.id} className="py-4 first:pt-0">
                      <Link to={`/news/${item.slug}`} className="group block">
                        <p className="text-xs font-semibold text-[var(--accent)]">
                          {t('label.announcement')}
                        </p>
                        <h3 className="mt-1 text-sm leading-snug font-semibold group-hover:underline">
                          {l(item.title)}
                        </h3>
                        <p className="mt-1 text-xs text-slate">
                          {formatDate(item.publishedAt, lang)} · {item.readMinutes}{' '}
                          {t('label.minRead')}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </aside>
            )}
          </div>
        </>
      )}
    </Themed>
  )
}

function SportChip({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 cursor-pointer rounded-pill border px-3.5 py-2 text-sm font-semibold transition-colors ${
        active
          ? 'border-transparent bg-ink text-white'
          : 'border-line bg-paper text-graphite hover:border-ink/35'
      }`}
    >
      {label}
    </button>
  )
}
