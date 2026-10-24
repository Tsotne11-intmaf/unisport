-- The squad and the nominees that used to live in src/data/football.ts.
-- Loading them means the admin opens on the real line-up to edit rather than
-- an empty pitch, and the site shows the same thing before and after the
-- database was connected.

insert into allstar_players
  (id, tournament_id, season_en, season_ka, round, role, slot_x, slot_y,
   player_name, crest_url, is_captain, is_bench, sort_order)
values
  ('st',    'btu-football-league', 'Summer season 2026', '2026 წლის ზაფხულის სეზონი', 'A17', 'striker',    50, 17, 'M. Asatiani',     '/teams/cloudy-street-logo.webp', false, false, 1),
  ('cm',    'btu-football-league', 'Summer season 2026', '2026 წლის ზაფხულის სეზონი', 'A17', 'midfielder', 50, 42, 'T. Kvatchadze',   '/teams/cloudy-street-logo.webp', false, false, 2),
  ('lb',    'btu-football-league', 'Summer season 2026', '2026 წლის ზაფხულის სეზონი', 'A17', 'defender',   23, 62, 'T. Meladze',      '/teams/galacticos-logo.png',     false, false, 3),
  ('rb',    'btu-football-league', 'Summer season 2026', '2026 წლის ზაფხულის სეზონი', 'A17', 'defender',   77, 62, 'N. Surguladze',   '/teams/rkinigzelebi-logo.png',   false, false, 4),
  ('gk',    'btu-football-league', 'Summer season 2026', '2026 წლის ზაფხულის სეზონი', 'A17', 'gk',         50, 84, 'D. Miminoshvili', null,                             true,  false, 5),
  ('sub-1', 'btu-football-league', 'Summer season 2026', '2026 წლის ზაფხულის სეზონი', 'A17', 'midfielder', 50, 50, 'N. Pirtskalava',  '/teams/cloudy-street-logo.webp', false, true,  6),
  ('sub-2', 'btu-football-league', 'Summer season 2026', '2026 წლის ზაფხულის სეზონი', 'A17', 'midfielder', 50, 50, 'L. Leqvinidze',   '/teams/galacticos-logo.png',     false, true,  7)
on conflict (id) do update set
  season_en   = excluded.season_en,
  season_ka   = excluded.season_ka,
  round       = excluded.round,
  role        = excluded.role,
  slot_x      = excluded.slot_x,
  slot_y      = excluded.slot_y,
  player_name = excluded.player_name,
  crest_url   = excluded.crest_url,
  is_captain  = excluded.is_captain,
  is_bench    = excluded.is_bench,
  sort_order  = excluded.sort_order;

-- Five empty places. The nominees are announced before each round, so the
-- admin fills in the names and pictures then.
insert into vote_candidates (id, name, club_id, round, is_open, photo_url, logo_url, sort_order)
values
  ('cand-1', null, null, '', true, null, null, 1),
  ('cand-2', null, null, '', true, null, null, 2),
  ('cand-3', null, null, '', true, null, null, 3),
  ('cand-4', null, null, '', true, null, null, 4),
  ('cand-5', null, null, '', true, null, null, 5)
on conflict (id) do nothing;
