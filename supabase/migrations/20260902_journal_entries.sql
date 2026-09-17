-- Journal entries for Manon's voyage
create table if not exists journal_entries (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  etape_id integer,
  texte text,
  humeur text check (humeur in ('soleil','nuage','pluie','orage','arc-en-ciel')),
  photos text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for date lookups
create index if not exists idx_journal_date on journal_entries(date);

-- RLS disabled (private page, no auth)
alter table journal_entries enable row level security;
create policy "allow_all" on journal_entries for all using (true) with check (true);
