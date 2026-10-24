import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import { useI18n } from '@/lib/i18n'
import { emailError, isEmail, isGeorgianPhone, phoneError } from '@/lib/validate'
import type { SquadPlayer, Tournament } from '@/types'

// The colour utilities live on the variants, not the base: listing both
// border-line and border-football on one element is a coin toss over which
// rule the stylesheet emits last.
const inputBase = 'w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none'
const inputClass = `${inputBase} border-line bg-paper focus:border-ink`

/** The same input, turned red once what is in it cannot be right. */
const fieldClass = (invalid: boolean) =>
  invalid
    ? `${inputBase} border-football bg-football/5 ring-1 ring-football/35 focus:border-football`
    : inputClass

let nextPlayerId = 0
const blankPlayer = (): SquadPlayer => ({
  id: `player-${nextPlayerId++}`,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  photo: null,
})

export interface TeamFormValue {
  teamName: string
  logo: File | null
  contactEmail: string
  contactPhone: string
  notes: string
  players: SquadPlayer[]
}

/**
 * The squad sheet for a team tournament: crest, captain's contact and a row
 * per player with their photo. The parent owns submission; this only collects.
 */
export function TeamRegistrationForm({
  tournament,
  value,
  onChange,
}: {
  tournament: Tournament
  value: TeamFormValue
  onChange: (next: TeamFormValue) => void
}) {
  const { t } = useI18n()
  const min = tournament.squadMin ?? 1
  const max = tournament.squadMax ?? 9

  // One place on the sheet means one person: no team name, and the player's
  // own email and phone are the contact, so the captain block is dropped.
  const solo = max === 1

  const set = (patch: Partial<TeamFormValue>) => onChange({ ...value, ...patch })

  const setPlayer = (id: string, patch: Partial<SquadPlayer>) =>
    set({
      players: value.players.map((player) =>
        player.id === id ? { ...player, ...patch } : player,
      ),
    })

  return (
    <div className="space-y-8">
      <div className={`grid gap-4 sm:grid-cols-2 ${solo ? 'hidden' : ''}`}>
        <Field label={t('reg.teamName')}>
          <input
            required
            value={value.teamName}
            onChange={(event) => set({ teamName: event.target.value })}
            className={inputClass}
          />
        </Field>

        {tournament.collectTeamLogo && (
          <Field label={t('reg.teamLogo')} hint={t('reg.logoHint')}>
            <ImagePicker
              file={value.logo}
              onPick={(logo) => set({ logo })}
              shape="rounded-xl"
            />
          </Field>
        )}

        <Field
          label={t('reg.email')}
          error={emailError(value.contactEmail) ? t('valid.email') : undefined}
        >
          <input
            required
            type="email"
            value={value.contactEmail}
            onChange={(event) => set({ contactEmail: event.target.value })}
            className={fieldClass(emailError(value.contactEmail))}
            autoComplete="email"
          />
        </Field>

        <Field
          label={t('reg.phone')}
          error={phoneError(value.contactPhone) ? t('valid.phone') : undefined}
        >
          <input
            required
            type="tel"
            value={value.contactPhone}
            onChange={(event) => set({ contactPhone: event.target.value })}
            className={fieldClass(phoneError(value.contactPhone))}
            autoComplete="tel"
          />
        </Field>
      </div>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold">{solo ? t('reg.soloEntry') : t('reg.squad')}</h3>
            <p className="text-xs text-slate">
              {solo
                ? t('reg.soloHint')
                : `${min === max ? min : `${min}–${max}`} ${t('reg.squadRange')}`}
            </p>
          </div>
          {!solo && (
            <span className="rounded-pill bg-mist px-3 py-1.5 text-xs font-bold tabular-nums">
              {value.players.length} / {max}
            </span>
          )}
        </div>

        <ol className="space-y-3">
          {value.players.map((player, index) => (
            <li
              key={player.id}
              className="rounded-2xl border border-line bg-paper p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-slate">
                  {t('reg.player')} {index + 1}
                </span>
                {value.players.length > min && (
                  <button
                    type="button"
                    onClick={() =>
                      set({ players: value.players.filter((p) => p.id !== player.id) })
                    }
                    className="cursor-pointer text-xs font-semibold text-slate underline-offset-4 hover:text-football hover:underline"
                  >
                    {t('reg.removePlayer')}
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-start gap-4">
                <ImagePicker
                  file={player.photo}
                  onPick={(photo) => setPlayer(player.id, { photo })}
                  shape="rounded-full"
                  label={t('reg.playerPhoto')}
                />

                <div
                  className={`grid min-w-55 flex-1 gap-3 ${
                    tournament.collectPlayerPhones ? 'sm:grid-cols-2' : 'sm:grid-cols-3'
                  }`}
                >
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-slate">
                      {t('reg.firstName')}
                    </span>
                    <input
                      required
                      value={player.firstName}
                      onChange={(event) =>
                        setPlayer(player.id, { firstName: event.target.value })
                      }
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-slate">
                      {t('reg.lastName')}
                    </span>
                    <input
                      required
                      value={player.lastName}
                      onChange={(event) =>
                        setPlayer(player.id, { lastName: event.target.value })
                      }
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-slate">
                      {t('reg.email')}
                    </span>
                    <input
                      required
                      type="email"
                      value={player.email}
                      onChange={(event) =>
                        setPlayer(player.id, { email: event.target.value })
                      }
                      className={fieldClass(emailError(player.email))}
                    />
                    {emailError(player.email) && (
                      <span className="mt-1 block text-xs font-medium text-football">
                        {t('valid.email')}
                      </span>
                    )}
                  </label>
                  {tournament.collectPlayerPhones && (
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-slate">
                        {t('reg.phone')}
                      </span>
                      <input
                        required
                        type="tel"
                        value={player.phone}
                        onChange={(event) =>
                          setPlayer(player.id, { phone: event.target.value })
                        }
                        className={fieldClass(phoneError(player.phone))}
                      />
                      {phoneError(player.phone) && (
                        <span className="mt-1 block text-xs font-medium text-football">
                          {t('valid.phone')}
                        </span>
                      )}
                    </label>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>

        {value.players.length < max && (
          <button
            type="button"
            onClick={() => set({ players: [...value.players, blankPlayer()] })}
            className="mt-3 w-full cursor-pointer rounded-xl border-2 border-dashed border-line py-3 text-sm font-semibold text-slate transition-colors hover:border-ink/35 hover:text-ink"
          >
            + {t('reg.addPlayer')}
          </button>
        )}
      </div>

      <Field label={t('reg.notes')}>
        <textarea
          rows={3}
          value={value.notes}
          onChange={(event) => set({ notes: event.target.value })}
          className={inputClass}
        />
      </Field>
    </div>
  )
}

export function emptyTeamForm(squadMin: number | null): TeamFormValue {
  return {
    teamName: '',
    logo: null,
    contactEmail: '',
    contactPhone: '',
    notes: '',
    players: Array.from({ length: squadMin ?? 1 }, blankPlayer),
  }
}

/** True once every required field is filled and the contacts actually parse. */
export function isTeamFormComplete(
  value: TeamFormValue,
  squadMin: number | null,
  needsPlayerPhones = false,
  solo = false,
): boolean {
  // A solo entry has no team name and no separate captain; the one player
  // carries the contact details, which are checked with everyone else's.
  if (!solo) {
    if (!value.teamName.trim()) return false
    if (!isEmail(value.contactEmail) || !isGeorgianPhone(value.contactPhone)) return false
  }
  if (value.players.length < (squadMin ?? 1)) return false
  return value.players.every(
    (player) =>
      player.firstName.trim() &&
      player.lastName.trim() &&
      isEmail(player.email) &&
      (!needsPlayerPhones && !solo ? true : isGeorgianPhone(player.phone)),
  )
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs font-medium text-football">{error}</span>
      ) : (
        hint && <span className="mt-1 block text-xs text-slate">{hint}</span>
      )}
    </label>
  )
}

/** A file input that shows the picked image rather than a bare filename. */
function ImagePicker({
  file,
  onPick,
  shape,
  label,
}: {
  file: File | null
  onPick: (file: File | null) => void
  shape: string
  label?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const { t } = useI18n()

  // Object URLs have to be released or the page leaks one per pick.
  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const caption = useMemo(
    () => (file ? t('reg.changeFile') : t('reg.chooseFile')),
    [file, t],
  )

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`grid size-16 shrink-0 cursor-pointer place-items-center overflow-hidden border-2 border-dashed border-line bg-mist transition-colors hover:border-ink/35 ${shape}`}
      >
        {preview ? (
          <img src={preview} alt="" className="size-full object-cover" />
        ) : (
          <span className="text-xl text-slate">+</span>
        )}
      </button>

      <div className="min-w-0">
        {label && <span className="block text-xs font-medium text-slate">{label}</span>}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer text-xs font-semibold underline-offset-4 hover:underline"
        >
          {caption}
        </button>
        {file && (
          <span className="block max-w-40 truncate text-[11px] text-slate">{file.name}</span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(event) => onPick(event.target.files?.[0] ?? null)}
      />
    </div>
  )
}
