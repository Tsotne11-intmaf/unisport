import { RecordEditor, type FieldSpec } from '@/pages/admin/RecordEditor'
import { newId } from '@/pages/admin/useRows'

const fields: FieldSpec[] = [
  { key: 'title_ka', label: 'სათაური (ქართულად)', kind: 'text' },
  { key: 'title_en', label: 'Title (English)', kind: 'text' },
  { key: 'slug', label: 'მისამართი (slug, მხოლოდ ლათინური)', kind: 'text', wide: true },
  { key: 'excerpt_ka', label: 'მოკლე აღწერა (ქართულად)', kind: 'textarea' },
  { key: 'excerpt_en', label: 'Excerpt (English)', kind: 'textarea' },
  { key: 'body_ka', label: 'ტექსტი (ქართულად)', kind: 'textarea', wide: true },
  { key: 'body_en', label: 'Body (English)', kind: 'textarea', wide: true },
  { key: 'published_at', label: 'გამოქვეყნების დრო', kind: 'datetime' },
  { key: 'read_minutes', label: 'წასაკითხი წუთები', kind: 'number' },
  {
    key: 'sport_id',
    label: 'სპორტი',
    kind: 'select',
    options: [
      { value: '', label: '— არცერთი —' },
      { value: 'padel', label: 'პადელი' },
      { value: 'football', label: 'ფეხბურთი' },
    ],
  },
  { key: 'is_announcement', label: 'განცხადებაა', kind: 'checkbox' },
  { key: 'image_url', label: 'სურათი', kind: 'image', folder: 'news' },
]

export function AdminNews() {
  return (
    <RecordEditor
      title="სიახლეები და განცხადებები"
      hint="slug არის ბმულში ჩასმული ნაწილი — /news/slug. ქართულად ნუ დაწერ."
      table="news"
      orderBy="published_at"
      fields={fields}
      addLabel="+ ახალი სიახლე"
      summarise={(row) => String(row.title_ka || row.title_en || '')}
      blank={() => ({
        id: newId('news'),
        slug: `story-${Date.now()}`,
        title_en: '',
        title_ka: '',
        excerpt_en: '',
        excerpt_ka: '',
        body_en: '',
        body_ka: '',
        sport_id: null,
        university_id: 'btu',
        published_at: new Date().toISOString().slice(0, 16),
        is_announcement: false,
        read_minutes: 2,
        image_url: null,
        key_dates: [],
      })}
    />
  )
}
