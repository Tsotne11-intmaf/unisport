import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

import {
  emptyTeamForm,
  isTeamFormComplete,
  TeamRegistrationForm,
  type TeamFormValue,
} from '@/components/TeamRegistrationForm'
import { LeagueRules } from '@/components/LeagueRules'
import { Card, Media, SectionHeading, Themed, UniversityMark } from '@/components/ui'
import { useHub } from '@/data/HubProvider'
import { submitRegistration, submitTeamRegistration } from '@/data/repository'
import { placesLeft } from '@/data/selectors'
import { formatDate, formatRange } from '@/lib/format'
import { useI18n, type TranslationKey } from '@/lib/i18n'
import type { SkillLevel } from '@/types'

const levelKey: Record<SkillLevel, TranslationKey> = {
  beginner: 'level.beginner',
  intermediate: 'level.intermediate',
  advanced: 'level.advanced',
  open: 'level.open',
}

const levels: SkillLevel[] = ['beginner', 'intermediate', 'advanced']

const inputClass =
  'w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-ink'

type Status = 'idle' | 'sending' | 'done' | 'error'

/**
 * One tournament, one registration page. Conditions differ from tournament to
 * tournament, so nothing here is shared with the others — there is no chooser
 * and no chance of reading the wrong rules.
 */
export function RegisterTournamentPage() {
  const { tournamentId } = useParams()
  const { lang, t, l } = useI18n()
  const hub = useHub()

  const tournament = hub.tournaments.find((item) => item.id === tournamentId)

  const [universityId, setUniversityId] = useState('')
  const [level, setLevel] = useState<SkillLevel>('beginner')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [storedIn, setStoredIn] = useState<'supabase' | 'local'>('local')
  const [team, setTeam] = useState<TeamFormValue>(() => emptyTeamForm(null))

  /* A tournament hosted by one university is only open to that university, so
     the campus question only appears for the ones open to everybody. */
  const host = tournament?.hostUniversityId ?? null
  const asksUniversity = host === null
  const effectiveUniversity = host ?? universityId

  useEffect(() => {
    if (tournament?.teamBased) setTeam(emptyTeamForm(tournament.squadMin))
  }, [tournament?.id, tournament?.teamBased, tournament?.squadMin])

  if (!tournament) {
    if (hub.loading) return <div className="shell py-20" />
    return <Navigate to="/register" replace />
  }

  const isTeam = tournament.teamBased
  const theme = tournament.sportId === 'football' ? 'football' : 'padel'
  const hostUniversity = hub.universityById(host)
  const left = placesLeft(tournament)

  const ready = isTeam
    ? Boolean(effectiveUniversity) && isTeamFormComplete(team, tournament.squadMin)
    : Boolean(effectiveUniversity)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!ready) return

    setStatus('sending')
    const result = isTeam
      ? await submitTeamRegistration({
          tournamentId: tournament.id,
          universityId: effectiveUniversity,
          teamName: team.teamName,
          logo: team.logo,
          contactEmail: team.contactEmail,
          contactPhone: team.contactPhone,
          notes: team.notes,
          players: team.players,
        })
      : await submitRegistration({
          sportId: tournament.sportId,
          tournamentId: tournament.id,
          universityId: effectiveUniversity,
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

  if (status === 'done') {
    return (
      <Themed theme={theme}>
        <div className="shell max-w-xl py-24 text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--accent)] text-3xl text-[var(--accent-ink)]">
            ✓
          </span>
          <h1 className="mt-6 text-3xl font-semibold">{t('reg.successTitle')}</h1>
          <p className="mt-3 text-slate">{t('reg.successBody')}</p>
          {storedIn === 'local' && (
            <p className="mt-3 text-sm text-slate">{t('reg.successLocal')}</p>
          )}
          <Link
            to={`/${tournament.sportId}`}
            className="mt-8 inline-block rounded-pill bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            {t('action.back')}
          </Link>
        </div>
      </Themed>
    )
  }

  let step = 0

  return (
    <Themed theme={theme}>
      <section className="shell pt-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink">
          <Media
            src={tournament.imageUrl}
            alt={l(tournament.title)}
            kind={tournament.sportId}
            tint={hostUniversity?.color}
            label={hostUniversity?.shortName}
            focus="50% 30%"
            ratio="absolute inset-0 size-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/60 to-ink/10" />
          <div className="relative px-6 py-12 sm:px-10 sm:py-16">
            <Link
              to={`/${tournament.sportId}`}
              className="text-sm font-semibold text-white/75 underline-offset-4 hover:underline"
            >
              ← {l(hub.sportById(tournament.sportId)?.name)}
            </Link>
            {hostUniversity && (
              <span className="mt-5 flex w-fit items-center gap-2.5 rounded-pill bg-white/15 py-1.5 pr-4 pl-1.5 ring-1 ring-white/25 backdrop-blur-sm">
                <UniversityMark university={hostUniversity} className="size-7 rounded-full" />
                <span className="text-xs font-bold text-white">{hostUniversity.shortName}</span>
              </span>
            )}
            <h1
              className="mt-4 max-w-3xl text-4xl font-bold text-white sm:text-5xl"
              style={{ textShadow: '0 2px 24px rgb(0 0 0 / 0.45)' }}
            >
              {l(tournament.title)}
            </h1>
            <p className="mt-3 max-w-xl text-white/85">{l(tournament.summary)}</p>
          </div>
        </div>
      </section>

      <form onSubmit={onSubmit} className="shell grid gap-10 py-12 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-10">
          {asksUniversity && (
            <Step index={(step += 1)} title={t('reg.step1')}>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {hub.universities.map((university) => {
                  const active = universityId === university.id
                  return (
                    <button
                      key={university.id}
                      type="button"
                      onClick={() => {
                        setUniversityId(university.id)
                        hub.setMyUniversityId(university.id)
                      }}
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
            </Step>
          )}

          <Step index={(step += 1)} title={t('reg.step3')}>
            {isTeam ? (
              <TeamRegistrationForm tournament={tournament} value={team} onChange={setTeam} />
            ) : (
              <fieldset className="grid gap-4 sm:grid-cols-2">
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
                {tournament.sportId === 'padel' && (
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
            )}
          </Step>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="overflow-hidden">
            <div className="border-b border-line p-5">
              <p className="text-xs font-bold tracking-wide text-slate uppercase">
                {t('reg.conditions')}
              </p>
              <dl className="mt-4 grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 text-sm">
                <SummaryRow label={t('label.dates')} value={formatRange(tournament.startDate, tournament.endDate, lang)} />
                <SummaryRow label={t('label.venue')} value={l(tournament.venue)} />
                <SummaryRow label={t('label.format')} value={l(tournament.format)} />
                <SummaryRow
                  label={t('label.fee')}
                  value={tournament.fee === null ? t('label.free') : `${tournament.fee} ₾`}
                />
                {tournament.squadMax && (
                  <SummaryRow
                    label={t('reg.squad')}
                    value={`${tournament.squadMin ?? 1}–${tournament.squadMax}`}
                  />
                )}
                {tournament.registrationOpensAt && tournament.registrationDeadline ? (
                  <SummaryRow
                    label={t('reg.window')}
                    value={formatRange(
                      tournament.registrationOpensAt,
                      tournament.registrationDeadline,
                      lang,
                    )}
                  />
                ) : (
                  tournament.registrationDeadline && (
                    <SummaryRow
                      label={t('label.deadline')}
                      value={formatDate(tournament.registrationDeadline, lang)}
                    />
                  )
                )}
                {left !== null && (
                  <SummaryRow
                    label={t('label.placesLeft')}
                    value={left > 0 ? String(left) : t('label.full')}
                  />
                )}
              </dl>

            </div>

            <div className="p-5">
              {status === 'error' && (
                <p className="mb-3 text-sm font-medium text-football">{t('reg.failed')}</p>
              )}
              {!ready && (
                <p className="mb-3 text-xs text-slate">
                  {asksUniversity && !universityId
                    ? t('reg.chooseUniversity')
                    : t('reg.needMorePlayers')}
                </p>
              )}
              <button
                type="submit"
                disabled={!ready || status === 'sending'}
                className="w-full cursor-pointer rounded-pill bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-ink)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {status === 'sending' ? t('reg.sending') : t('reg.submit')}
              </button>
            </div>
          </Card>
        </aside>
      </form>

      {/* The regulations you are agreeing to, on the page where you enter. */}
      {tournament.sportId === 'football' && (
        <section className="shell pb-14">
          <SectionHeading eyebrow="BTU Uni League" title={t('section.rules')} />
          <p className="mb-5 -mt-2 text-sm text-slate">{t('rules.lede')}</p>
          <LeagueRules />
        </section>
      )}
    </Themed>
  )
}

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
