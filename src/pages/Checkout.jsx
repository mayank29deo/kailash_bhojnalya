import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageCircle,
  Loader2,
  Wallet,
  CreditCard,
  Lock,
} from 'lucide-react';
import { useCart } from '../state/CartContext.jsx';
import { persistOrder } from '../services/orderService.js';
import { sendOrderToWhatsapp, buildWhatsappLink } from '../services/whatsappService.js';
import { restaurant } from '../config/restaurant.js';

const STORAGE_KEY = 'kb-checkout-draft';

const blankForm = {
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  line1: '',
  line2: '',
  landmark: '',
  city: 'Deoghar',
  pincode: '',
  specialInstructions: '',
  paymentMethod: 'cod',
};

function loadDraft() {
  if (typeof window === 'undefined') return blankForm;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return blankForm;
    const parsed = JSON.parse(raw);
    return { ...blankForm, ...parsed };
  } catch {
    return blankForm;
  }
}

function rupee(n) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function Checkout() {
  const cart = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(loadDraft);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null); // { whatsappLink }
  const [error, setError] = useState(null);

  // Persist form drafts (saves the address while user types)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {
      /* ignore */
    }
  }, [form]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.customerName.trim()) return 'Please enter your name.';
    if (!/^\+?\d[\d\s-]{8,}$/.test(form.customerPhone.trim()))
      return 'Please enter a valid phone number.';
    if (!form.line1.trim()) return 'Please enter your delivery address.';
    if (!/^\d{6}$/.test(form.pincode.trim())) return 'Please enter a valid 6-digit pincode.';
    if (cart.itemCount === 0) return 'Your cart is empty.';
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }
    setSubmitting(true);

    const order = {
      customerName: form.customerName.trim(),
      customerPhone: form.customerPhone.trim(),
      customerEmail: form.customerEmail.trim() || null,
      address: {
        line1: form.line1.trim(),
        line2: form.line2.trim() || null,
        landmark: form.landmark.trim() || null,
        city: form.city.trim() || 'Deoghar',
        pincode: form.pincode.trim(),
        state: 'Jharkhand',
      },
      specialInstructions: form.specialInstructions.trim() || null,
      paymentMethod: form.paymentMethod,
    };

    // Fire-and-forget the DB persist. WhatsApp is the customer-facing
    // path and MUST NOT wait on Supabase — if the DB is slow or down,
    // the customer still gets through to WhatsApp and the order still
    // reaches the kitchen. orderService internally caps at a 6s
    // timeout so even the background promise can't leak forever.
    persistOrder({ order, cart }).catch((err) => {
      console.warn('[checkout] background persist failed:', err?.message);
    });

    // Build the link before opening so the success view can offer a
    // manual fallback if the popup was blocked.
    const link = buildWhatsappLink({ order, cart });
    sendOrderToWhatsapp({ order, cart });

    setSuccess({ whatsappLink: link, order });
    setSubmitting(false);

    // Clear cart after successful place. Form draft retained so the
    // address auto-fills next time.
    cart.clear();
  };

  if (success) {
    return <SuccessView whatsappLink={success.whatsappLink} order={success.order} navigate={navigate} />;
  }

  if (cart.itemCount === 0) {
    return <EmptyState />;
  }

  return (
    <section className="section py-10 lg:py-14">
      <Link
        to="/menu"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-leaf-700 hover:text-leaf-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to menu
      </Link>

      <header className="mt-4 max-w-2xl">
        <span className="pill-leaf">Checkout</span>
        <h1 className="heading-display mt-3 text-3xl sm:text-4xl">
          A few details and we'll send your order via WhatsApp.
        </h1>
        <p className="mt-3 text-sm text-leaf-700/85">
          {restaurant.name} confirms each order personally on WhatsApp before dispatch — usually within 5–10 minutes during opening hours.
        </p>
      </header>

      <form onSubmit={onSubmit} className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left: form */}
        <div className="space-y-8">
          <Section title="Your details" subtitle="So we can confirm and call back if needed.">
            <Row>
              <Field label="Full name" name="customerName" required value={form.customerName} onChange={onChange} placeholder="As you'd like us to address you" />
            </Row>
            <Row two>
              <Field label="Phone number" name="customerPhone" type="tel" required value={form.customerPhone} onChange={onChange} placeholder="+91 ..." />
              <Field label="Email (optional)" name="customerEmail" type="email" value={form.customerEmail} onChange={onChange} placeholder="you@example.com" />
            </Row>
          </Section>

          <Section title="Delivery address">
            <Row>
              <Field label="House / flat / building" name="line1" required value={form.line1} onChange={onChange} placeholder="House no., apartment, building" />
            </Row>
            <Row>
              <Field label="Street, area" name="line2" value={form.line2} onChange={onChange} placeholder="Road, locality" />
            </Row>
            <Row two>
              <Field label="Landmark (optional)" name="landmark" value={form.landmark} onChange={onChange} placeholder="Near …" />
              <Field label="Pincode" name="pincode" required value={form.pincode} onChange={onChange} placeholder="6 digits" inputMode="numeric" maxLength={6} />
            </Row>
            <Row>
              <Field label="City" name="city" value={form.city} onChange={onChange} />
            </Row>
            <p className="mt-2 text-xs text-leaf-600">
              We currently deliver within Deoghar town. For longer-distance bookings, call us on{' '}
              <a href={`tel:${restaurant.phone}`} className="font-medium underline-offset-2 hover:underline">
                {restaurant.phone}
              </a>.
            </p>
          </Section>

          <Section title="Special instructions" subtitle="Spice level, dietary notes, gate code, etc.">
            <textarea
              name="specialInstructions"
              rows={3}
              value={form.specialInstructions}
              onChange={onChange}
              placeholder="Less spicy please…"
              className="w-full rounded-2xl border border-leaf-200 bg-white px-4 py-3 text-sm text-leaf-900 placeholder:text-leaf-500/70 outline-none transition-colors focus:border-leaf-400"
            />
          </Section>

          <Section title="Payment">
            <div className="grid gap-3 sm:grid-cols-2">
              <PaymentOption
                selected={form.paymentMethod === 'cod'}
                onSelect={() => setForm((f) => ({ ...f, paymentMethod: 'cod' }))}
                icon={Wallet}
                title="Cash on Delivery"
                description="Pay when your order arrives (UPI / Paytm / PhonePe / GPay also accepted at the door)."
              />
              <PaymentOption
                disabled
                icon={CreditCard}
                title="Online Payment"
                description="UPI / cards via Razorpay — coming soon"
              />
            </div>
          </Section>

          {error && (
            <div className="flex items-start gap-2 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full !py-4 sm:w-auto sm:px-10">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <MessageCircle className="h-4 w-4" />
                Place order via WhatsApp · {rupee(cart.total)}
              </>
            )}
          </button>
          <p className="text-xs text-leaf-600">
            <Lock className="-mt-0.5 mr-1 inline h-3 w-3" />
            Your details stay between you and the kitchen. We do not share or sell them.
          </p>
        </div>

        {/* Right: order summary (sticky on desktop) */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-soft">
            <h2 className="font-display text-xl font-semibold text-leaf-900">Order summary</h2>

            <ul className="mt-5 space-y-3 text-sm">
              {cart.items.map((i) => (
                <li key={i.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-leaf-900">{i.name}</p>
                    <p className="text-xs text-leaf-600">
                      {rupee(i.priceNum)} × {i.quantity}
                    </p>
                  </div>
                  <span className="shrink-0 font-display font-semibold text-leaf-800">
                    {rupee(i.priceNum * i.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="my-5 h-px bg-leaf-100" />

            <dl className="space-y-1.5 text-sm">
              <Line label="Subtotal" value={rupee(cart.subtotal)} />
              {cart.discountAmount > 0 && (
                <Line
                  label={
                    <span className="text-spice-700">
                      {cart.promoLabel || 'Discount'} ({cart.promoPercent}% off)
                    </span>
                  }
                  value={<span className="text-spice-700">−{rupee(cart.discountAmount)}</span>}
                />
              )}
              {cart.deliveryFee > 0 && <Line label="Delivery charge" value={rupee(cart.deliveryFee)} />}
              <Line label={`GST (${cart.gstPercent}%)`} value={rupee(cart.gstAmount)} />
            </dl>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-leaf-50 px-4 py-3">
              <span className="font-display text-base font-bold text-leaf-900">Total</span>
              <span className="font-display text-2xl font-bold text-leaf-900">{rupee(cart.total)}</span>
            </div>

            <p className="mt-4 text-[11px] leading-relaxed text-leaf-600">
              GST is an estimate; final invoice from the restaurant may vary slightly.
            </p>
          </div>
        </aside>
      </form>
    </section>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-soft">
      <h3 className="font-display text-lg font-semibold text-leaf-900">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-leaf-600">{subtitle}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function Row({ children, two = false }) {
  return <div className={two ? 'grid gap-4 sm:grid-cols-2' : ''}>{children}</div>;
}

function Field({ label, name, required, ...rest }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-leaf-700">
        {label}
        {required && <span className="ml-1 text-spice-600">*</span>}
      </span>
      <input
        name={name}
        required={required}
        {...rest}
        className="mt-1.5 w-full rounded-2xl border border-leaf-200 bg-white px-4 py-3 text-sm text-leaf-900 placeholder:text-leaf-500/70 outline-none transition-colors focus:border-leaf-400"
      />
    </label>
  );
}

function PaymentOption({ icon: Icon, title, description, selected, onSelect, disabled }) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onSelect}
      disabled={disabled}
      className={`relative flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
        disabled
          ? 'cursor-not-allowed border-leaf-100 bg-leaf-50/40 opacity-65'
          : selected
            ? 'border-leaf-500 bg-leaf-50 shadow-soft'
            : 'border-leaf-200 bg-white hover:border-leaf-400'
      }`}
    >
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${selected ? 'bg-leaf-600 text-white' : 'bg-leaf-100 text-leaf-700'}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="font-display font-semibold text-leaf-900">{title}</p>
        <p className="mt-0.5 text-xs text-leaf-600">{description}</p>
      </div>
      {selected && (
        <CheckCircle2 className="absolute right-4 top-4 h-4 w-4 text-leaf-600" />
      )}
    </button>
  );
}

function Line({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-leaf-700">{label}</dt>
      <dd className="font-medium text-leaf-900">{value}</dd>
    </div>
  );
}

function SuccessView({ whatsappLink, order, navigate }) {
  return (
    <section className="section py-16 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-xl text-center"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-leaf-100">
          <CheckCircle2 className="h-10 w-10 text-leaf-600" />
        </div>
        <h1 className="heading-display mt-6 text-3xl sm:text-4xl">
          Order sent to WhatsApp.
        </h1>
        <p className="mt-4 text-leaf-700/85">
          {restaurant.name} will confirm your order on WhatsApp shortly. Keep an eye on{' '}
          <span className="font-semibold">{order.customerPhone}</span> — they may call back to confirm
          the address or any preferences.
        </p>

        <div className="mt-8 rounded-3xl border border-leaf-100 bg-white p-6 text-left shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wider text-leaf-600">Didn't open?</p>
          <p className="mt-1.5 text-sm text-leaf-700">
            If WhatsApp didn't open automatically, tap below to retry — your order is pre-filled.
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-4 w-full !py-3"
          >
            <MessageCircle className="h-4 w-4" />
            Open in WhatsApp
          </a>
          <a
            href={`tel:${restaurant.phone}`}
            className="btn-ghost mt-2 w-full !py-3"
          >
            <Phone className="h-4 w-4" />
            Or call {restaurant.phone}
          </a>
        </div>

        <button
          type="button"
          onClick={() => navigate('/menu')}
          className="mt-6 text-sm font-medium text-leaf-700 hover:text-leaf-900"
        >
          ← Back to menu
        </button>
      </motion.div>
    </section>
  );
}

function EmptyState() {
  return (
    <section className="section py-20">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
          <ShoppingBag className="h-7 w-7" />
        </div>
        <h1 className="heading-display mt-6 text-2xl sm:text-3xl">Your cart is empty</h1>
        <p className="mt-2 text-sm text-leaf-700/85">
          Add a few items from the menu to start an order.
        </p>
        <Link to="/menu" className="btn-primary mt-6">
          Explore the menu
        </Link>
      </div>
    </section>
  );
}
