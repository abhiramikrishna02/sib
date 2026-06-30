create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table if not exists public.colleges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

alter table public.universities
  add column if not exists slug text,
  add column if not exists about text,
  add column if not exists logo_url text,
  add column if not exists image_url text,
  add column if not exists images jsonb default '[]'::jsonb,
  add column if not exists rating text,
  add column if not exists location text,
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists address text,
  add column if not exists document_url text,
  add column if not exists document_name text,
  add column if not exists document_type text;

alter table public.colleges
  add column if not exists slug text,
  add column if not exists university_id uuid references public.universities(id) on delete set null,
  add column if not exists image_url text,
  add column if not exists images jsonb default '[]'::jsonb,
  add column if not exists rating text,
  add column if not exists location text,
  add column if not exists about text,
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists address text,
  add column if not exists fee_range text,
  add column if not exists fee_from text,
  add column if not exists fee_to text,
  add column if not exists type text,
  add column if not exists levels text,
  add column if not exists duration text,
  add column if not exists mode text default 'Offline',
  add column if not exists document_url text,
  add column if not exists document_name text,
  add column if not exists document_type text;

alter table public.courses
  add column if not exists slug text,
  add column if not exists college_id uuid references public.colleges(id) on delete set null,
  add column if not exists image_url text,
  add column if not exists images jsonb default '[]'::jsonb,
  add column if not exists rating text,
  add column if not exists location text,
  add column if not exists about text,
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists fee_range text,
  add column if not exists fee_from text,
  add column if not exists fee_to text,
  add column if not exists type text,
  add column if not exists levels text,
  add column if not exists degree text,
  add column if not exists level text,
  add column if not exists affiliation text,
  add column if not exists category text,
  add column if not exists duration text,
  add column if not exists mode text default 'Offline',
  add column if not exists document_url text,
  add column if not exists document_name text,
  add column if not exists document_type text;

alter table public.universities enable row level security;
alter table public.colleges enable row level security;
alter table public.courses enable row level security;

update public.universities
set slug = regexp_replace(lower(coalesce(name, id::text)), '[^a-z0-9]+', '-', 'g')
where slug is null or slug = '';

update public.colleges
set slug = regexp_replace(lower(coalesce(name, id::text)), '[^a-z0-9]+', '-', 'g')
where slug is null or slug = '';

update public.courses
set slug = regexp_replace(lower(coalesce(name, id::text)), '[^a-z0-9]+', '-', 'g')
where slug is null or slug = '';

alter table public.universities alter column slug set default gen_random_uuid()::text;
alter table public.colleges alter column slug set default gen_random_uuid()::text;
alter table public.courses alter column slug set default gen_random_uuid()::text;

alter table public.universities alter column id set default gen_random_uuid();
alter table public.colleges alter column id set default gen_random_uuid();
alter table public.courses alter column id set default gen_random_uuid();

-- Existing projects may already have extra NOT NULL columns that this dashboard
-- does not collect, such as owner_id/admin_id/user_id. Those columns block
-- inserts from the form with errors like invalid uuid syntax for "" or null
-- value violates not-null constraint. Keep only id/name required for dashboard
-- publishing; optional metadata can be filled later.
do $$
declare
  column_record record;
begin
  for column_record in
    select table_name, column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name in ('universities', 'colleges', 'courses')
      and is_nullable = 'NO'
      and column_name not in ('id', 'name')
  loop
    execute format(
      'alter table public.%I alter column %I drop not null',
      column_record.table_name,
      column_record.column_name
    );
  end loop;
end $$;

drop policy if exists "public read universities" on public.universities;
drop policy if exists "public write universities" on public.universities;
drop policy if exists "public update universities" on public.universities;
drop policy if exists "public delete universities" on public.universities;

drop policy if exists "public read colleges" on public.colleges;
drop policy if exists "public write colleges" on public.colleges;
drop policy if exists "public update colleges" on public.colleges;
drop policy if exists "public delete colleges" on public.colleges;

drop policy if exists "public read courses" on public.courses;
drop policy if exists "public write courses" on public.courses;
drop policy if exists "public update courses" on public.courses;
drop policy if exists "public delete courses" on public.courses;

create policy "public read universities" on public.universities
  for select to anon, authenticated using (true);
create policy "public write universities" on public.universities
  for insert to anon, authenticated with check (true);
create policy "public update universities" on public.universities
  for update to anon, authenticated using (true) with check (true);
create policy "public delete universities" on public.universities
  for delete to anon, authenticated using (true);

create policy "public read colleges" on public.colleges
  for select to anon, authenticated using (true);
create policy "public write colleges" on public.colleges
  for insert to anon, authenticated with check (true);
create policy "public update colleges" on public.colleges
  for update to anon, authenticated using (true) with check (true);
create policy "public delete colleges" on public.colleges
  for delete to anon, authenticated using (true);

create policy "public read courses" on public.courses
  for select to anon, authenticated using (true);
create policy "public write courses" on public.courses
  for insert to anon, authenticated with check (true);
create policy "public update courses" on public.courses
  for update to anon, authenticated using (true) with check (true);
create policy "public delete courses" on public.courses
  for delete to anon, authenticated using (true);

insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public read documents" on storage.objects;
drop policy if exists "public upload documents" on storage.objects;
drop policy if exists "public update documents" on storage.objects;
drop policy if exists "public delete documents" on storage.objects;
drop policy if exists "public read media" on storage.objects;
drop policy if exists "public upload media" on storage.objects;
drop policy if exists "public update media" on storage.objects;
drop policy if exists "public delete media" on storage.objects;

create policy "public read documents" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'documents');
create policy "public upload documents" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'documents');
create policy "public update documents" on storage.objects
  for update to anon, authenticated
  using (bucket_id = 'documents')
  with check (bucket_id = 'documents');
create policy "public delete documents" on storage.objects
  for delete to anon, authenticated
  using (bucket_id = 'documents');

create policy "public read media" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'media');
create policy "public upload media" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'media');
create policy "public update media" on storage.objects
  for update to anon, authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');
create policy "public delete media" on storage.objects
  for delete to anon, authenticated
  using (bucket_id = 'media');
