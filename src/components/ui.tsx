import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

import { useI18n } from '@/lib/i18n'
import type { SportId, University } from '@/types'

/** Wraps a page or block so everything inside inherits one section accent. */
export function Themed({
  theme,
  className = '',
  children,
}: {
  theme: 'padel' | 'football' | 'news' | 'events' | 'neutral'
  className?: string
  children: ReactNode
}) {
  const themeClass = theme === 'neutral' ? '' : `theme-${theme}`
  return <div className={`themed ${themeClass} ${className}`}>{children}</div>
}

export function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-card border border-line bg-paper ${className}`}>{children}</div>
  )
}

export function Pill({
  children,
  variant = 'outline',
}: {
  children: ReactNode
  variant?: 'outline' | 'accent' | 'solid' | 'soft'
}) {
  const styles = {
    outline: 'border-line bg-paper text-graphite',
    accent: 'border-transparent bg-[var(--accent)] text-[var(--accent-ink)]',
    soft: 'border-transparent bg-[var(--accent-soft)] text-ink',
    solid: 'border-transparent bg-ink text-white',
  }[variant]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${styles}`}
    >
      {children}
    </span>
  )
}

/** The numbered section marker the reference layouts use: ( 2 ) Services */
export function SectionHeading({
  index,
  eyebrow,
  title,
  action,
}: {
  index?: number
  eyebrow?: string
  title: string
  action?: { to: string; label: string }
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {(index !== undefined || eyebrow) && (
          <div className="mb-3 flex items-center gap-2">
            {index !== undefined && (
              <span className="grid size-6 place-items-center rounded-full bg-ink text-[11px] font-bold text-white">
                {index}
              </span>
            )}
            {eyebrow && <Pill>{eyebrow}</Pill>}
          </div>
        )}
        <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
      </div>
      {action && (
        <Link
          to={action.to}
          className="shrink-0 text-sm font-semibold text-graphite underline-offset-4 hover:underline"
        >
          {action.label} →
        </Link>
      )}
    </div>
  )
}

export function EmptyState() {
  const { t } = useI18n()
  return (
    <div className="rounded-card border border-dashed border-line bg-mist px-6 py-16 text-center">
      <p className="text-lg font-semibold">{t('empty.title')}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-slate">{t('empty.body')}</p>
    </div>
  )
}

/** University identity chip — the colour stands in for a crest. */
export function UniversityChip({
  university,
  size = 'md',
}: {
  university: University | undefined
  size?: 'sm' | 'md'
}) {
  if (!university) return null
  const dimensions = size === 'sm' ? 'size-7 text-[10px]' : 'size-10 text-xs'
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-lg font-bold ${dimensions}`}
      style={{ backgroundColor: `${university.color}1f`, color: university.color }}
      title={university.shortName}
    >
      {university.shortName.slice(0, 4)}
    </span>
  )
}

const glyphs: Record<SportId | 'event' | 'news', string> = {
  padel: '🎾',
  football: '⚽',
  event: '✦',
  news: '📰',
}

/**
 * Artwork slot. Renders the real photo when a record has one and a themed
 * stand-in until then, so the layout never collapses on missing images.
 */
export function Media({
  src,
  alt,
  kind,
  tint,
  label,
  className = '',
  ratio = 'aspect-[16/10]',
}: {
  src: string | null
  alt: string
  kind: SportId | 'event' | 'news'
  tint?: string
  /** Short caption burned into the stand-in artwork, usually a university's short name. */
  label?: string
  className?: string
  ratio?: string
}) {
  if (src) {
    return (
      <div className={`${ratio} overflow-hidden ${className}`}>
        <img src={src} alt={alt} loading="lazy" className="size-full object-cover" />
      </div>
    )
  }

  const base = tint ?? 'var(--accent)'
  return (
    <div
      className={`court-weave ${ratio} overflow-hidden ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${base} 0%, color-mix(in srgb, ${base} 50%, #10243c) 100%)`,
      }}
      role="img"
      aria-label={alt}
    >
      {/* An SVG so the mark scales with the box instead of staying a fixed glyph. */}
      <svg
        viewBox="0 0 160 90"
        preserveAspectRatio="xMidYMid slice"
        className="size-full"
        aria-hidden="true"
      >
        <circle cx="128" cy="18" r="46" fill="rgb(255 255 255 / 0.08)" />
        <circle cx="26" cy="78" r="30" fill="rgb(255 255 255 / 0.06)" />
        <text
          x="80"
          y="45"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="30"
          opacity="0.92"
        >
          {glyphs[kind]}
        </text>
        {label && (
          <text
            x="80"
            y="68"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="9"
            fontWeight="700"
            letterSpacing="1.5"
            fill="rgb(255 255 255 / 0.75)"
          >
            {label.toUpperCase()}
          </text>
        )}
      </svg>
    </div>
  )
}
