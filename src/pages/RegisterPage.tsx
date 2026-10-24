import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Card, Media, Pill, Themed, UniversityMark } from '@/components/ui'
import { useHub } from '@/data/HubProvider'
import { ALL, placesLeft } from '@/data/selectors'
import { submitRegistration } from '@/data/repository'
import { formatDate, formatRange } from '@/lib/format'
import { useI18n, type TranslationKey } from '@/lib/i18n'
import type { SkillLevel, Tournament } from '@/types'

const levelKey: Record<SkillLevel, TranslationKey> = {
  beginner: 'level.beginner',
  intermediate: 'level.intermediate',
  advanced: 'level.advanced',
  open: 'level.open',
}

const levels: SkillLevel[] = ['beginner', 'intermediate', 'advanced']

type Status = 'idle' | 'sending' | 'done' | 'error'

export function RegisterPage() {
  const [params] = useSearchParams()
  const { lang, t, l } = useI18n()
  const hub = useHub()

  const preselected = hub.tournaments.find((item) => item.id === params.get('tournament'))

  const [universityId, setUniversityId] = useState<string>(
    () => preselected?.hostUniversityId ?? (hub.myUniversityId === ALL ? '' : hub.myUniversityId),
  )
  const [tournamentId, setTournamentId] = useState<string>(preselected?.id ?? '')
  const [level, setLevel] = useState<SkillLevel>('beginner')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [storedIn, setStoredIn] = useState<'supabase' | 'local'>('local')

  /* A student can enter their own university's tournaments plus anything open
     to all campuses — which is exactly what picking a university should reveal. */
  const available = useMemo(
    () =>
      hub.tournaments
        .filter(
          (tournament) =>
            tournament.status === 'registration_open' &&
            (tournament.hostUniversityId === null ||
              tournament.hostUniversityId === universityId),
        )
        .sort((a, b) => a.startDate.localeCompare(b.startDate)),
    [hub.tournaments, universityId],
  )

  const selected = available.find((tournament) => tournament.id === tournamentId)

  const onPickUniversity = (id: string) => {
    setUniversityId(id)
    hub.setMyUniversityId(id)
    // The previous pick may not be open to this campus any more.
    setTournamentId('')
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!selected) return

    setStatus('sending')
    const result = await submitRegistration({
      sportId: selected.sportId,
      tournamentId: selected.id,
      universityId,
      fullName,
      email,
      phone,
      level,
      partnerName,
      notes,
    })

    if (result.ok) {
      setStoredIn(result.stored)
      setStatus('done')
    } else {
      setStatus('error')
    }
  }

  const resetForm = () => {
    setStatus('idle')
    setTournamentId('')
    setFullName('')
    setEmail('')
    setPhone('')
    setPartnerName('')
    setNotes('')
  }

  const theme = selected?.sportId === 'football' ? 'football' : 'padel'

  if (status === 'done') {
    return (
      <Themed theme={theme}>
        <div className="shell max-w-xl py-24 text-center">
          <span className="grid mx-auto size-16 place-items-center rounded-full bg-[var(--accent)] text-3xl text-[var(--accent-ink)]">
            ✓
          </span>
          <h1 className="mt-6 text-3xl font-semibold">{t('reg.successTitle')}</h1>
          <p className="mt-3 text-slate">{t('reg.successBody')}</p>
          {storedIn === 'local' && (
            <p className="mt-3 text-sm text-slate">{t('reg.successLocal')}</p>
          )}
          <button
            type="button"
            onClick={resetForm}
            className="mt-8 cursor-pointer rounded-pill bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            {t('reg.another')}
          </button>
        </div>
      </Themed>
    )
  }

  return (
    <Themed theme={theme}>
      <section className="border-b border-line bg-mist">
        <div className="shell py-12 sm:py-16">
          <Pill variant="accent">{t('nav.register')}</Pill>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold sm:text-5xl">
            {t('reg.title')}
          </h1>
          <p className="mt-4 max-w-xl text-slate">{t('reg.lede')}</p>
        </div>
      </section>

      <form onSubmit={onSubmit} className="shell grid gap-10 py-12 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-10">
          <Step index={1} title={t('reg.step1')}>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {hub.universities.map((university) => {
                const active = universityId === university.id
                return (
                  <button
                    key={university.id}
                    type="button"
                    onClick={() => onPickUniversity(university.id)}
                    aria-pressed={active}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                      active
                        ? 'border-ink bg-ink text-white'
                        : 'border-line bg-paper hover:border-ink/35'
                    }`}
                  >
                    <UniversityMark university={university} className="size-9 text-[11px]" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">
                        {university.shortName}
                      </span>
                      <span
                        className={`block truncate text-xs ${active ? 'text-white/70' : 'text-slate'}`}
                      >
                        {l(university.name)}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
            {universityId && (
              <p className="mt-3 text-xs text-slate">{t('filter.saved')}</p>
            )}
          </Step>

          <Step index={2} title={t('reg.step2')}>
            {!universityId ? (
              <p className="rounded-xl border border-dashed border-line bg-mist px-5 py-8 text-center text-sm text-slate">
                {t('reg.chooseUniversity')}
              </p>
            ) : available.length === 0 ? (
              <p className="rounded-xl border border-dashed border-line bg-mist px-5 py-8 text-center text-sm text-slate">
                {t('reg.noTournaments')}
              </p>
            ) : (
              <div className="grid gap-2.5">
                {available.map((tournament) => (
                  <TournamentOption
                    key={tournament.id}
                    tournament={tournament}
                    active={tournamentId === tournament.id}
                    onSelect={() => setTournamentId(tournament.id)}
                  />
                ))}
              </div>
            )}
          </Step>

          <Step index={3} title={t('reg.step3')}>
            <fieldset
              disabled={!selected}
              className="grid gap-4 sm:grid-cols-2 disabled:opacity-45"
            >
              <Field label={t('reg.fullName')}>
                <input
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className={inputClass}
                  autoComplete="name"
                />
              </Field>
              <Field label={t('reg.email')}>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClass}
                  autoComplete="email"
                />
              </Field>
              <Field label={t('reg.phone')}>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className={inputClass}
                  autoComplete="tel"
                />
              </Field>
              <Field label={t('reg.level')}>
                <select
                  value={level}
                  onChange={(event) => setLevel(event.target.value as SkillLevel)}
                  className={inputClass}
                >
                  {levels.map((option) => (
                    <option key={option} value={option}>
                      {t(levelKey[option])}
                    </option>
                  ))}
                </select>
              </Field>
              {selected?.sportId === 'padel' && (
                <Field label={t('reg.partner')} hint={t('reg.partnerHint')}>
                  <input
                    value={partnerName}
                    onChange={(event) => setPartnerName(event.target.value)}
                    className={inputClass}
                  />
                </Field>
              )}
              <Field label={t('reg.notes')} full>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className={inputClass}
                />
              </Field>
            </fieldset>
          </Step>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="overflow-hidden">
            {selected ? (
              <>
                <Media
                  src={selected.imageUrl}
                  alt={l(selected.title)}
                  kind={selected.sportId}
                  tint={hub.universityById(selected.hostUniversityId)?.color}
                  label={hub.universityById(selected.hostUniversityId)?.shortName}
                  ratio="aspect-[16/9]"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold">{l(selected.title)}</h3>
                  <p className="mt-1 text-sm text-slate">
                    {formatRange(selected.startDate, selected.endDate, lang)}
                  </p>
                  <dl className="mt-4 grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 border-t border-line pt-4 text-sm">
                    <SummaryRow label={t('label.venue')} value={l(selected.venue)} />
                    <SummaryRow
                      label={t('label.fee')}
                      value={selected.fee === null ? t('label.free') : `${selected.fee} ₾`}
                    />
                    {selected.registrationDeadline && (
                      <SummaryRow
                        label={t('label.deadline')}
                        value={formatDate(selected.registrationDeadline, lang)}
                      />
                    )}
                  </dl>
                </div>
              </>
            ) : (
              <div className="p-6 text-sm text-slate">{t('reg.chooseUniversity')}</div>
            )}

            <div className="border-t border-line p-5">
              {status === 'error' && (
                <p className="mb-3 text-sm font-medium text-football">{t('reg.failed')}</p>
              )}
              <button
                type="submit"
                disabled={!selected || status === 'sending'}
                className="w-full cursor-pointer rounded-pill bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-ink)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {status === 'sending' ? t('reg.sending') : t('reg.submit')}
              </button>
            </div>
          </Card>
        </aside>
      </form>
    </Themed>
  )
}

const inputClass =
  'w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-ink'

function Step({
  index,
  title,
  children,
}: {
  index: number
  title: string
  children: ReactNode
}) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2.5">
        <span className="grid size-7 place-items-center rounded-full bg-ink text-xs font-bold text-white">
          {index}
        </span>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function Field({
  label,
  hint,
  full,
  children,
}: {
  label: string
  hint?: string
  full?: boolean
  children: ReactNode
}) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate">{hint}</span>}
    </label>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-slate">{label}</dt>
      <dd className="min-w-0 font-medium">{value}</dd>
    </>
  )
}

function TournamentOption({
  tournament,
  active,
  onSelect,
}: {
  tournament: Tournament
  active: boolean
  onSelect: () => void
}) {
  const { lang, t, l } = useI18n()
  const { universityById } = useHub()
  const host = universityById(tournament.hostUniversityId)
  const left = placesLeft(tournament)

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
        active ? 'border-ink bg-mist' : 'border-line bg-paper hover:border-ink/35'
      }`}
    >
      <span
        className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${
          active ? 'border-ink' : 'border-line'
        }`}
      >
        {active && <span className="size-2.5 rounded-full bg-ink" />}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{l(tournament.title)}</span>
        <span className="mt-0.5 block text-xs text-slate">
          {formatRange(tournament.startDate, tournament.endDate, lang)} · {l(tournament.venue)}
        </span>
      </span>

      <span className="hidden shrink-0 text-right text-xs sm:block">
        <span className="block font-semibold">
          {host ? host.shortName : t('label.openToAll')}
        </span>
        {left !== null && (
          <span className="text-slate">
            {left > 0 ? `${left} ${t('label.placesLeft')}` : t('label.full')}
          </span>
        )}
      </span>
    </button>
  )
}
