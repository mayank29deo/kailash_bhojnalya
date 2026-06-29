import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '../../state/CartContext.jsx';
import QuantityStepper from './QuantityStepper.jsx';

function rupee(n) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function CartDrawer({ open, onClose }) {
  const cart = useCart();

  // Lock background scroll while drawer open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[55] bg-leaf-950/40 backdrop-blur-sm"
          />
          <motion.aside
            key="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-md flex-col bg-cream-50 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
          >
            <header className="flex items-center justify-between border-b border-leaf-100/80 bg-white/80 px-6 py-5 backdrop-blur">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-leaf-600">
                  Your order
                </p>
                <h2 className="heading-display mt-0.5 text-2xl">
                  {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-leaf-700 transition-colors hover:bg-leaf-100"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {cart.itemCount === 0 ? (
              <EmptyCart onClose={onClose} />
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <ul className="space-y-3">
                    {cart.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-start justify-between gap-3 rounded-2xl border border-leaf-100 bg-white px-4 py-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-base font-semibold text-leaf-900">
                            {item.name}
                          </p>
                          <p className="mt-0.5 text-xs text-leaf-600">
                            {rupee(item.priceNum)} × {item.quantity}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="font-display text-sm font-bold text-leaf-800">
                            {rupee(item.priceNum * item.quantity)}
                          </span>
                          <QuantityStepper item={item} compact />
                        </div>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={cart.clear}
                    className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-leaf-600 hover:text-leaf-800"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Clear cart
                  </button>
                </div>

                <div className="border-t border-leaf-100 bg-white/90 px-6 py-5 backdrop-blur">
                  <dl className="space-y-1.5 text-sm">
                    <Row label="Subtotal" value={rupee(cart.subtotal)} />
                    {cart.deliveryFee > 0 && (
                      <Row label="Delivery charge" value={rupee(cart.deliveryFee)} />
                    )}
                    <Row label={`GST (${cart.gstPercent}%)`} value={rupee(cart.gstAmount)} />
                    <div className="my-2 h-px bg-leaf-100" />
                    <Row
                      label={<span className="font-display text-base font-bold text-leaf-900">Total</span>}
                      value={
                        <span className="font-display text-xl font-bold text-leaf-900">
                          {rupee(cart.total)}
                        </span>
                      }
                    />
                  </dl>

                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="btn-primary mt-5 w-full !py-3.5"
                  >
                    Continue to checkout
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <p className="mt-3 text-center text-[11px] text-leaf-600/85">
                    Cash on delivery · Order confirmed via WhatsApp
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-leaf-700">{label}</dt>
      <dd className="font-medium text-leaf-900">{value}</dd>
    </div>
  );
}

function EmptyCart({ onClose }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
        <ShoppingBag className="h-7 w-7" />
      </div>
      <p className="mt-5 font-display text-xl font-semibold text-leaf-900">Your cart is empty</p>
      <p className="mt-2 max-w-xs text-sm text-leaf-700/85">
        Browse the menu and add a few thalis or your favourite paneer dish to get started.
      </p>
      <Link
        to="/menu"
        onClick={onClose}
        className="btn-primary mt-6"
      >
        Explore the menu
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
