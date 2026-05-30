-- 03_orders_insert_fix.sql
-- Idempotent re-apply of every RLS policy from schema.sql.
--
-- Background: the original bootstrap of schema.sql used
-- "create policy if not exists ..." which Postgres does not support;
-- the syntax error stopped the policies block from running, leaving
-- several policies missing on a live project. Symptoms:
--   1. Anonymous customers got "row-level security policy violated"
--      when checkout tried to insert into public.orders. Orders went
--      to WhatsApp but never reached the database.
--   2. The admin login authenticated successfully but couldn't read
--      its own profile row to confirm is_admin, so the route guard
--      kept bouncing back to /admin/login.
--
-- Fix: re-create every customer-facing policy via drop+create so each
-- statement is self-contained and re-runnable. Same blocks as the
-- (now-fixed) schema.sql so running both is harmless.

-- Menu (public read) ─────────────────────────────────────────────────
drop policy if exists "menu_categories readable" on public.menu_categories;
create policy "menu_categories readable" on public.menu_categories
  for select using (true);

drop policy if exists "menu_items readable" on public.menu_items;
create policy "menu_items readable" on public.menu_items
  for select using (is_active = true);

-- Reviews (public read) ──────────────────────────────────────────────
drop policy if exists "reviews readable" on public.reviews;
create policy "reviews readable" on public.reviews
  for select using (true);

-- Enquiries (anon insert) ────────────────────────────────────────────
drop policy if exists "enquiries insertable" on public.enquiries;
create policy "enquiries insertable" on public.enquiries
  for insert with check (true);

-- Profiles — each authed user reads & writes only their own row ──────
drop policy if exists "profiles self-readable" on public.profiles;
create policy "profiles self-readable" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles self-writable" on public.profiles;
create policy "profiles self-writable" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles self-updatable" on public.profiles;
create policy "profiles self-updatable" on public.profiles
  for update using (auth.uid() = id);

-- Saved delivery addresses — owner-scoped CRUD ──────────────────────
drop policy if exists "addresses self-readable" on public.user_addresses;
create policy "addresses self-readable" on public.user_addresses
  for select using (auth.uid() = user_id);

drop policy if exists "addresses self-writable" on public.user_addresses;
create policy "addresses self-writable" on public.user_addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Orders — anonymous insert, customer reads own ─────────────────────
drop policy if exists "orders insertable by anyone" on public.orders;
create policy "orders insertable by anyone" on public.orders
  for insert with check (true);

drop policy if exists "orders readable by owner of order" on public.orders;
create policy "orders readable by owner of order" on public.orders
  for select using (auth.uid() = user_id);
