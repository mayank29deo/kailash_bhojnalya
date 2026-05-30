import { createClient } from '@supabase/supabase-js';

// The client is created lazily so the app still renders if env vars are
// missing in early dev. Components calling DAL functions will see a clear
// console warning rather than a hard crash.

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let _client = null;

export function getSupabase() {
  if (_client) return _client;
  if (!url || !anonKey || url.includes('YOUR-PROJECT')) {
    if (typeof window !== 'undefined') {
      console.warn(
        '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing — using local fallbacks. Copy .env.example to .env to enable.'
      );
    }
    return null;
  }
  _client = createClient(url, anonKey, {
    auth: {
      // Persist admin sessions across page reloads so Bindeshwar stays
      // logged in. Customer flow doesn't auth, so this is a no-op for
      // anonymous users.
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'kb-auth',
    },
  });
  return _client;
}

export const isSupabaseConfigured = () => Boolean(getSupabase());
