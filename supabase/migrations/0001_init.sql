-- UniSport hub schema.
-- Every campus publishes its own tournaments, events and news; the site aggregates them.
-- Translated fields are stored as two columns (*_en / *_ka) so a row carries both languages.

create table if not exists universities (
  id          text primary key,
  name_en     text not null,
  name_ka     text not null,
  short_name  text not null,
  city_en     text not null,
  city_ka     text not null,
  color       text not null default '#6b7280',
  created_at  timestamptz not null default now()
);

create table if not exists sports (
  id       text primary key,
  name_en  text not null,
  name_ka  text not null,
  blurb_en text not null default '',
  blurb_ka text not null default ''
);

create table if not exists tournaments (
  id                    text primary key,
  sport_id              text not null references sports (id) on delete restrict,
  -- null means the tournament is open to every campus rather than hosted by one.
  host_university_id    text references universities (id) on delete set null,
  title_en              text not null,
  title_ka              text not null,
  summary_en            text not null default '',
  summary_ka            text not null default '',
  format_en             text not null default '',
  format_ka             text not null default '',
  status                text not null default 'upcoming'
                          check (status in ('registration_open', 'upcoming', 'ongoing', 'finished')),
  start_date            date not null,
  end_date              date not null,
  venue_en              text not null default '',
  venue_ka              text not null default '',
  city_en               text not null default '',
  city_ka               text not null default '',
  level                 text not null default 'open'
                          check (level in ('beginner', 'intermediate', 'advanced', 'open')),
  fee                   integer,
  slots                 integer,
  slots_taken           integer not null default 0,
  registration_deadline date,
  image_url             text,
  created_at            timestamptz not null default now()
);

create table if not exists events (
  id            text primary key,
  title_en      text not null,
  title_ka      text not null,
  summary_en    text not null default '',
  summary_ka    text not null default '',
  kind          text not null default 'social'
                  check (kind in ('party', 'ceremony', 'social')),
  starts_at     timestamptz not null,
  venue_en      text not null default '',
  venue_ka      text not null default '',
  city_en       text not null default '',
  city_ka       text not null default '',
  university_id text references universities (id) on delete set null,
  ticket_url    text,
  image_url     text,
  created_at    timestamptz not null default now()
);

create table if not exists news (
  id              text primary key,
  slug            text not null unique,
  title_en        text not null,
  title_ka        text not null,
  excerpt_en      text not null default '',
  excerpt_ka      text not null default '',
  body_en         text not null default '',
  body_ka         text not null default '',
  sport_id        text references sports (id) on delete set null,
  university_id   text references universities (id) on delete set null,
  published_at    timestamptz not null default now(),
  is_announcement boolean not null default false,
  read_minutes    integer not null default 2,
  image_url       text
);

create table if not exists registrations (
  id            uuid primary key default gen_random_uuid(),
  sport_id      text not null references sports (id) on delete restrict,
  tournament_id text not null references tournaments (id) on delete cascade,
  university_id text not null references universities (id) on delete restrict,
  full_name     text not null,
  email         text not null,
  phone         text not null,
  level         text not null default 'beginner'
                  check (level in ('beginner', 'intermediate', 'advanced', 'open')),
  partner_name  text,
  notes         text,
  created_at    timestamptz not null default now()
);

create index if not exists tournaments_sport_idx on tournaments (sport_id, start_date);
create index if not exists tournaments_host_idx on tournaments (host_university_id);
create index if not exists news_published_idx on news (published_at desc);
create index if not exists events_starts_idx on events (starts_at);
create index if not exists registrations_tournament_idx on registrations (tournament_id);

-- Row level security -------------------------------------------------------
-- Published content is world-readable with the anon key. Writes are left to
-- the service role (the Supabase dashboard, or an admin app you add later).

alter table universities enable row level security;
alter table sports       enable row level security;
alter table tournaments  enable row level security;
alter table events       enable row level security;
alter table news         enable row level security;
alter table registrations enable row level security;

create policy "public read universities" on universities for select using (true);
create policy "public read sports"       on sports       for select using (true);
create policy "public read tournaments"  on tournaments  for select using (true);
create policy "public read events"       on events       for select using (true);
create policy "public read news"         on news         for select using (true);

-- Anyone may submit a registration; nobody may read them back with the anon key,
-- so one student cannot list everyone else's contact details.
create policy "public insert registrations" on registrations for insert with check (true);

-- Player of the week ------------------------------------------------------

create table if not exists vote_candidates (
  id          text primary key,
  name        text not null,
  club_id     text not null,
  position_en text not null default '',
  position_ka text not null default '',
  round       text,
  is_open     boolean not null default true
);

create table if not exists player_votes (
  id           uuid primary key default gen_random_uuid(),
  candidate_id text not null references vote_candidates (id) on delete cascade,
  created_at   timestamptz not null default now()
);

create index if not exists player_votes_candidate_idx on player_votes (candidate_id);

alter table vote_candidates enable row level security;
alter table player_votes    enable row level security;

create policy "public read vote candidates" on vote_candidates for select using (true);
-- Anyone may cast a vote; tallies are read from the view below rather than the raw rows.
create policy "public insert votes" on player_votes for insert with check (true);

create or replace view vote_tallies as
  select c.id as candidate_id, count(v.id) as votes
  from vote_candidates c
  left join player_votes v on v.candidate_id = c.id
  group by c.id;
