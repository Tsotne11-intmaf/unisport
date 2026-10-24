import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import type { Sport, SportId, University } from '@/types'

import { loadHubData, seedData, type DataSource, type HubData } from './repository'
import { ALL } from './selectors'

const MY_UNIVERSITY_KEY = 'campus-hub-university'

interface HubValue extends HubData {
  source: DataSource
  error: string | null
  loading: boolean
  universityById: (id: string | null | undefined) => University | undefined
  sportById: (id: SportId) => Sport | undefined
  /** The university the visitor picked once; every page defaults its filter to it. */
  myUniversityId: string
  setMyUniversityId: (id: string) => void
}

const HubContext = createContext<HubValue | null>(null)

function readStoredUniversity(): string {
  try {
    return localStorage.getItem(MY_UNIVERSITY_KEY) ?? ALL
  } catch {
    return ALL
  }
}

export function HubProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<HubData>(seedData)
  const [source, setSource] = useState<DataSource>('seed')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [myUniversityId, setMyUniversityIdState] = useState<string>(readStoredUniversity)

  useEffect(() => {
    let active = true
    loadHubData().then((result) => {
      if (!active) return
      setData(result.data)
      setSource(result.source)
      setError(result.error)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  const setMyUniversityId = useCallback((id: string) => {
    setMyUniversityIdState(id)
    try {
      localStorage.setItem(MY_UNIVERSITY_KEY, id)
    } catch {
      // Nothing to do — the choice just won't survive a reload.
    }
  }, [])

  const value = useMemo<HubValue>(() => {
    const universityIndex = new Map(data.universities.map((item) => [item.id, item]))
    const sportIndex = new Map(data.sports.map((item) => [item.id, item]))
    return {
      ...data,
      source,
      error,
      loading,
      universityById: (id) => (id ? universityIndex.get(id) : undefined),
      sportById: (id) => sportIndex.get(id),
      myUniversityId,
      setMyUniversityId,
    }
  }, [data, source, error, loading, myUniversityId, setMyUniversityId])

  return <HubContext value={value}>{children}</HubContext>
}

export function useHub(): HubValue {
  const value = useContext(HubContext)
  if (!value) throw new Error('useHub must be used inside <HubProvider>')
  return value
}
