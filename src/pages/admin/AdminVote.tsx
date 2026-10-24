import type { Row } from '@/data/admin'
import { adminInput, Button, ImageField, Labelled, Panel, Status } from '@/pages/admin/ui'
import { newId, useRows } from '@/pages/admin/useRows'

const str = (row: Row, key: string) => (row[key] as string | null) ?? ''

/** Player of the week: the nominees, their photo and their club badge. */
export function AdminVote() {
  const { rows, loading, status, patch, save, remove, add } = useRows(
    'vote_candidates',
    'sort_order',
  )

  if (loading) return <Panel title="კვირის მოთამაშე">იტვირთება…</Panel>

  const addCandidate = () =>
    add({
      id: newId('candidate'),
      name: '',
      club_id: null,
      position_en: '',
      position_ka: '',
      round: '',
      is_open: true,
      photo_url: null,
      logo_url: null,
      sort_order: rows.length,
    })

  return (
    <Panel
      title="კვირის საუკეთესო მოთამაშე"
      hint="სახელი, ფოტო და კლუბის ლოგო. ხმები ავტომატურად ითვლება — აქ არ იცვლება."
      action={<Button onClick={addCandidate}>+ კანდიდატის დამატება</Button>}
    >
      <ul className="space-y-3">
        {rows.map((row, index) => (
          <li key={row.id as string} className="rounded-xl border border-line p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate">
              <span className="grid size-6 place-items-center rounded-full bg-mist">
                {index + 1}
              </span>
              კანდიდატი
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Labelled label="სახელი და გვარი">
                <input
                  className={adminInput}
                  value={str(row, 'name')}
                  onChange={(event) => patch(row.id as string, { name: event.target.value })}
                />
              </Labelled>

              <Labelled label="ტური">
                <input
                  className={adminInput}
                  value={str(row, 'round')}
                  onChange={(event) => patch(row.id as string, { round: event.target.value })}
                />
              </Labelled>

              <ImageField
                label="მოთამაშის ფოტო"
                folder="vote"
                round
                value={(row.photo_url as string | null) ?? null}
                onChange={(photo_url) => patch(row.id as string, { photo_url })}
              />

              <ImageField
                label="კლუბის ლოგო"
                folder="vote"
                value={(row.logo_url as string | null) ?? null}
                onChange={(logo_url) => patch(row.id as string, { logo_url })}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(row.is_open)}
                  onChange={(event) =>
                    patch(row.id as string, { is_open: event.target.checked })
                  }
                />
                ხმის მიცემა ღიაა
              </label>
              <div className="ml-auto flex gap-2">
                <Button tone="danger" onClick={() => remove(row.id as string)}>
                  წაშლა
                </Button>
                <Button onClick={() => save(row)}>შენახვა</Button>
              </div>
            </div>
          </li>
        ))}

        {rows.length === 0 && (
          <li className="rounded-xl border border-dashed border-line px-4 py-8 text-center text-sm text-slate">
            ჯერ კანდიდატები არ არის.
          </li>
        )}
      </ul>

      <Status value={status} />
    </Panel>
  )
}
