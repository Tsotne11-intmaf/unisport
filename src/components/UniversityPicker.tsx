import { ALL } from '@/data/selectors'
import { useI18n } from '@/lib/i18n'
import type { University } from '@/types'

import { UniversityMark } from './ui'

/**
 * The wide card version of the university filter. Roomier than the chip row and
 * the right place to lead a section that is entirely about choosing a campus.
 */
export function UniversityPicker({
  universities,
  value,
  onChange,
  counts,
  nameOf,
  logoOf,
  markClassName,
}: {
  universities: University[]
  value: string
  onChange: (next: string) => void
  /** Optional per-university tally shown under the name, e.g. tournaments hosted. */
  counts?: Record<string, number>
  /** Override the displayed name and mark, for sections with their own brand. */
  nameOf?: (university: University) => string
  logoOf?: (university: University) => string | null
  /** Widen the mark for a wordmark logo, which a square box renders too small. */
  markClassName?: string
}) {
  const { t, l } = useI18n()

  // With a single university on the hub, an "all universities" card only
  // duplicates it, so it appears once there is a second campus to compare.
  const showAll = universities.length > 1

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {showAll && (
        <PickerCard
          active={value === ALL}
          title={t('filter.all')}
          subtitle={`${universities.length} ${t('stat.universities').toLowerCase()}`}
          onClick={() => onChange(ALL)}
        />
      )}
      {universities.map((university) => (
        <PickerCard
          key={university.id}
          active={value === university.id}
          title={nameOf ? nameOf(university) : l(university.name)}
          subtitle={l(university.city)}
          university={university}
          logoUrl={logoOf ? logoOf(university) : undefined}
          markClassName={markClassName}
          count={counts?.[university.id]}
          onClick={() => onChange(university.id)}
        />
      ))}
    </div>
  )
}

function PickerCard({
  active,
  title,
  subtitle,
  university,
  logoUrl,
  markClassName,
  count,
  onClick,
}: {
  active: boolean
  title: string
  subtitle: string
  university?: University
  logoUrl?: string | null
  markClassName?: string
  count?: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group relative flex w-full cursor-pointer items-center gap-4 rounded-3xl border bg-paper p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-18px_rgb(13_14_17_/_0.45)] ${
        active ? 'border-ink shadow-[0_12px_30px_-20px_rgb(13_14_17_/_0.5)]' : 'border-line'
      }`}
    >
      {university ? (
        <UniversityMark
          university={university}
          logoUrl={logoUrl}
          className={markClassName ?? 'size-16 rounded-2xl text-sm'}
        />
      ) : (
        <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-mist text-sm font-bold text-slate">
          ★
        </span>
      )}

      <span className="min-w-0 flex-1 pr-6">
        <span className="block truncate text-[15px] leading-snug font-bold">{title}</span>
        <span className="mt-1 flex items-center gap-1 text-xs text-slate">
          <PinIcon />
          <span className="truncate">{subtitle}</span>
        </span>
        {count !== undefined && (
          <span className="mt-1.5 block text-xs font-semibold text-[var(--accent)]">
            {count}
          </span>
        )}
      </span>

      <span
        className={`absolute top-4 right-4 transition-colors ${
          active ? 'text-ink' : 'text-line group-hover:text-slate'
        }`}
        aria-hidden="true"
      >
        <ArrowIcon />
      </span>
    </button>
  )
}

function PinIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  )
}
