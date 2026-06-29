-- 05_restore_is_admin_anon_execute.sql
-- Restores EXECUTE on public.is_admin() to anon + authenticated.
--
-- 04_security_hardening.sql revoked EXECUTE from anon to satisfy the
-- Supabase Security Advisor's "Public can execute SECURITY DEFINER
-- function" warning. That broke anonymous checkout: PostgREST's
-- INSERT...RETURNING flow runs a SELECT on the inserted row to
-- return its id, which evaluates every SELECT RLS policy on orders,
-- including "orders admin read" which calls is_admin(). Without
-- EXECUTE, the call throws "permission denied for function is_admin"
-- and the entire INSERT 403s. The customer's WhatsApp send never
-- fires; the "Sending…" button hangs.
--
-- is_admin() is functionally harmless to anon — for any caller whose
-- auth.uid() doesn't match an admin profile row (i.e. every anon
-- caller), the function returns false. The lint warning is therefore
-- a false positive in our usage; we accept it in exchange for
-- working checkout.
--
-- touch_updated_at and handle_new_user keep their revocations from
-- 04_security_hardening.sql — those run only via triggers and have
-- no legitimate caller in the customer flow.

grant execute on function public.is_admin() to anon;
grant execute on function public.is_admin() to authenticated;
