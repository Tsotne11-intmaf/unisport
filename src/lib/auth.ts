import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'

import { supabase } from '@/lib/supabase'

/**
 * The admin's session. There is no public sign-up: the one account lives in
 * Supabase Authentication -> Users, created by hand. `loading` matters because
 * the first render happens before the stored session has been read back, and
 * showing the sign-in form for that instant would flash on every page load.
 */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
      setLoading(false)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  return { session, loading }
}

export async function signIn(email: string, password: string) {
  if (!supabase) return { error: 'not-configured' as const }
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  return { error: error?.message ?? null }
}

export async function signOut() {
  await supabase?.auth.signOut()
}
