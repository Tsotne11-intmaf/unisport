import { ALL } from '@/data/selectors'
import { useI18n } from '@/lib/i18n'
import type { University } from '@/types'

/**
 * The control the whole hub pivots on: pick a university and tournaments,
 * events and news all narrow to that campus.
 */
export function UniversityFilter({
  universities,
  value,
  onChange,
  label,
}: {
  universities: University[]
  value: string
  onChange: (next: string) => void
  label?: string
}) {
  const { t, l } = useI18n()

  return (
    <div>
      <p className="mb-2.5 text-xs font-semibold tracking-wide text-slate">
        {label ?? t('filter.university')}
      </p>
      <div
        className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
        role="group"
        aria-label={label ?? t('filter.university')}
      >
        {universities.length > 1 && (
          <Chip active={value === ALL} label={t('filter.all')} onClick={() => onChange(ALL)} />
        )}
        {universities.map((university) => (
          <Chip
            key={university.id}
            active={value === university.id}
            label={university.shortName}
            title={l(university.name)}
            color={university.color}
            onClick={() => onChange(university.id)}
          />
        ))}
      </div>
    </div>
  )
}

function Chip({
  active,
  label,
  title,
  color,
  onClick,
}: {
  active: boolean
  label: string
  title?: string
  color?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={`shrink-0 cursor-pointer rounded-pill border px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
        active
          ? 'border-transparent bg-ink text-white'
          : 'border-line bg-paper text-graphite hover:border-ink/35'
      }`}
    >
      {color && (
        <span
          className="mr-2 inline-block size-2 rounded-full align-middle"
          style={{ backgroundColor: active ? 'currentColor' : color }}
        />
      )}
      {label}
    </button>
  )
}
