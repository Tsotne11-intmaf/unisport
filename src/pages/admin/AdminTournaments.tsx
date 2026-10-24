import { RecordEditor, type FieldSpec } from '@/pages/admin/RecordEditor'
import { newId } from '@/pages/admin/useRows'

const fields: FieldSpec[] = [
  { key: 'title_ka', label: 'სათაური (ქართულად)', kind: 'text' },
  { key: 'title_en', label: 'Title (English)', kind: 'text' },
  { key: 'summary_ka', label: 'აღწერა (ქართულად)', kind: 'textarea' },
  { key: 'summary_en', label: 'Summary (English)', kind: 'textarea' },
  {
    key: 'sport_id',
    label: 'სპორტი',
    kind: 'select',
    options: [
      { value: 'padel', label: 'პადელი' },
      { value: 'football', label: 'ფეხბურთი' },
    ],
  },
  {
    key: 'status',
    label: 'სტატუსი',
    kind: 'select',
    options: [
      { value: 'registration_open', label: 'რეგისტრაცია ღიაა' },
      { value: 'upcoming', label: 'მომავალი' },
      { value: 'ongoing', label: 'მიმდინარე' },
      { value: 'finished', label: 'დასრულებული' },
    ],
  },
  { key: 'start_date', label: 'დაწყება', kind: 'date' },
  { key: 'end_date', label: 'დასრულება', kind: 'date' },
  { key: 'registration_opens_at', label: 'რეგისტრაცია იხსნება', kind: 'date' },
  { key: 'registration_deadline', label: 'რეგისტრაცია იხურება', kind: 'date' },
  { key: 'venue_ka', label: 'ადგილი (ქართულად)', kind: 'text' },
  { key: 'venue_en', label: 'Venue (English)', kind: 'text' },
  { key: 'city_ka', label: 'ქალაქი (ქართულად)', kind: 'text' },
  { key: 'city_en', label: 'City (English)', kind: 'text' },
  { key: 'format_ka', label: 'ფორმატი (ქართულად)', kind: 'text' },
  { key: 'format_en', label: 'Format (English)', kind: 'text' },
  {
    key: 'level',
    label: 'დონე',
    kind: 'select',
    options: [
      { value: 'open', label: 'ყველა დონე' },
      { value: 'amateur', label: 'მოყვარულთა დონე' },
      { value: 'beginner', label: 'დამწყები' },
      { value: 'intermediate', label: 'საშუალო' },
      { value: 'advanced', label: 'გამოცდილი' },
    ],
  },
  { key: 'fee', label: 'მონაწილეობა (₾)', kind: 'number' },
  { key: 'slots', label: 'ადგილების რაოდენობა', kind: 'number' },
  { key: 'slots_taken', label: 'დაკავებული ადგილი', kind: 'number' },
  { key: 'squad_min', label: 'მინიმუმ მოთამაშე', kind: 'number' },
  { key: 'squad_max', label: 'მაქსიმუმ მოთამაშე', kind: 'number' },
  { key: 'team_based', label: 'გუნდური ტურნირია', kind: 'checkbox' },
  { key: 'collect_player_phones', label: 'მოთამაშის ტელეფონი იკითხება', kind: 'checkbox' },
  { key: 'collect_team_logo', label: 'გუნდის ლოგო იკითხება', kind: 'checkbox' },
  { key: 'image_url', label: 'სურათი', kind: 'image', folder: 'tournaments' },
  { key: 'image_focus', label: 'სურათის ფოკუსი (მაგ. 50% 30%)', kind: 'text' },
]

export function AdminTournaments() {
  return (
    <RecordEditor
      title="ტურნირები"
      hint="ახალი ტურნირი მაშინვე გამოჩნდება სპორტის გვერდზე და რეგისტრაციაში."
      table="tournaments"
      orderBy="start_date"
      fields={fields}
      addLabel="+ ახალი ტურნირი"
      summarise={(row) => String(row.title_ka || row.title_en || '')}
      blank={() => ({
        id: newId('tournament'),
        sport_id: 'football',
        host_university_id: 'btu',
        title_en: '',
        title_ka: '',
        summary_en: '',
        summary_ka: '',
        format_en: '',
        format_ka: '',
        status: 'upcoming',
        start_date: new Date().toISOString().slice(0, 10),
        end_date: new Date().toISOString().slice(0, 10),
        venue_en: '',
        venue_ka: '',
        city_en: 'Tbilisi',
        city_ka: 'თბილისი',
        level: 'open',
        fee: null,
        slots: null,
        slots_taken: 0,
        registration_opens_at: null,
        registration_deadline: null,
        team_based: true,
        collect_player_phones: false,
        collect_team_logo: false,
        squad_min: null,
        squad_max: null,
        image_url: null,
        image_focus: null,
      })}
    />
  )
}
