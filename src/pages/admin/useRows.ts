import { useCallback, useEffect, useState } from 'react'

import { deleteRow, listRows, saveRow, type Row } from '@/data/admin'

export interface Status {
  kind: 'ok' | 'error'
  text: string
}

/**
 * One table's rows, held in local state while they are edited and written back
 * a row at a time. Editing is optimistic in the sense that the form owns the
 * values; nothing is sent until Save, so a half-typed name never reaches the
 * database.
 */
export function useRows(table: string, orderBy = 'id') {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<Status | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    const result = await listRows(table, orderBy)
    setLoading(false)
    if (result.error) setStatus({ kind: 'error', text: result.error })
    else setRows(result.data ?? [])
  }, [table, orderBy])

  useEffect(() => {
    void reload()
  }, [reload])

  const patch = (id: string, changes: Row) =>
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...changes } : row)),
    )

  const save = async (row: Row) => {
    const result = await saveRow(table, row)
    setStatus(
      result.error
        ? { kind: 'error', text: result.error }
        : { kind: 'ok', text: 'შენახულია.' },
    )
  }

  const remove = async (id: string) => {
    const result = await deleteRow(table, id)
    if (result.error) {
      setStatus({ kind: 'error', text: result.error })
      return
    }
    setRows((current) => current.filter((row) => row.id !== id))
    setStatus({ kind: 'ok', text: 'წაშლილია.' })
  }

  const add = (row: Row) => setRows((current) => [...current, row])

  return { rows, loading, status, setStatus, patch, save, remove, add, reload }
}

/** A readable id for a new row, e.g. "news-1792820000000". */
export const newId = (prefix: string) => `${prefix}-${Date.now()}`
