-- The two buckets the site writes to, and who may touch them.
--
-- registrations: crests and player photos that come in with an entry. Anyone
--   may add to it, because entries are submitted without an account.
-- media: pictures the admin uploads for the squad, the nominees, tournaments,
--   events and articles. Readable by everyone, writable only when signed in.

insert into storage.buckets (id, name, public)
values ('registrations', 'registrations', true),
       ('media', 'media', true)
on conflict (id) do nothing;

create policy "public upload registrations" on storage.objects
  for insert to anon with check (bucket_id = 'registrations');
create policy "public read registrations" on storage.objects
  for select using (bucket_id = 'registrations');

create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');
create policy "admin write media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');
create policy "admin replace media" on storage.objects
  for update to authenticated using (bucket_id = 'media');
create policy "admin remove media" on storage.objects
  for delete to authenticated using (bucket_id = 'media');
