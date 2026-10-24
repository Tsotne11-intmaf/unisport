import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { AdminAllstar } from '@/pages/admin/AdminAllstar'
import { AdminEvents } from '@/pages/admin/AdminEvents'
import { AdminNews } from '@/pages/admin/AdminNews'
import { AdminTournaments } from '@/pages/admin/AdminTournaments'
import { AdminVote } from '@/pages/admin/AdminVote'
import { adminInput, Button } from '@/pages/admin/ui'
import { signIn, signOut, useSession } from '@/lib/auth'
import { isSupabaseConfigured } from '@/lib/supabase'

const sections = [
  { id: 'allstar', label: 'ALLSTAR', render: () => <AdminAllstar /> },
  { id: 'vote', label: 'კვირის მოთამაშე', render: () => <AdminVote /> },
  { id: 'tournaments', label: 'ტურნირები', render: () => <AdminTournaments /> },
  { id: 'events', label: 'ივენთები', render: () => <AdminEvents /> },
  { id: 'news', label: 'სიახლეები', render: () => <AdminNews /> },
] as const

type SectionId = (typeof sections)[number]['id']

/**
 * The panel. It is not linked from anywhere on the site — you reach it by
 * typing /admin — and it is gated on a Supabase session, so the URL on its own
 * shows a sign-in form and nothing else.
 */
export function AdminPage() {
  const { session, loading } = useSession()
  const [section, setSection] = useState<SectionId>('allstar')

  if (!isSupabaseConfigured) return <Blocked />
  if (loading) return <Centered>იტვირთება…</Centered>
  if (!session) return <SignIn />

  const current = sections.find((item) => item.id === section) ?? sections[0]

  return (
    <div className="bg-mist">
      <div className="shell py-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-wide text-slate uppercase">ადმინი</p>
            <h1 className="text-2xl font-semibold">საიტის მართვა</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm font-semibold text-graphite hover:underline">
              საიტის ნახვა ↗
            </Link>
            <Button tone="quiet" onClick={signOut}>
              გასვლა
            </Button>
          </div>
        </header>

        <nav className="mb-6 flex flex-wrap gap-2">
          {sections.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              aria-pressed={section === item.id}
              className={`cursor-pointer rounded-pill px-4 py-2 text-sm font-semibold transition-colors ${
                section === item.id
                  ? 'bg-ink text-white'
                  : 'border border-line bg-paper text-graphite hover:border-ink'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {current.render()}
      </div>
    </div>
  )
}

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setError(null)
    const result = await signIn(email, password)
    setBusy(false)
    if (result.error) setError('შესვლა ვერ მოხერხდა. შეამოწმე ელფოსტა და პაროლი.')
  }

  return (
    <Centered>
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-card border border-line bg-paper p-6"
      >
        <h1 className="text-xl font-semibold">ადმინის შესვლა</h1>
        <p className="mt-1 text-sm text-slate">
          ეს გვერდი საიტზე არსაიდან არ არის მიბმული.
        </p>

        <label className="mt-5 block">
          <span className="mb-1 block text-xs font-semibold text-slate">ელფოსტა</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={adminInput}
            autoComplete="username"
          />
        </label>

        <label className="mt-3 block">
          <span className="mb-1 block text-xs font-semibold text-slate">პაროლი</span>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={adminInput}
            autoComplete="current-password"
          />
        </label>

        {error && <p className="mt-3 text-sm font-medium text-football">{error}</p>}

        <div className="mt-5">
          <Button type="submit" disabled={busy}>
            {busy ? 'შედის…' : 'შესვლა'}
          </Button>
        </div>
      </form>
    </Centered>
  )
}

function Blocked() {
  return (
    <Centered>
      <div className="max-w-md rounded-card border border-line bg-paper p-6 text-center">
        <h1 className="text-xl font-semibold">Supabase არ არის დაკავშირებული</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate">
          ადმინ პანელი ბაზაზე მუშაობს. დააყენე{' '}
          <code className="rounded bg-mist px-1">VITE_SUPABASE_URL</code> და{' '}
          <code className="rounded bg-mist px-1">VITE_SUPABASE_ANON_KEY</code>, შემდეგ კი
          გადატვირთე.
        </p>
      </div>
    </Centered>
  )
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[70vh] place-items-center bg-mist px-4 py-16">{children}</div>
  )
}
