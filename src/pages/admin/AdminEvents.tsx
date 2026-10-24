import { RecordEditor, type FieldSpec } from '@/pages/admin/RecordEditor'
import { newId } from '@/pages/admin/useRows'

const fields: FieldSpec[] = [
  { key: 'title_ka', label: 'სათაური (ქართულად)', kind: 'text' },
  { key: 'title_en', label: 'Title (English)', kind: 'text' },
  { key: 'summary_ka', label: 'აღწერა (ქართულად)', kind: 'textarea' },
  { key: 'summary_en', label: 'Summary (English)', kind: 'textarea' },
  { key: 'starts_at', label: 'დაწყება', kind: 'datetime' },
  {
    key: 'kind',
    label: 'ტიპი',
    kind: 'select',
    options: [
      { value: 'party', label: 'წვეულება' },
      { value: 'ceremony', label: 'ცერემონია' },
      { value: 'social', label: 'შეკრება' },
    ],
  },
  { key: 'venue_ka', label: 'ადგილი (ქართულად)', kind: 'text' },
  { key: 'venue_en', label: 'Venue (English)', kind: 'text' },
  { key: 'city_ka', label: 'ქალაქი (ქართულად)', kind: 'text' },
  { key: 'city_en', label: 'City (English)', kind: 'text' },
  { key: 'ticket_url', label: 'ბილეთების ბმული', kind: 'text', wide: true },
  { key: 'lineup', label: 'ლაინაპი (მძიმით გამოყოფილი)', kind: 'list', wide: true },
  { key: 'image_url', label: 'პოსტერი', kind: 'image', folder: 'events' },
]

export function AdminEvents() {
  return (
    <RecordEditor
      title="ივენთები"
      hint="გასული თარიღის ივენთი ავტომატურად ჩატარებულებში გადადის."
      table="events"
      orderBy="starts_at"
      fields={fields}
      addLabel="+ ახალი ივენთი"
      summarise={(row) => String(row.title_ka || row.title_en || '')}
      blank={() => ({
        id: newId('event'),
        title_en: '',
        title_ka: '',
        summary_en: '',
        summary_ka: '',
        kind: 'party',
        starts_at: new Date().toISOString().slice(0, 16),
        venue_en: '',
        venue_ka: '',
        city_en: 'Tbilisi',
        city_ka: 'თბილისი',
        university_id: 'btu',
        ticket_url: null,
        image_url: null,
        lineup: [],
      })}
    />
  )
}
