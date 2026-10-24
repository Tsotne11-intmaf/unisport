import { useI18n } from '@/lib/i18n'

const INSTAGRAM_URL = 'https://www.instagram.com/bituelebis_football_federation/'

export const footballPhotos = [
  '/gallery/match-1.webp',
  '/gallery/match-2.webp',
  '/gallery/match-3.webp',
  '/gallery/match-4.webp',
  '/gallery/match-5.webp',
]

export const padelPhotos = [
  '/gallery/padel-1.webp',
  '/gallery/padel-2.webp',
  '/gallery/padel-3.webp',
  '/gallery/padel-4.webp',
  '/gallery/padel-5.webp',
]

/**
 * Matchday photos, with the lead shot taking a 2x2 block so the five images
 * fill a four-column grid exactly, then the link out to the federation's feed.
 */
export function MatchGallery({
  photos = footballPhotos,
  showSocial = true,
}: {
  photos?: string[]
  showSocial?: boolean
} = {}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {photos.map((src, index) => (
          <figure
            key={src}
            className={`overflow-hidden rounded-2xl bg-mist ${
              index === 0 ? 'col-span-2 row-span-2' : ''
            }`}
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              className="aspect-square size-full object-cover transition-transform duration-500 hover:scale-[1.03]"
            />
          </figure>
        ))}
      </div>

      {showSocial && <InstagramCard />}
    </>
  )
}

export const EVENTS_INSTAGRAM_URL = 'https://www.instagram.com/bitiuelebis_welcome2026/'

/** The link out to an account's feed, usable on its own. */
export function InstagramCard({
  url = INSTAGRAM_URL,
  title,
  body,
}: {
  url?: string
  title?: string
  body?: string
} = {}) {
  const { t } = useI18n()

  return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        className="mt-5 flex flex-wrap items-center gap-4 rounded-card border border-line bg-paper p-5 transition-colors hover:border-ink/35"
      >
        <span
          className="grid size-12 shrink-0 place-items-center rounded-2xl text-white"
          style={{
            backgroundImage:
              'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
          }}
        >
          <InstagramIcon />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block font-bold">{title ?? t('social.title')}</span>
          <span className="block text-sm text-slate">{body ?? t('social.body')}</span>
        </span>

        <span className="shrink-0 rounded-pill bg-ink px-4 py-2.5 text-sm font-semibold text-white">
          {t('social.cta')} ↗
        </span>
      </a>
  )
}

function InstagramIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}
