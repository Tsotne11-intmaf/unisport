import { supabase } from '@/lib/supabase'

/**
 * Thin CRUD over the content tables for the admin panel. Everything here runs
 * as the signed-in admin; row level security is what actually enforces that,
 * so these are plain queries with no permission logic of their own.
 */

export type Row = Record<string, unknown>

export interface Result<T = void> {
  data?: T
  error: string | null
}

const noClient = { error: 'Supabase is not connected.' } as const

export async function listRows(table: string, orderBy = 'id'): Promise<Result<Row[]>> {
  if (!supabase) return noClient
  const { data, error } = await supabase.from(table).select('*').order(orderBy)
  return { data: data ?? [], error: error?.message ?? null }
}

/** Insert or overwrite by primary key — the editor sends whole rows. */
export async function saveRow(table: string, row: Row): Promise<Result> {
  if (!supabase) return noClient
  const { error } = await supabase.from(table).upsert(row)
  return { error: error?.message ?? null }
}

export async function deleteRow(table: string, id: string): Promise<Result> {
  if (!supabase) return noClient
  const { error } = await supabase.from(table).delete().eq('id', id)
  return { error: error?.message ?? null }
}

/**
 * Put a picture in the public `media` bucket and hand back the URL to store on
 * the row. Names are prefixed with the folder and a timestamp so re-uploading
 * the same file does not collide or serve a stale cached copy.
 */
export async function uploadMedia(folder: string, file: File): Promise<Result<string>> {
  if (!supabase) return noClient

  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'png'
  const safe = file.name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 40)
  const path = `${folder}/${Date.now()}-${safe || 'image'}.${extension}`

  const { error } = await supabase.storage.from('media').upload(path, file, {
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) return { error: error.message }

  const { data } = supabase.storage.from('media').getPublicUrl(path)
  return { data: data.publicUrl, error: null }
}
