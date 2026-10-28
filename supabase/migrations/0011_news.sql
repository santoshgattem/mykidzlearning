-- "Be inspired" slides on the home page: real results from past years, each with a source link.
-- Managed by admins. Read on the server only (the home page), so RLS is on with no policies.
create table public.news_items (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique,                                          -- stable id for items loaded from content/news.mjs
  category    text not null check (category in ('jee', 'cbse', 'neet', 'other')),
  year        smallint not null check (year between 1990 and 2100),
  headline    text not null check (char_length(headline) <= 60),    -- the big line, e.g. "332 / 360"
  title       text not null check (char_length(title) <= 120),
  body        text not null default '' check (char_length(body) <= 400),
  source_name text not null check (char_length(source_name) <= 80),
  source_url  text not null check (source_url ~* '^https?://'),
  published   boolean not null default true,
  position    smallint not null default 100,                        -- lower comes first
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index news_items_order_idx on public.news_items (published, position, year desc);
alter table public.news_items enable row level security;
