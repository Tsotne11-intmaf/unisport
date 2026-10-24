import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import { useI18n } from '@/lib/i18n'
import type { SquadPlayer, Tournament } from '@/types'

const inputClass =
  'w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-ink'

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

  const set = (patch: Partial<TeamFormValue>) => onChange({ ...value, ...patch })

  const setPlayer = (id: string, patch: Partial<SquadPlayer>) =>
    set({
      players: value.players.map((player) =>
        player.id === id ? { ...player, ...patch } : player,
      ),
    })

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
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

        <Field label={t('reg.email')}>
          <input
            required
            type="email"
            value={value.contactEmail}
            onChange={(event) => set({ contactEmail: event.target.value })}
            className={inputClass}
            autoComplete="email"
          />
        </Field>

        <Field label={t('reg.phone')}>
          <input
            required
            type="tel"
            value={value.contactPhone}
            onChange={(event) => set({ contactPhone: event.target.value })}
            className={inputClass}
            autoComplete="tel"
          />
        </Field>
      </div>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold">{t('reg.squad')}</h3>
            <p className="text-xs text-slate">
              {min === max ? min : `${min}–${max}`} {t('reg.squadRange')}
            </p>
          </div>
          <span className="rounded-pill bg-mist px-3 py-1.5 text-xs font-bold tabular-nums">
            {value.players.length} / {max}
          </span>
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
                      className={inputClass}
                    />
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
                        className={inputClass}
                      />
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

/** True once every required field on the sheet is filled. */
export function isTeamFormComplete(
  value: TeamFormValue,
  squadMin: number | null,
  needsPlayerPhones = false,
): boolean {
  if (!value.teamName.trim() || !value.contactEmail.trim() || !value.contactPhone.trim()) {
    return false
  }
  if (value.players.length < (squadMin ?? 1)) return false
  return value.players.every(
    (player) =>
      player.firstName.trim() &&
      player.lastName.trim() &&
      player.email.trim() &&
      (!needsPlayerPhones || player.phone.trim()),
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate">{hint}</span>}
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
