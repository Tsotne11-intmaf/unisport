import { saveRow, type Row } from '@/data/admin'
import { adminInput, Button, ImageField, Labelled, Panel, Status } from '@/pages/admin/ui'
import { newId, useRows } from '@/pages/admin/useRows'

const roles = [
  { value: 'gk', label: 'მეკარე' },
  { value: 'defender', label: 'მცველი' },
  { value: 'midfielder', label: 'ნახევარმცველი' },
  { value: 'striker', label: 'თავდამსხმელი' },
]

const TOURNAMENT = 'btu-football-league'

const str = (row: Row, key: string) => (row[key] as string | null) ?? ''

/** The All-Star XI: a name and a badge per place, plus the bench. */
export function AdminAllstar() {
  const { rows, loading, status, setStatus, patch, save, remove, add } = useRows(
    'allstar_players',
    'sort_order',
  )

  // Season and round are the same for the whole squad, so they are edited once
  // here and written onto every row.
  const season = rows[0]
  const applyToAll = async (changes: Row) => {
    for (const row of rows) patch(row.id as string, changes)
    const results = await Promise.all(
      rows.map((row) => saveRow('allstar_players', { ...row, ...changes })),
    )
    const failed = results.find((result) => result.error)
    setStatus(
      failed
        ? { kind: 'error', text: failed.error! }
        : { kind: 'ok', text: 'სეზონი განახლდა.' },
    )
  }

  const addSlot = (bench: boolean) =>
    add({
      id: newId(bench ? 'bench' : 'slot'),
      tournament_id: TOURNAMENT,
      season_en: str(season ?? {}, 'season_en'),
      season_ka: str(season ?? {}, 'season_ka'),
      round: str(season ?? {}, 'round'),
      role: bench ? 'midfielder' : 'striker',
      slot_x: 50,
      slot_y: 50,
      player_name: '',
      crest_url: null,
      is_captain: false,
      is_bench: bench,
      sort_order: rows.length,
    })

  if (loading) return <Panel title="ALLSTAR">იტვირთება…</Panel>

  const pitch = rows.filter((row) => !row.is_bench)
  const bench = rows.filter((row) => row.is_bench)

  return (
    <div className="space-y-5">
      <Panel title="სეზონი" hint="ეს წარწერები მოედნის თავზე ჩანს.">
        <div className="grid gap-4 sm:grid-cols-3">
          <Labelled label="სეზონი (ქართულად)">
            <input
              className={adminInput}
              defaultValue={str(season ?? {}, 'season_ka')}
              onBlur={(event) => applyToAll({ season_ka: event.target.value })}
            />
          </Labelled>
          <Labelled label="Season (English)">
            <input
              className={adminInput}
              defaultValue={str(season ?? {}, 'season_en')}
              onBlur={(event) => applyToAll({ season_en: event.target.value })}
            />
          </Labelled>
          <Labelled label="ტური">
            <input
              className={adminInput}
              defaultValue={str(season ?? {}, 'round')}
              onBlur={(event) => applyToAll({ round: event.target.value })}
            />
          </Labelled>
        </div>
      </Panel>

      <Panel
        title="შემადგენლობა"
        hint="მოედანზე განლაგებული მოთამაშეები."
        action={<Button onClick={() => addSlot(false)}>+ ადგილის დამატება</Button>}
      >
        <ul className="space-y-3">
          {pitch.map((row) => (
            <SlotRow
              key={row.id as string}
              row={row}
              onPatch={(changes) => patch(row.id as string, changes)}
              onSave={() => save(row)}
              onRemove={() => remove(row.id as string)}
            />
          ))}
          {pitch.length === 0 && <Empty />}
        </ul>
      </Panel>

      <Panel
        title="სათადარიგო"
        action={<Button onClick={() => addSlot(true)}>+ სათადარიგოს დამატება</Button>}
      >
        <ul className="space-y-3">
          {bench.map((row) => (
            <SlotRow
              key={row.id as string}
              row={row}
              onPatch={(changes) => patch(row.id as string, changes)}
              onSave={() => save(row)}
              onRemove={() => remove(row.id as string)}
            />
          ))}
          {bench.length === 0 && <Empty />}
        </ul>
        <Status value={status} />
      </Panel>
    </div>
  )
}

function SlotRow({
  row,
  onPatch,
  onSave,
  onRemove,
}: {
  row: Row
  onPatch: (changes: Row) => void
  onSave: () => void
  onRemove: () => void
}) {
  return (
    <li className="rounded-xl border border-line p-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
        <Labelled label="სახელი და გვარი">
          <input
            className={adminInput}
            value={str(row, 'player_name')}
            onChange={(event) => onPatch({ player_name: event.target.value })}
          />
        </Labelled>

        <Labelled label="პოზიცია">
          <select
            className={adminInput}
            value={str(row, 'role')}
            onChange={(event) => onPatch({ role: event.target.value })}
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </Labelled>

        <ImageField
          label="კლუბის ლოგო"
          folder="allstar"
          round
          value={(row.crest_url as string | null) ?? null}
          onChange={(crest_url) => onPatch({ crest_url })}
        />

        {!row.is_bench && (
          <>
            <Labelled label="X მოედანზე (%)">
              <input
                type="number"
                min={0}
                max={100}
                className={adminInput}
                value={Number(row.slot_x ?? 50)}
                onChange={(event) => onPatch({ slot_x: Number(event.target.value) })}
              />
            </Labelled>
            <Labelled label="Y მოედანზე (%)">
              <input
                type="number"
                min={0}
                max={100}
                className={adminInput}
                value={Number(row.slot_y ?? 50)}
                onChange={(event) => onPatch({ slot_y: Number(event.target.value) })}
              />
            </Labelled>
          </>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(row.is_captain)}
            onChange={(event) => onPatch({ is_captain: event.target.checked })}
          />
          კაპიტანი
        </label>
        <div className="ml-auto flex gap-2">
          <Button tone="danger" onClick={onRemove}>
            წაშლა
          </Button>
          <Button onClick={onSave}>შენახვა</Button>
        </div>
      </div>
    </li>
  )
}

const Empty = () => (
  <li className="rounded-xl border border-dashed border-line px-4 py-8 text-center text-sm text-slate">
    ჯერ არაფერია.
  </li>
)
