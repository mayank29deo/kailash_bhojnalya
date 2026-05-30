import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getSupabase } from '../lib/supabase.js';

// Centralised auth state for the admin flow. Customer-side flows (cart,
// checkout, WhatsApp) never read this — they're anonymous.
//
// Exposes:
//   { user, profile, loading, isAdmin, signIn, signOut, refreshProfile }
//
// `profile` is the row from public.profiles for the current user (joined
// to is_admin). The route guard checks `isAdmin` before letting users
// reach any /admin/* page.

const AuthContext = createContext(null);

async function loadProfile(supabase, userId) {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, phone, is_admin')
    .eq('id', userId)
    .maybeSingle();
  if (error) {
    console.warn('[auth] profile fetch failed', error.message);
    return null;
  }
  return data;
}

export function AuthProvider({ children }) {
  const supabase = getSupabase();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(Boolean(supabase));

  // 1. Bootstrap from any persisted session, then subscribe to changes.
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      const sessionUser = data?.session?.user ?? null;
      setUser(sessionUser);
      if (sessionUser) {
        const p = await loadProfile(supabase, sessionUser.id);
        if (active) setProfile(p);
      }
      if (active) setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      const p = sessionUser ? await loadProfile(supabase, sessionUser.id) : null;
      setProfile(p);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = useCallback(
    async ({ email, password }) => {
      if (!supabase) return { ok: false, error: 'Supabase is not configured.' };

      // Pre-emptively clear any persisted/in-memory session before
      // signing in. Without this, a browser that previously held a
      // session whose access was invalidated (e.g. RLS policies were
      // changed under it) hangs forever in supabase.auth on a silent
      // token refresh attempt — the spinner stays on "Signing in…"
      // and nothing surfaces. scope:'local' skips the server round-trip.
      try {
        await supabase.auth.signOut({ scope: 'local' });
      } catch {
        /* swallow — proceed with the fresh sign-in regardless */
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) return { ok: false, error: error.message };
      // The onAuthStateChange listener will pick up user + profile.
      return { ok: true, userId: data.user?.id };
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (!supabase || !user) return null;
    const p = await loadProfile(supabase, user.id);
    setProfile(p);
    return p;
  }, [supabase, user]);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isAdmin: Boolean(profile?.is_admin),
      isSupabaseReady: Boolean(supabase),
      signIn,
      signOut,
      refreshProfile,
    }),
    [user, profile, loading, supabase, signIn, signOut, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}
