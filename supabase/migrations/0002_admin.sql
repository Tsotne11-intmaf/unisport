-- Everything the admin panel needs on top of 0001.
--
-- The split is: anon may read published content and insert entries and votes;
-- a signed-in user may do anything. There is no public sign-up, so "signed in"
-- means an account you created yourself in Authentication -> Users.

-- All-Star XI --------------------------------------------------------------
-- One row per place on the pitch, plus the bench. The crest lives on the row
-- rather than behind a club id, because the admin edits a name and a badge.

create table if not exists allstar_players (
  id            text primary key,
  tournament_id text not null,
  season_en     text not null default '',
  season_ka     text not null default '',
  round         text not null default '',
  role          text not null
                  check (role in ('gk', 'defender', 'midfielder', 'striker')),
  slot_x        numeric not null default 50,
  slot_y        numeric not null default 50,
  player_name   text,
  crest_url     text,
  is_captain    boolean not null default false,
  is_bench      boolean not null default false,
  sort_order    integer not null default 0
);

create index if not exists allstar_tournament_idx
  on allstar_players (tournament_id, is_bench, sort_order);

alter table allstar_players enable row level security;

create policy "public read allstar" on allstar_players for select using (true);

-- Player of the week -------------------------------------------------------
-- 0001 identified a candidate by club; the admin types a name and uploads two
-- pictures instead, so the row carries them directly.

alter table vote_candidates add column if not exists photo_url text;
alter table vote_candidates add column if not exists logo_url  text;
alter table vote_candidates add column if not exists sort_order integer not null default 0;
alter table vote_candidates alter column club_id drop not null;
alter table vote_candidates alter column name    drop not null;

-- Writes for a signed-in admin ---------------------------------------------
-- Separate policies per command so a mistake in one cannot silently widen
-- another, and so the intent reads from the policy list in the dashboard.

do $$
declare
  t text;
begin
  foreach t in array array[
    'universities', 'sports', 'tournaments', 'events', 'news',
    'vote_candidates', 'allstar_players'
  ]
  loop
    execute format(
      'create policy "admin insert %1$s" on %1$I for insert to authenticated with check (true)', t);
    execute format(
      'create policy "admin update %1$s" on %1$I for update to authenticated using (true) with check (true)', t);
    execute format(
      'create policy "admin delete %1$s" on %1$I for delete to authenticated using (true)', t);
  end loop;
end $$;

-- Reading the entries ------------------------------------------------------
-- Still closed to anon, so one captain cannot list another team's contacts.
-- A signed-in admin can read them, which is what the entries screen shows.

create policy "admin read registrations"
  on registrations for select to authenticated using (true);
create policy "admin read team registrations"
  on team_registrations for select to authenticated using (true);
create policy "admin read team players"
  on team_registration_players for select to authenticated using (true);
create policy "admin read votes"
  on player_votes for select to authenticated using (true);

-- Storage ------------------------------------------------------------------
-- Create a second bucket in the dashboard (Storage -> New bucket -> name
-- "media", public) for crests, player photos and article images, then run:
--
--   create policy "public read media" on storage.objects
--     for select using (bucket_id = 'media');
--   create policy "admin write media" on storage.objects
--     for insert to authenticated with check (bucket_id = 'media');
--   create policy "admin replace media" on storage.objects
--     for update to authenticated using (bucket_id = 'media');
--   create policy "admin remove media" on storage.objects
--     for delete to authenticated using (bucket_id = 'media');
