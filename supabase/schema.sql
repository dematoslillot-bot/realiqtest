-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/eexqgevlakrxtxvxgdst/sql

create table if not exists public.scores (
  id         uuid primary key default gen_random_uuid(),
  country    text not null default '',
  score      integer not null,
  created_at timestamptz not null default now()
);

-- Index for fast leaderboard queries
create index if not exists scores_score_desc on public.scores (score desc);

-- Allow anyone to insert their score
create policy "Anyone can insert"
  on public.scores for insert
  to anon
  with check (true);

-- Allow anyone to read leaderboard
create policy "Anyone can read"
  on public.scores for select
  to anon
  using (true);

-- Enable RLS
alter table public.scores enable row level security;
