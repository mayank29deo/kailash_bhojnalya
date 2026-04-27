import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';
import { restaurant } from '../config/restaurant.js';
import { submitEnquiry } from '../services/contactService.js';

const occasions = ['General enquiry', 'Wedding catering', 'Birthday', 'Meeting / Corporate', 'Other'];

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    occasion: occasions[0],
    message: '',
  });
  const [status, setStatus] = useState({ kind: 'idle' });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      setStatus({ kind: 'error', message: 'Please fill in name, phone, and a short message.' });
      return;
    }
    setStatus({ kind: 'loading' });
    const result = await submitEnquiry(form);
    if (result.ok) {
      setStatus({
        kind: 'success',
        message: result.offline
          ? "Got it — please also call us so we don't miss your enquiry."
          : "Thank you! We'll be in touch within a day.",
      });
      setForm({ name: '', phone: '', occasion: occasions[0], message: '' });
    } else {
      setStatus({ kind: 'error', message: result.error || 'Something went wrong.' });
    }
  };

  const whatsappLink = `https://wa.me/${restaurant.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    "Hello Kailash Bhojnalya, I'd like to enquire about "
  )}`;

  return (
    <>
      <section className="section pt-12 pb-10 lg:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="pill-leaf">Visit Us</span>
          <h1 className="heading-display mt-4 text-4xl sm:text-5xl">
            Find us on <span className="gradient-text">Station Road, Deoghar.</span>
          </h1>
          <p className="mt-4 text-leaf-700/80">
            Drop in for lunch or dinner, call us for a takeaway, or send a message
            for catering enquiries — we usually reply the same day.
          </p>
        </motion.div>
      </section>

      <section className="section pb-16">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Map + info column */}
          <div className="lg:col-span-3 space-y-5">
            <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/70 backdrop-blur shadow-soft">
              <div className="aspect-[16/10] w-full">
                <iframe
                  title="Kailash Bhojnalya — Station Road, Deoghar"
                  src="https://www.google.com/maps?q=Kailash+Bhojnalya+Station+Road+Deoghar&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <InfoBlock icon={MapPin} title="Address">
                {restaurant.address.line1}
                <br />
                {restaurant.address.city}, {restaurant.address.state}
              </InfoBlock>
              <InfoBlock icon={Phone} title="Phone">
                <a href={`tel:${restaurant.phone}`} className="hover:text-leaf-900">
                  {restaurant.phone}
                </a>
              </InfoBlock>
              <InfoBlock icon={Clock} title="Hours">
                {restaurant.hours[0].value}
              </InfoBlock>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-3xl border border-leaf-200 bg-gradient-to-r from-leaf-50 to-cream-50 p-5 transition-all hover:shadow-soft hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-600 text-white">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-base font-semibold text-leaf-900">
                    Chat with us on WhatsApp
                  </p>
                  <p className="text-xs text-leaf-700/80">
                    Quickest way to confirm a booking or takeaway.
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium text-leaf-700">→</span>
            </a>
          </div>

          {/* Form column */}
          <div className="lg:col-span-2">
            <form
              onSubmit={onSubmit}
              className="glass-card flex flex-col gap-4 p-6 sm:p-7"
            >
              <div>
                <h2 className="heading-display text-2xl">Send an enquiry</h2>
                <p className="mt-1 text-sm text-leaf-700/80">
                  We host marriage parties, birthdays, meetings & ceremonies on a
                  per-plate basis.
                </p>
              </div>

              <Field label="Your name" name="name" value={form.name} onChange={onChange} />
              <Field
                label="Phone number"
                name="phone"
                type="tel"
                placeholder="+91 ..."
                value={form.phone}
                onChange={onChange}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-leaf-700">
                  Occasion
                </label>
                <select
                  name="occasion"
                  value={form.occasion}
                  onChange={onChange}
                  className="rounded-2xl border border-leaf-200 bg-white/80 px-4 py-3 text-sm text-leaf-900 outline-none transition-colors focus:border-leaf-400"
                >
                  {occasions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-leaf-700">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Number of guests, date, any special requests…"
                  value={form.message}
                  onChange={onChange}
                  className="rounded-2xl border border-leaf-200 bg-white/80 px-4 py-3 text-sm text-leaf-900 placeholder:text-leaf-500/70 outline-none transition-colors focus:border-leaf-400"
                />
              </div>

              <button
                type="submit"
                disabled={status.kind === 'loading'}
                className="btn-primary mt-1 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status.kind === 'loading' ? 'Sending…' : 'Send enquiry'}
              </button>

              {status.kind === 'success' && (
                <div className="flex items-start gap-2 rounded-2xl bg-leaf-100/70 p-3 text-sm text-leaf-800">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" />
                  <span>{status.message}</span>
                </div>
              )}
              {status.kind === 'error' && (
                <div className="flex items-start gap-2 rounded-2xl bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{status.message}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, name, type = 'text', value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-xs font-semibold uppercase tracking-wide text-leaf-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="rounded-2xl border border-leaf-200 bg-white/80 px-4 py-3 text-sm text-leaf-900 placeholder:text-leaf-500/70 outline-none transition-colors focus:border-leaf-400"
      />
    </div>
  );
}

function InfoBlock({ icon: Icon, title, children }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/65 p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-leaf-600">
        <Icon className="h-4 w-4" />
        <span className="text-[11px] font-semibold uppercase tracking-wider">
          {title}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-leaf-800">{children}</p>
    </div>
  );
}
