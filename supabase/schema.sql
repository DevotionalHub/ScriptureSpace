-- Scripture Space starter schema
-- Run this once in Supabase SQL Editor. The publishable key is safe in the browser;
-- keep service-role keys server-side and never put them in VITE_ environment variables.

create extension if not exists pgcrypto;

create table if not exists public.visit_logs (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  path text not null default '/',
  page text not null default 'Home',
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists visit_logs_created_at_idx on public.visit_logs (created_at desc);

alter table public.visit_logs enable row level security;

drop policy if exists "Anyone can log a visit" on public.visit_logs;
create policy "Anyone can log a visit"
  on public.visit_logs for insert
  to anon, authenticated
  with check (length(visitor_id) > 0 and length(path) > 0);

drop policy if exists "Only the site steward can read visits" on public.visit_logs;
create policy "Only the site steward can read visits"
  on public.visit_logs for select
  to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'sixtusonoriode2@gmail.com');

create table if not exists public.communities (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 3 and 80),
  description text not null check (char_length(description) between 10 and 500),
  topic text,
  created_by uuid references auth.users(id) on delete set null,
  member_count integer not null default 1 check (member_count >= 0),
  created_at timestamptz not null default now()
);

alter table public.communities enable row level security;

drop policy if exists "Communities are visible to everyone" on public.communities;
create policy "Communities are visible to everyone"
  on public.communities for select
  to anon, authenticated
  using (true);

drop policy if exists "Signed-in readers can create communities" on public.communities;
create policy "Signed-in readers can create communities"
  on public.communities for insert
  to authenticated
  with check (created_by = auth.uid());

drop policy if exists "Owners can update their communities" on public.communities;
create policy "Owners can update their communities"
  on public.communities for update
  to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

create table if not exists public.saved_verses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reference text not null,
  note text,
  created_at timestamptz not null default now(),
  unique(user_id, reference)
);

alter table public.saved_verses enable row level security;
drop policy if exists "Readers manage their saved verses" on public.saved_verses;
create policy "Readers manage their saved verses"
  on public.saved_verses for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create table if not exists public.reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled reflection',
  body text not null default '',
  reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.reflections enable row level security;
drop policy if exists "Readers manage their private reflections" on public.reflections;
create policy "Readers manage their private reflections"
  on public.reflections for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
