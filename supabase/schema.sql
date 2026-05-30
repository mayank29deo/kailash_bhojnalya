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

-- 5. Profiles (linked to Supabase Auth) ---------------------------------------
-- Holds Google sign-in details + the customer's preferred phone for orders.
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  phone       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 6. Saved delivery addresses -------------------------------------------------
create table if not exists public.user_addresses (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  label           text,                          -- 'Home', 'Office', etc.
  recipient_name  text,
  phone           text,
  line1           text not null,
  line2           text,
  landmark        text,
  city            text not null default 'Deoghar',
  state           text not null default 'Jharkhand',
  pincode         text not null,
  is_default      boolean not null default false,
  created_at      timestamptz not null default now()
);
create index if not exists user_addresses_user_idx on public.user_addresses(user_id);

-- 7. Orders -------------------------------------------------------------------
-- user_id is nullable so guests (Phase 1, no auth) can also order. The
-- delivery_address and items are denormalised so an order remains intact
-- if profile/menu data later changes.
create table if not exists public.orders (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid references auth.users(id) on delete set null,
  customer_name         text not null,
  customer_phone        text not null,
  customer_email        text,
  delivery_address      jsonb not null,
  items                 jsonb not null,
  subtotal              int not null,
  packaging_fee         int not null default 0,
  gst_amount            int not null default 0,
  total                 int not null,
  payment_method        text not null default 'cod',
  status                text not null default 'pending',
                        -- pending | confirmed | preparing | out_for_delivery | delivered | cancelled
  special_instructions  text,
  whatsapp_sent_at      timestamptz,
  created_at            timestamptz not null default now()
);
create index if not exists orders_user_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_idx on public.orders(created_at desc);

-- 8. Row Level Security -------------------------------------------------------
alter table public.menu_categories enable row level security;
alter table public.menu_items      enable row level security;
alter table public.reviews         enable row level security;
alter table public.enquiries       enable row level security;
alter table public.profiles        enable row level security;
alter table public.user_addresses  enable row level security;
alter table public.orders          enable row level security;

-- PostgreSQL does NOT support CREATE POLICY IF NOT EXISTS, so each policy
-- is dropped (no-op if absent) and recreated. Safe to re-run the file.

drop policy if exists "menu_categories readable" on public.menu_categories;
create policy "menu_categories readable" on public.menu_categories
  for select using (true);

drop policy if exists "menu_items readable" on public.menu_items;
create policy "menu_items readable" on public.menu_items
  for select using (is_active = true);

drop policy if exists "reviews readable" on public.reviews;
create policy "reviews readable" on public.reviews
  for select using (true);

drop policy if exists "enquiries insertable" on public.enquiries;
create policy "enquiries insertable" on public.enquiries
  for insert with check (true);

-- Profiles: each user can read & update only their own row
drop policy if exists "profiles self-readable" on public.profiles;
create policy "profiles self-readable" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles self-writable" on public.profiles;
create policy "profiles self-writable" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles self-updatable" on public.profiles;
create policy "profiles self-updatable" on public.profiles
  for update using (auth.uid() = id);

-- Addresses: each user can CRUD only their own
drop policy if exists "addresses self-readable" on public.user_addresses;
create policy "addresses self-readable" on public.user_addresses
  for select using (auth.uid() = user_id);

drop policy if exists "addresses self-writable" on public.user_addresses;
create policy "addresses self-writable" on public.user_addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Orders: anyone (incl. anon) can place an order.
-- Reads are restricted: customer can read own orders; owner via service role.
drop policy if exists "orders insertable by anyone" on public.orders;
create policy "orders insertable by anyone" on public.orders
  for insert with check (true);

drop policy if exists "orders readable by owner of order" on public.orders;
create policy "orders readable by owner of order" on public.orders
  for select using (auth.uid() = user_id);
