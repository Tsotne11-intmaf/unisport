import { useRef, useState, type ReactNode } from 'react'

import { uploadMedia } from '@/data/admin'

/**
 * The admin's own small kit. It stays out of the site's i18n on purpose — this
 * panel has one reader, so the Georgian is written inline where it is used
 * rather than routed through a dictionary the public pages share.
 */

export const adminInput =
  'w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink'

export function Panel({
  title,
  hint,
  action,
  children,
}: {
  title: string
  hint?: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="rounded-card border border-line bg-paper p-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          {hint && <p className="mt-1 text-xs text-slate">{hint}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

export function Labelled({
  label,
  children,
  wide,
}: {
  label: string
  children: ReactNode
  wide?: boolean
}) {
  return (
    <label className={`block ${wide ? 'sm:col-span-2' : ''}`}>
      <span className="mb-1 block text-xs font-semibold text-slate">{label}</span>
      {children}
    </label>
  )
}

export function Button({
  children,
  onClick,
  tone = 'ink',
  disabled,
  type = 'button',
}: {
  children: ReactNode
  onClick?: () => void
  tone?: 'ink' | 'quiet' | 'danger'
  disabled?: boolean
  type?: 'button' | 'submit'
}) {
  const tones = {
    ink: 'bg-ink text-white hover:opacity-90',
    quiet: 'border border-line text-graphite hover:border-ink',
    danger: 'border border-football/40 text-football hover:bg-football/5',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer rounded-pill px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-default disabled:opacity-40 ${tones[tone]}`}
    >
      {children}
    </button>
  )
}

/** A picture field: shows what is set, uploads a replacement, clears it. */
export function ImageField({
  label,
  folder,
  value,
  onChange,
  round,
}: {
  label: string
  folder: string
  value: string | null
  onChange: (next: string | null) => void
  round?: boolean
}) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pick = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    setError(null)
    const result = await uploadMedia(folder, file)
    setBusy(false)
    if (result.error) setError(result.error)
    else onChange(result.data ?? null)
  }

  return (
    <div>
      <span className="mb-1 block text-xs font-semibold text-slate">{label}</span>
      <div className="flex items-center gap-3">
        <span
          className={`grid size-12 shrink-0 place-items-center overflow-hidden border border-line bg-mist ${
            round ? 'rounded-full' : 'rounded-lg'
          }`}
        >
          {value ? (
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <span className="text-[10px] text-slate">—</span>
          )}
        </span>

        <div className="flex flex-wrap gap-2">
          <Button tone="quiet" onClick={() => input.current?.click()} disabled={busy}>
            {busy ? 'იტვირთება…' : value ? 'შეცვლა' : 'ატვირთვა'}
          </Button>
          {value && (
            <Button tone="quiet" onClick={() => onChange(null)}>
              მოშორება
            </Button>
          )}
        </div>

        <input
          ref={input}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => pick(event.target.files?.[0])}
        />
      </div>
      {error && <p className="mt-1 text-xs font-medium text-football">{error}</p>}
    </div>
  )
}

/** One line of feedback under a section: what saved, or what went wrong. */
export function Status({ value }: { value: { kind: 'ok' | 'error'; text: string } | null }) {
  if (!value) return null
  return (
    <p
      className={`mt-3 text-sm font-medium ${
        value.kind === 'ok' ? 'text-graphite' : 'text-football'
      }`}
    >
      {value.text}
    </p>
  )
}
