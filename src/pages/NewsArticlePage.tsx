import { Link, Navigate, useParams } from 'react-router-dom'

import { NewsCard } from '@/components/cards'
import { Media, Pill, SectionHeading, Themed, UniversityChip } from '@/components/ui'
import { useHub } from '@/data/HubProvider'
import { formatDate, formatDayMonth } from '@/lib/format'
import { useI18n } from '@/lib/i18n'

export function NewsArticlePage() {
  const { slug } = useParams()
  const { lang, t, l } = useI18n()
  const hub = useHub()

  const item = hub.news.find((entry) => entry.slug === slug)

  // Wait for the Supabase fetch before deciding a slug is genuinely missing.
  if (!item) {
    if (hub.loading) return <div className="shell py-20" />
    return <Navigate to="/news" replace />
  }

  const university = hub.universityById(item.universityId)
  const sport = item.sportId ? hub.sportById(item.sportId) : undefined

  const related = hub.news
    .filter(
      (entry) =>
        entry.id !== item.id &&
        (entry.sportId === item.sportId || entry.universityId === item.universityId),
    )
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3)

  return (
    <Themed theme="news">
      <article className="shell max-w-3xl py-10 sm:py-14">
        <Link
          to="/news"
          className="text-sm font-semibold text-slate underline-offset-4 hover:underline"
        >
          ← {t('nav.news')}
        </Link>

        <div className="mt-6 rounded-[2rem] border border-line bg-paper p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-2">
          {item.isAnnouncement && <Pill variant="accent">{t('label.announcement')}</Pill>}
          {sport && <Pill>{l(sport.name)}</Pill>}
          <span className="text-xs text-slate">
            {formatDate(item.publishedAt, lang)} · {item.readMinutes} {t('label.minRead')}
          </span>
        </div>

        <h1 className="mt-4 text-4xl leading-tight font-semibold sm:text-5xl">
          {l(item.title)}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate">{l(item.excerpt)}</p>

        <Media
          src={item.imageUrl}
          alt={l(item.title)}
          kind={item.sportId ?? 'news'}
          tint={university?.color}
          label={university?.shortName}
          ratio="aspect-[16/9]"
          className="mt-8 rounded-card"
        />

        {university && (
          <div className="mt-6 flex items-center gap-3 border-y border-line py-4">
            <UniversityChip university={university} size="sm" />
            <div className="min-w-0">
              <p className="text-xs text-slate">{t('label.host')}</p>
              <p className="truncate text-sm font-semibold">{l(university.name)}</p>
            </div>
            <Link
              to={`/news?uni=${university.id}`}
              className="ml-auto shrink-0 text-xs font-semibold text-[var(--accent)]"
            >
              {t('action.viewAll')} →
            </Link>
          </div>
        )}

        <p className="mt-8 text-[17px] leading-loose">{l(item.body)}</p>

        {/* Milestones pinned at the foot, set right so they read as markers
            rather than another paragraph. */}
        {item.keyDates.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-end gap-2 border-t border-line pt-6">
            <span className="mr-auto text-xs font-bold tracking-wide text-slate uppercase">
              {t('news.keyDates')}
            </span>
            {item.keyDates.map((entry) => (
              <span
                key={entry.date + l(entry.label)}
                className="inline-flex items-center gap-2 rounded-pill bg-[var(--accent-soft)] py-1.5 pr-3 pl-2.5 text-xs font-semibold"
              >
                <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold text-[var(--accent-ink)] tabular-nums">
                  {formatDayMonth(entry.date, lang)}
                </span>
                {l(entry.label)}
              </span>
            ))}
          </div>
        )}
        </div>
      </article>

      {related.length > 0 && (
        <div className="shell pb-10">
          <SectionHeading title={t('section.fromCampus')} />
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((entry) => (
              <NewsCard key={entry.id} item={entry} />
            ))}
          </div>
        </div>
      )}
    </Themed>
  )
}
