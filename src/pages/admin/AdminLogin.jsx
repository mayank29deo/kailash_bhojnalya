import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, AlertCircle, Loader2, ChefHat } from 'lucide-react';
import { useAuth } from '../../state/AuthContext.jsx';

// Email + password login for Bindeshwar. The first admin user is
// bootstrapped manually in Supabase Dashboard (Authentication → Users +
// Table Editor → profiles → is_admin=true). Self-signup is intentionally
// disabled to avoid random users creating accounts.

export default function AdminLogin() {
  const { user, profile, loading, isAdmin, isSupabaseReady, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  // If already authed AND admin, jump straight to the dashboard.
  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate(from, { replace: true });
    }
  }, [loading, user, isAdmin, from, navigate]);

  if (!isSupabaseReady) {
    return (
      <section className="section flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl border border-leaf-200 bg-white p-8 text-center shadow-soft">
          <h1 className="heading-display text-2xl">Admin login unavailable</h1>
          <p className="mt-2 text-sm text-leaf-700/85">
            Supabase env vars are missing. Set <code>VITE_SUPABASE_URL</code> and
            <code>VITE_SUPABASE_ANON_KEY</code> and redeploy.
          </p>
        </div>
      </section>
    );
  }

  // Authed but not admin — show a polite rejection rather than a redirect loop.
  if (!loading && user && !isAdmin) {
    return <NotAdminMessage />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    setBusy(true);
    const result = await signIn({ email, password });
    setBusy(false);
    if (!result.ok) {
      setError(result.error || 'Could not sign in.');
      return;
    }
    // The AuthProvider's onAuthStateChange will load the profile and trigger
    // the useEffect above to navigate.
  };

  return (
    <section className="section flex min-h-[80vh] items-center justify-center py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="rounded-3xl border border-leaf-200/70 bg-white/90 p-8 shadow-soft backdrop-blur sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-700">
            <ChefHat className="h-7 w-7" />
          </div>
          <h1 className="heading-display mt-5 text-center text-2xl">Owner login</h1>
          <p className="mt-2 text-center text-sm text-leaf-700/85">
            Sign in to manage the menu and orders.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <Field
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
            <Field
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            {error && (
              <div className="flex items-start gap-2 rounded-2xl bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={busy} className="btn-primary w-full !py-3.5">
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Sign in
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] text-leaf-600/80">
            Forgot your password? Ask Mayank to send a reset link from Supabase.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

function Field({ label, name, ...rest }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-leaf-700">{label}</span>
      <input
        id={name}
        name={name}
        {...rest}
        className="mt-1.5 w-full rounded-2xl border border-leaf-200 bg-white px-4 py-3 text-sm text-leaf-900 outline-none transition-colors focus:border-leaf-400"
      />
    </label>
  );
}

function NotAdminMessage() {
  const { signOut } = useAuth();
  return (
    <section className="section flex min-h-[60vh] items-center justify-center py-14">
      <div className="max-w-md rounded-3xl border border-leaf-200 bg-white p-8 text-center shadow-soft">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h1 className="heading-display mt-4 text-xl">This account isn't an admin</h1>
        <p className="mt-2 text-sm text-leaf-700/85">
          Your email signed in, but the <code>is_admin</code> flag isn't set on your profile.
          Ask the project owner to promote your account.
        </p>
        <button type="button" onClick={signOut} className="btn-ghost mt-6">
          Sign out
        </button>
      </div>
    </section>
  );
}
