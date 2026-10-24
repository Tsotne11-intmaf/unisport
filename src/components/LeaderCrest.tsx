import type { VoteCandidate } from '@/data/football'
import { useI18n } from '@/lib/i18n'

/**
 * The crest the week's leader appears in. Until somebody is ahead it stays an
 * empty white shield, so the section reads as waiting rather than broken.
 */
export function LeaderCrest({
  leader,
  votes,
}: {
  leader: VoteCandidate | null
  votes: number
}) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col items-center rounded-card border border-line bg-[var(--accent-soft)] px-5 py-7">
      <p className="text-[11px] font-bold tracking-widest text-slate uppercase">
        {leader ? t('vote.leader') : t('vote.noLeader')}
      </p>

      <div className="relative mt-4 w-full max-w-50">
        <svg viewBox="0 0 200 240" className="w-full" aria-hidden={!leader}>
          <defs>
            <clipPath id="leader-crest">
              <path d="M24 10 Q24 4 30 4 L170 4 Q176 4 176 10 L176 140 Q176 198 100 234 Q24 198 24 140 Z" />
            </clipPath>
          </defs>

          <path
            d="M24 10 Q24 4 30 4 L170 4 Q176 4 176 10 L176 140 Q176 198 100 234 Q24 198 24 140 Z"
            fill="#ffffff"
          />

          {leader?.photoUrl && (
            <image
              href={leader.photoUrl}
              x="24"
              y="4"
              width="152"
              height="230"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#leader-crest)"
            />
          )}

          <path
            d="M24 10 Q24 4 30 4 L170 4 Q176 4 176 10 L176 140 Q176 198 100 234 Q24 198 24 140 Z"
            fill="none"
            stroke="var(--color-line)"
            strokeWidth="2"
          />
        </svg>

        {/* The angled name plate from the match graphics. */}
        <span
          className={`absolute bottom-10 left-1 -rotate-6 rounded-lg px-3 py-1.5 text-xs font-bold shadow-sm ${
            leader?.name ? 'bg-ink text-white' : 'bg-white text-slate/60 italic'
          }`}
        >
          {leader?.name ?? t('vote.placeholderName')}
        </span>
      </div>

      {leader && (
        <p className="mt-4 text-sm font-bold tabular-nums">
          {votes} {t('vote.total')}
        </p>
      )}
    </div>
  )
}
