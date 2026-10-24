import type { Row } from '@/data/admin'
import { adminInput, Button, ImageField, Labelled, Panel, Status } from '@/pages/admin/ui'
import { useRows } from '@/pages/admin/useRows'

export type FieldSpec =
  | { key: string; label: string; kind: 'text' | 'date' | 'datetime' | 'number'; wide?: boolean }
  | { key: string; label: string; kind: 'textarea'; wide?: boolean }
  | { key: string; label: string; kind: 'checkbox' }
  | { key: string; label: string; kind: 'image'; folder: string; round?: boolean }
  | { key: string; label: string; kind: 'list'; wide?: boolean }
  | {
      key: string
      label: string
      kind: 'select'
      options: Array<{ value: string; label: string }>
    }

/**
 * A table of records, each one a collapsed row that opens into its fields.
 * Tournaments carry thirty columns; without the fold the page is unreadable.
 */
export function RecordEditor({
  title,
  hint,
  table,
  orderBy,
  fields,
  blank,
  summarise,
  addLabel,
}: {
  title: string
  hint?: string
  table: string
  orderBy?: string
  fields: FieldSpec[]
  blank: () => Row
  summarise: (row: Row) => string
  addLabel: string
}) {
  const { rows, loading, status, patch, save, remove, add } = useRows(table, orderBy)

  if (loading) return <Panel title={title}>იტვირთება…</Panel>

  return (
    <Panel
      title={title}
      hint={hint}
      action={<Button onClick={() => add(blank())}>{addLabel}</Button>}
    >
      <ul className="space-y-2">
        {rows.map((row) => (
          <li key={row.id as string} className="rounded-xl border border-line">
            <details>
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold hover:bg-mist">
                {summarise(row) || <span className="text-slate">უსათაურო</span>}
              </summary>

              <div className="border-t border-line p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {fields.map((field) => (
                    <FieldInput
                      key={field.key}
                      field={field}
                      row={row}
                      onPatch={(changes) => patch(row.id as string, changes)}
                    />
                  ))}
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  <Button tone="danger" onClick={() => remove(row.id as string)}>
                    წაშლა
                  </Button>
                  <Button onClick={() => save(row)}>შენახვა</Button>
                </div>
              </div>
            </details>
          </li>
        ))}

        {rows.length === 0 && (
          <li className="rounded-xl border border-dashed border-line px-4 py-8 text-center text-sm text-slate">
            ჯერ არაფერია. დააჭირე „{addLabel}".
          </li>
        )}
      </ul>

      <Status value={status} />
    </Panel>
  )
}

function FieldInput({
  field,
  row,
  onPatch,
}: {
  field: FieldSpec
  row: Row
  onPatch: (changes: Row) => void
}) {
  const raw = row[field.key]
  const text = (raw as string | null) ?? ''

  if (field.kind === 'image') {
    return (
      <ImageField
        label={field.label}
        folder={field.folder}
        round={field.round}
        value={(raw as string | null) ?? null}
        onChange={(next) => onPatch({ [field.key]: next })}
      />
    )
  }

  if (field.kind === 'checkbox') {
    return (
      <label className="flex cursor-pointer items-center gap-2 self-end py-2 text-sm">
        <input
          type="checkbox"
          checked={Boolean(raw)}
          onChange={(event) => onPatch({ [field.key]: event.target.checked })}
        />
        {field.label}
      </label>
    )
  }

  if (field.kind === 'select') {
    return (
      <Labelled label={field.label}>
        <select
          className={adminInput}
          value={text}
          onChange={(event) => onPatch({ [field.key]: event.target.value })}
        >
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Labelled>
    )
  }

  if (field.kind === 'textarea') {
    return (
      <Labelled label={field.label} wide={field.wide}>
        <textarea
          rows={4}
          className={adminInput}
          value={text}
          onChange={(event) => onPatch({ [field.key]: event.target.value })}
        />
      </Labelled>
    )
  }

  if (field.kind === 'list') {
    // Stored as a Postgres text[]; typed here one item per comma.
    const list = Array.isArray(raw) ? (raw as string[]) : []
    return (
      <Labelled label={field.label} wide={field.wide}>
        <input
          className={adminInput}
          value={list.join(', ')}
          onChange={(event) =>
            onPatch({
              [field.key]: event.target.value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean),
            })
          }
        />
      </Labelled>
    )
  }

  const type =
    field.kind === 'date'
      ? 'date'
      : field.kind === 'datetime'
        ? 'datetime-local'
        : field.kind === 'number'
          ? 'number'
          : 'text'

  // datetime-local will not accept the trailing zone Postgres hands back.
  const value = field.kind === 'datetime' ? text.slice(0, 16) : text

  return (
    <Labelled label={field.label} wide={field.wide}>
      <input
        type={type}
        className={adminInput}
        value={value}
        onChange={(event) => {
          const next = event.target.value
          onPatch({
            [field.key]:
              field.kind === 'number' ? (next === '' ? null : Number(next)) : next,
          })
        }}
      />
    </Labelled>
  )
}
