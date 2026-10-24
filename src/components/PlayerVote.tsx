import { useState } from 'react'

import type { VoteCandidate } from '@/data/football'
import { submitVote } from '@/data/repository'
import { useI18n } from '@/lib/i18n'

const STORAGE_KEY = 'unisport-player-vote'

function readStoredVote(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

/**
 * One vote per browser. Rows with no name yet render as empty slots — a crest
 * frame and a sample name — so the section shows its shape before the round's
 * nominees are announced.
 */
export function PlayerVote({ candidates }: { candidates: VoteCandidate[] }) {
  const { t } = useI18n()
  const [votedFor, setVotedFor] = useState<string | null>(readStoredVote)
  const [storedRemotely, setStoredRemotely] = useState(true)

  const announced = candidates.some((candidate) => candidate.name)

  const tally = (candidate: VoteCandidate) =>
    candidate.votes + (votedFor === candidate.id ? 1 : 0)

  const total = candidates.reduce((sum, candidate) => sum + tally(candidate), 0)
  const ranked = announced
    ? [...candidates].sort((a, b) => tally(b) - tally(a))
    : candidates

  const vote = async (candidateId: string) => {
    if (votedFor) return
    setVotedFor(candidateId)
    try {
      localStorage.setItem(STORAGE_KEY, candidateId)
    } catch {
      // Storage blocked — the vote still goes out, it just isn't remembered here.
    }
    const result = await submitVote(candidateId)
    setStoredRemotely(result.ok && result.stored === 'supabase')
  }

  return (
    <div className="overflow-hidden rounded-card border border-line bg-paper">
      <ul>
        {ranked.map((candidate, index) => {
          const count = tally(candidate)
          const share = total > 0 ? Math.round((count / total) * 100) : 0
          const isChoice = votedFor === candidate.id
          const empty = !candidate.name

          return (
            <li key={candidate.id} className="border-b border-line last:border-b-0">
              <div className="flex items-center gap-4 px-5 py-4">
                <span className="w-4 shrink-0 text-sm font-semibold text-slate tabular-nums">
                  {index + 1}
                </span>

                <CrestFrame src={candidate.logoUrl} alt={candidate.name ?? ''} />

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p
                      className={`truncate font-semibold ${
                        empty ? 'text-slate/60 italic' : ''
                      }`}
                    >
                      {candidate.name ?? t('vote.placeholderName')}
                      {isChoice && <span className="ml-2 text-xs text-[var(--accent)]">✓</span>}
                    </p>
                    {!empty && (
                      <p className="shrink-0 text-xs font-semibold text-slate tabular-nums">
                        {count} {t('vote.total')}
                      </p>
                    )}
                  </div>

                  {/* The bar only means anything once a vote has been cast. */}
                  {!empty && votedFor && (
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-mist">
                      <div
                        className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
                        style={{ width: `${share}%` }}
                      />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => vote(candidate.id)}
                  disabled={empty || Boolean(votedFor)}
                  className={`shrink-0 cursor-pointer rounded-pill px-4 py-2 text-xs font-bold transition-colors disabled:cursor-default ${
                    isChoice
                      ? 'bg-[var(--accent)] text-[var(--accent-ink)]'
                      : 'border border-line text-graphite enabled:hover:border-ink disabled:opacity-40'
                  }`}
                >
                  {isChoice ? t('vote.voted') : t('vote.cta')}
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      {!announced && (
        <p className="border-t border-line bg-mist px-5 py-3 text-xs text-slate">
          {t('vote.pending')}
        </p>
      )}

      {announced && votedFor && (
        <p className="border-t border-line bg-mist px-5 py-3 text-xs text-slate">
          {t('vote.thanks')}
          {!storedRemotely && ` ${t('vote.localOnly')}`}
        </p>
      )}
    </div>
  )
}

/** The square the club crest will sit in; dashed while the slot is unfilled. */
function CrestFrame({ src, alt }: { src: string | null; alt: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        width={40}
        height={40}
        loading="lazy"
        className="size-10 shrink-0 rounded-lg bg-mist object-contain"
      />
    )
  }
  return (
    <span
      className="size-10 shrink-0 rounded-lg border-2 border-dashed border-line bg-mist"
      aria-hidden="true"
    />
  )
}
