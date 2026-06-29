-- 04_security_hardening.sql
-- Addresses the Supabase Security Advisor warnings flagged after the
-- admin dashboard went live. Four classes of fix:
--
--   1. SECURITY DEFINER functions had a mutable search_path. A
--      malicious caller could redirect schema references. Locked down
--      to public, pg_temp.
--   2. The same functions were callable via PostgREST RPC by anyone
--      (e.g. /rest/v1/rpc/handle_new_user). Revoked EXECUTE from anon
--      everywhere; kept EXECUTE on is_admin() for the authenticated
--      role because RLS admin-policies depend on it.
--   3. RLS INSERT policies on orders + enquiries used WITH CHECK (true).
--      Replaced with field-presence constraints — still allows anonymous
--      insert with a valid payload, just rejects empty/garbage rows.
--   4. menu-images storage bucket had an explicit SELECT (LIST) policy
--      on storage.objects. Dropped it. The bucket is still public, so
--      /storage/v1/object/public/menu-images/<file> URLs continue to
--      load; only the LIST endpoint is no longer exposed.
--
-- Safe to re-run; uses alter / drop+create.

-- ─────────────────────────────────────────────────────────────────────
-- 1. Lock search_path on every SECURITY DEFINER function we own.
-- ─────────────────────────────────────────────────────────────────────
alter function public.touch_updated_at() set search_path = public, pg_temp;
alter function public.is_admin()         set search_path = public, pg_temp;
alter function public.handle_new_user()  set search_path = public, pg_temp;

-- ─────────────────────────────────────────────────────────────────────
-- 2. Revoke direct RPC access where it isn't needed.
-- ─────────────────────────────────────────────────────────────────────

-- touch_updated_at fires only as a BEFORE UPDATE trigger; nothing needs
-- to call it directly via the REST API.
revoke execute on function public.touch_updated_at() from public, anon, authenticated;

-- handle_new_user fires from the on_auth_user_created trigger. Triggers
-- bypass EXECUTE grants (they invoke the function via the trigger system,
-- not via a CALL), so this revocation is safe — profiles still auto-create.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- is_admin is called from RLS policies. It MUST stay callable by the
-- authenticated role (otherwise admin reads/writes via the dashboard
-- evaluate the policy as false and silently break). Revoking from anon
-- removes the unnecessary anonymous RPC surface.
revoke execute on function public.is_admin() from public, anon;

-- ─────────────────────────────────────────────────────────────────────
-- 3. Tighten WITH CHECK on anonymous-insert policies so they're not
--    flagged as "always true". Still permits guest orders + enquiries;
--    just requires the basic fields to be present and the order total
--    to be positive.
-- ─────────────────────────────────────────────────────────────────────

drop policy if exists "orders insertable by anyone" on public.orders;
create policy "orders insertable by anyone" on public.orders
  for insert with check (
    length(coalesce(customer_name, '')) > 0
    and length(coalesce(customer_phone, '')) > 0
    and total > 0
    and items is not null
    and delivery_address is not null
  );

drop policy if exists "enquiries insertable" on public.enquiries;
create policy "enquiries insertable" on public.enquiries
  for insert with check (
    length(coalesce(name, '')) > 0
    and length(coalesce(phone, '')) > 0
    and length(coalesce(message, '')) > 0
  );

-- ─────────────────────────────────────────────────────────────────────
-- 4. Remove the broad menu-images SELECT policy. The bucket itself is
--    public (set in 02_admin.sql), so any /storage/v1/object/public/
--    menu-images/<file> URL still works without auth — we just don't
--    expose the LIST endpoint that lets an attacker enumerate every
--    uploaded photo. The admin write policies stay so Bindeshwar can
--    keep uploading.
-- ─────────────────────────────────────────────────────────────────────
drop policy if exists "menu-images public read" on storage.objects;
