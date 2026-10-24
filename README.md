# UniSport

A hub that gathers what every university runs — padel and football tournaments,
campus events and announcements — into one site. Students pick their university
once and the whole site narrows to their campus, including the tournament
registration form.

Georgian and English throughout, with a toggle in the header.

## Running it

```bash
npm install
npm run dev
```

Out of the box it runs on the seed data in `src/data`, so everything works with
no database.

## Scripts

| Command            | What it does                                        |
| ------------------ | --------------------------------------------------- |
| `npm run dev`      | Dev server on http://localhost:5173                  |
| `npm run build`    | Typecheck, then production build into `dist/`        |
| `npm run typecheck`| Typecheck only                                       |
| `npm run lint`     | oxlint                                               |
| `npm run db:seed`  | Regenerate `supabase/seed.sql` from `src/data`       |

## Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/migrations/0001_init.sql`, then
   `supabase/seed.sql` to load the demo content.
3. Copy `.env.example` to `.env.local` and fill in both values from
   **Project settings → API**:

   ```
   VITE_SUPABASE_URL=https://<project>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon public key>
   ```

4. Restart `npm run dev`.

The site reads Supabase when those variables are set and falls back to the seed
data whenever a query fails, so a half-finished setup never shows an empty page.
The footer says which source is live.

Row level security is on: the content tables are world-readable with the anon
key, `registrations` accepts inserts but cannot be read back with it, so one
student can't list everyone else's contact details. Read entries in the Supabase
dashboard, or add an admin app using the service role key (never ship that key
to the browser).

## Deploying to Vercel

```bash
npm i -g vercel
vercel login
vercel link
vercel --prod
```

Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under **Settings →
Environment Variables** in the Vercel dashboard, then redeploy. `vercel.json`
already rewrites every path to `index.html` so client-side routes work on
refresh.

## How the code is laid out

```
src/
  data/
    universities.ts   universities + sports
    tournaments.ts    one row per tournament, owned by its host university
    content.ts        events + news
    football.ts       clubs, groups, the All-Star XI, vote candidates
    repository.ts     Supabase reads, seed fallback, registration insert
    selectors.ts      filtering by university / sport
    HubProvider.tsx   loads the data once, remembers "my university"
  lib/
    i18n.tsx          ka/en dictionary and language toggle
    format.ts         dates, pinned to Tbilisi time
    supabase.ts       client, null until env vars exist
  components/         shared cards, filters, header, footer
  pages/              one file per route
```

### Adding content

Edit the files in `src/data`, then `npm run db:seed` and run the regenerated
`supabase/seed.sql`. Every entry carries both `en` and `ka` text.

A tournament's `hostUniversityId` is the university running it; `null` means it
is open to every campus, and those stay visible under any university filter.
Same for `universityId` on events and news.

The football page carries the sections specific to a university's own league:
collapsible group tables, the All-Star XI, the roll of winning teams and the
player-of-the-week vote. They all live in `src/data/football.ts` and are keyed
by club, so they appear only for the campus those clubs belong to.

Team crests and squad photos sit in `public/teams/`, matchday photos in
`public/gallery/`, and university crests in `public/universities/` (a missing
file falls back to the short-name tile rather than a broken image). All-Star slots start empty
on purpose — the pitch is drawn from `allstarSquad.slots`, and filling in
`playerName` / `clubId` is what announces the line-up.

### Section styling

Each section sets a CSS accent on a wrapper (`theme-padel`, `theme-football`,
`theme-news`, `theme-events` in `src/index.css`) and the shared components read
`var(--accent)`. That is how one set of cards gives padel its lime, football its
red and news its editorial look.

### Images

Every tournament, event and news row has an `imageUrl`. While it is `null` the
`Media` component draws a themed stand-in tinted with the university's colour.
Drop in real photo URLs and they take over with no layout change.
