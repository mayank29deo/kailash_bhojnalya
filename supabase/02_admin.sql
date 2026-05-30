-- 02_admin.sql — Admin dashboard migration
-- Run AFTER schema.sql. Adds the owner role, menu image/featured fields,
-- profile auto-create on signup, admin-scoped RLS policies, and a public
-- Storage bucket for dish photo uploads. Idempotent — safe to re-run.

-- ─────────────────────────────────────────────────────────────────────
-- 1. New columns on menu tables
-- ─────────────────────────────────────────────────────────────────────
alter table public.menu_items
  add column if not exists image_url text,
  add column if not exists is_featured boolean not null default false,
  add column if not exists updated_at timestamptz not null default now();

alter table public.menu_categories
  add column if not exists updated_at timestamptz not null default now();

-- Auto-update updated_at on every row change
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists touch_menu_items on public.menu_items;
create trigger touch_menu_items
  before update on public.menu_items
  for each row execute function public.touch_updated_at();

drop trigger if exists touch_menu_categories on public.menu_categories;
create trigger touch_menu_categories
  before update on public.menu_categories
  for each row execute function public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────
-- 2. Owner / admin flag on profiles + helper
-- ─────────────────────────────────────────────────────────────────────
alter table public.profiles
  add column if not exists is_admin boolean not null default false;

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$;

-- ─────────────────────────────────────────────────────────────────────
-- 3. Auto-create a profile row on auth signup
--    so any new Supabase Auth user has a profile to flag as admin.
-- ─────────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────
-- 4. Admin-scoped RLS policies
--    Public read policies from schema.sql stay intact; these are
--    additive — admins can also write to menus, read all orders, etc.
-- ─────────────────────────────────────────────────────────────────────

-- menu_items: admin can insert/update/delete
drop policy if exists "menu_items admin insert" on public.menu_items;
create policy "menu_items admin insert" on public.menu_items
  for insert with check (public.is_admin());

drop policy if exists "menu_items admin update" on public.menu_items;
create policy "menu_items admin update" on public.menu_items
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "menu_items admin delete" on public.menu_items;
create policy "menu_items admin delete" on public.menu_items
  for delete using (public.is_admin());

-- menu_categories: admin can insert/update/delete
drop policy if exists "menu_categories admin insert" on public.menu_categories;
create policy "menu_categories admin insert" on public.menu_categories
  for insert with check (public.is_admin());

drop policy if exists "menu_categories admin update" on public.menu_categories;
create policy "menu_categories admin update" on public.menu_categories
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "menu_categories admin delete" on public.menu_categories;
create policy "menu_categories admin delete" on public.menu_categories
  for delete using (public.is_admin());

-- orders: admin can read everything + change status
drop policy if exists "orders admin read" on public.orders;
create policy "orders admin read" on public.orders
  for select using (public.is_admin());

drop policy if exists "orders admin update" on public.orders;
create policy "orders admin update" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

-- reviews + enquiries: admin can read all and seed reviews
drop policy if exists "reviews admin write" on public.reviews;
create policy "reviews admin write" on public.reviews
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "enquiries admin read" on public.enquiries;
create policy "enquiries admin read" on public.enquiries
  for select using (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────
-- 5. Storage: public 'menu-images' bucket for dish photo uploads
-- ─────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;

drop policy if exists "menu-images public read" on storage.objects;
create policy "menu-images public read" on storage.objects
  for select using (bucket_id = 'menu-images');

drop policy if exists "menu-images admin write" on storage.objects;
create policy "menu-images admin write" on storage.objects
  for insert with check (bucket_id = 'menu-images' and public.is_admin());

drop policy if exists "menu-images admin update" on storage.objects;
create policy "menu-images admin update" on storage.objects
  for update using (bucket_id = 'menu-images' and public.is_admin());

drop policy if exists "menu-images admin delete" on storage.objects;
create policy "menu-images admin delete" on storage.objects
  for delete using (bucket_id = 'menu-images' and public.is_admin());
