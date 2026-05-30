import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Receipt,
  UtensilsCrossed,
  Wallet,
  Activity,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../state/AuthContext.jsx';
import { fetchOverviewStats, listOrders } from '../../services/adminService.js';

function rupee(n) {
  return `₹${(n || 0).toLocaleString('en-IN')}`;
}

const STATUS_LABEL = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const STATUS_COLOR = {
  pending: 'bg-spice-400/20 text-spice-700',
  confirmed: 'bg-leaf-100 text-leaf-800',
  preparing: 'bg-leaf-200 text-leaf-900',
  out_for_delivery: 'bg-blue-100 text-blue-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminHome() {
  const { profile } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [s, r] = await Promise.all([
          fetchOverviewStats(),
          listOrders({ limit: 8 }),
        ]);
        if (active) {
          setStats(s);
          setRecent(r);
        }
      } catch (e) {
        if (active) setError(e.message);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const firstName = (profile?.full_name || profile?.email || 'there').split(/[ @.]/)[0];

  return (
    <section className="section py-10 lg:py-14">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="font-script text-leaf-600">{greeting},</p>
        <h1 className="heading-display text-3xl capitalize sm:text-4xl">{firstName}.</h1>
        <p className="mt-2 text-sm text-leaf-700/85">
          Quick snapshot of today's orders and what's pending.
        </p>
      </motion.header>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Couldn't load stats — {error}
        </div>
      )}

      {/* KPI tiles */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile
          icon={Receipt}
          label="Orders today"
          value={stats?.todayCount ?? '—'}
          accent="leaf"
        />
        <KpiTile
          icon={Wallet}
          label="Revenue today"
          value={stats ? rupee(stats.todayRevenue) : '—'}
          accent="leaf"
        />
        <KpiTile
          icon={Clock}
          label="Pending confirmation"
          value={stats?.statusCounts?.pending ?? '—'}
          accent="spice"
        />
        <KpiTile
          icon={Activity}
          label="All-time orders"
          value={stats?.totalCount ?? '—'}
          accent="leaf"
        />
      </div>

      {/* Recent orders + shortcuts */}
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-leaf-100 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-leaf-900">
              Latest orders
            </h2>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-semibold text-leaf-700 hover:text-leaf-900"
            >
              All orders
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="mt-6 text-sm text-leaf-600">No orders yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-leaf-100">
              {recent.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-leaf-900">
                      {o.customer_name}
                    </p>
                    <p className="text-xs text-leaf-600">
                      {new Date(o.created_at).toLocaleString('en-IN', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}{' '}
                      · {(o.items || []).length} item{(o.items || []).length === 1 ? '' : 's'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        STATUS_COLOR[o.status] || 'bg-leaf-100 text-leaf-700'
                      }`}
                    >
                      {STATUS_LABEL[o.status] || o.status}
                    </span>
                    <span className="shrink-0 font-display text-sm font-bold text-leaf-900">
                      {rupee(o.total)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-3">
          <Shortcut
            to="/admin/orders"
            icon={Receipt}
            title="Manage orders"
            body="Change order status, see customer details."
          />
          <Shortcut
            to="/admin/menu"
            icon={UtensilsCrossed}
            title="Edit menu"
            body="Update prices, upload photos, add items."
          />
          <Shortcut
            to="/"
            external
            icon={ExternalLink}
            title="View the public site"
            body="See what customers see right now."
          />
        </div>
      </div>
    </section>
  );
}

function KpiTile({ icon: Icon, label, value, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-leaf-100 bg-white p-5 shadow-soft"
    >
      <div className="flex items-center gap-2">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            accent === 'spice' ? 'bg-spice-400/20 text-spice-700' : 'bg-leaf-100 text-leaf-700'
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-xs font-medium uppercase tracking-wider text-leaf-600">{label}</p>
      </div>
      <p className="mt-3 font-display text-3xl font-bold text-leaf-900">{value}</p>
    </motion.div>
  );
}

function Shortcut({ to, icon: Icon, title, body, external }) {
  const Cmp = external ? 'a' : Link;
  const extraProps = external ? { href: to, target: '_blank', rel: 'noopener noreferrer' } : { to };
  return (
    <Cmp
      {...extraProps}
      className="group flex items-start gap-3 rounded-2xl border border-leaf-100 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-leaf-300"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="font-display font-semibold text-leaf-900">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-leaf-600">{body}</p>
      </div>
    </Cmp>
  );
}
