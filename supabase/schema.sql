-- Kailash Bhojnalaya — Supabase schema bootstrap
-- Run this in Supabase SQL editor once the project is created.
-- The app degrades gracefully if these tables don't exist yet.

create extension if not exists "pgcrypto";

-- 1. Menu categories ----------------------------------------------------------
create table if not exists public.menu_categories (
  id           text primary key,           -- e.g. 'thali', 'paneer'
  name         text not null,
  tagline      text,
  icon         text,
  accent       text,
  sort_order   int not null default 0,
  is_featured  boolean not null default false,
  created_at   timestamptz not null default now()
);

-- 2. Menu items ---------------------------------------------------------------
create table if not exists public.menu_items (
  id           text primary key,
  category_id  text not null references public.menu_categories(id) on delete cascade,
  name         text not null,
  description  text,
  price        text not null,              -- display string (₹240 / ₹20–25)
  price_num    int,                        -- numeric anchor for sorting
  tags         text[] default '{}',
  is_active    boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);
create index if not exists menu_items_category_idx on public.menu_items(category_id);

-- 3. Reviews / testimonials ---------------------------------------------------
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  location    text,
  rating      int not null check (rating between 1 and 5),
  text        text not null,
  is_pinned   boolean not null default false,
  created_at  timestamptz not null default now()
);

-- 4. Enquiries (contact form / catering requests) -----------------------------
create table if not exists public.enquiries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text not null,
  message     text not null,
  occasion    text,
  created_at  timestamptz not null default now()
);

-- 5. Row Level Security -------------------------------------------------------
-- Public can read menu + reviews; only authenticated owners write.
-- Anonymous users may insert enquiries but never read them.

alter table public.menu_categories enable row level security;
alter table public.menu_items      enable row level security;
alter table public.reviews         enable row level security;
alter table public.enquiries       enable row level security;

create policy if not exists "menu_categories readable" on public.menu_categories
  for select using (true);

create policy if not exists "menu_items readable" on public.menu_items
  for select using (is_active = true);

create policy if not exists "reviews readable" on public.reviews
  for select using (true);

create policy if not exists "enquiries insertable" on public.enquiries
  for insert with check (true);
