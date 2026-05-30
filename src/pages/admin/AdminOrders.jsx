import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Search,
  Phone,
  MapPin,
  StickyNote,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { listOrders, updateOrderStatus } from '../../services/adminService.js';

function rupee(n) {
  return `₹${(n || 0).toLocaleString('en-IN')}`;
}

const STATUSES = [
  { value: 'pending', label: 'Pending', tone: 'spice' },
  { value: 'confirmed', label: 'Confirmed', tone: 'leaf' },
  { value: 'preparing', label: 'Preparing', tone: 'leaf' },
  { value: 'out_for_delivery', label: 'Out for delivery', tone: 'blue' },
  { value: 'delivered', label: 'Delivered', tone: 'emerald' },
  { value: 'cancelled', label: 'Cancelled', tone: 'red' },
];

const TONE = {
  spice: 'bg-spice-400/20 text-spice-700 border-spice-400/40',
  leaf: 'bg-leaf-100 text-leaf-800 border-leaf-200',
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  red: 'bg-red-100 text-red-800 border-red-200',
};

const STATUS_TONE = Object.fromEntries(STATUSES.map((s) => [s.value, s.tone]));
const STATUS_LABEL = Object.fromEntries(STATUSES.map((s) => [s.value, s.label]));

const FILTERS = [
  { value: 'all', label: 'All' },
  ...STATUSES.map(({ value, label }) => ({ value, label })),
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(null);

  const refresh = async () => {
    setError(null);
    try {
      const data = await listOrders({ limit: 500 });
      setOrders(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (filter !== 'all' && o.status !== filter) return false;
      if (query) {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        const hay =
          (o.customer_name || '').toLowerCase() +
          ' ' +
          (o.customer_phone || '') +
          ' ' +
          (o.id || '');
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [orders, filter, query]);

  const handleStatusChange = async (orderId, newStatus) => {
    // optimistic update
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (e) {
      setError(e.message);
      // revert on failure
      await refresh();
    }
  };

  return (
    <section className="section py-10 lg:py-14">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="heading-display text-3xl sm:text-4xl">Orders</h1>
          <p className="mt-2 text-sm text-leaf-700/85">
            {loading
              ? 'Loading…'
              : `${orders.length} order${orders.length === 1 ? '' : 's'} · ${filtered.length} shown`}
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="inline-flex items-center gap-1.5 rounded-full border border-leaf-200 bg-white px-3 py-1.5 text-xs font-medium text-leaf-700 hover:bg-leaf-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </header>

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters + search */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                filter === f.value
                  ? 'bg-leaf-700 text-white shadow-soft'
                  : 'bg-white border border-leaf-200 text-leaf-700 hover:bg-leaf-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative ml-auto w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-leaf-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone, ID…"
            className="w-full rounded-full border border-leaf-200 bg-white py-2 pl-9 pr-4 text-xs text-leaf-900 outline-none transition-colors focus:border-leaf-400"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="mt-12 flex items-center justify-center text-leaf-500">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-leaf-100 bg-white p-10 text-center text-sm text-leaf-600">
          No orders match this filter.
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {filtered.map((o) => (
            <OrderRow
              key={o.id}
              order={o}
              expanded={expanded === o.id}
              onToggle={() => setExpanded((cur) => (cur === o.id ? null : o.id))}
              onStatusChange={(s) => handleStatusChange(o.id, s)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function OrderRow({ order, expanded, onToggle, onStatusChange }) {
  const tone = STATUS_TONE[order.status] || 'leaf';
  const created = new Date(order.created_at);
  const items = Array.isArray(order.items) ? order.items : [];
  return (
    <li className="overflow-hidden rounded-2xl border border-leaf-100 bg-white shadow-soft">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-cream-50"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-display font-semibold text-leaf-900">{order.customer_name}</p>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${TONE[tone]}`}>
              {STATUS_LABEL[order.status] || order.status}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-leaf-600">
            {created.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} ·{' '}
            {items.length} item{items.length === 1 ? '' : 's'} · {order.customer_phone}
          </p>
        </div>
        <span className="font-display text-lg font-bold text-leaf-900">{rupee(order.total)}</span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-leaf-500" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-leaf-500" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-leaf-100 bg-cream-50/60"
          >
            <div className="grid gap-6 p-5 lg:grid-cols-2">
              {/* Customer + address */}
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-3.5 w-3.5 text-leaf-500" />
                  <a href={`tel:${order.customer_phone}`} className="text-leaf-800 hover:text-leaf-900">
                    {order.customer_phone}
                  </a>
                </div>
                {order.customer_email && (
                  <div className="text-xs text-leaf-600">{order.customer_email}</div>
                )}
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 text-leaf-500" />
                  <address className="not-italic text-leaf-800">
                    {order.delivery_address?.line1}
                    {order.delivery_address?.line2 && <>, {order.delivery_address.line2}</>}
                    {order.delivery_address?.landmark && (
                      <div className="text-xs text-leaf-600">
                        Landmark: {order.delivery_address.landmark}
                      </div>
                    )}
                    <div>
                      {order.delivery_address?.city || 'Deoghar'} — {order.delivery_address?.pincode}
                    </div>
                  </address>
                </div>
                {order.special_instructions && (
                  <div className="flex items-start gap-2">
                    <StickyNote className="mt-0.5 h-3.5 w-3.5 text-leaf-500" />
                    <span className="text-leaf-800">{order.special_instructions}</span>
                  </div>
                )}
              </div>

              {/* Items + status update */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-leaf-600">
                  Items
                </p>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {items.map((i, idx) => (
                    <li key={`${i.id}-${idx}`} className="flex justify-between text-leaf-800">
                      <span>
                        {i.name} × {i.quantity}
                      </span>
                      <span className="font-medium">{rupee((i.priceNum ?? i.price_num ?? 0) * i.quantity)}</span>
                    </li>
                  ))}
                </ul>

                <dl className="mt-4 space-y-1 text-xs">
                  <Row label="Subtotal" value={rupee(order.subtotal)} />
                  {order.packaging_fee > 0 && (
                    <Row label="Packaging" value={rupee(order.packaging_fee)} />
                  )}
                  <Row label="GST" value={rupee(order.gst_amount)} />
                  <Row
                    label={<span className="font-display font-bold text-leaf-900">Total</span>}
                    value={<span className="font-display font-bold text-leaf-900">{rupee(order.total)}</span>}
                  />
                </dl>

                <div className="mt-5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-leaf-600">
                    Update status
                  </label>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {STATUSES.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => onStatusChange(s.value)}
                        disabled={s.value === order.status}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                          s.value === order.status
                            ? `${TONE[s.tone]} cursor-default`
                            : 'border-leaf-200 bg-white text-leaf-700 hover:bg-leaf-50'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-leaf-700">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
