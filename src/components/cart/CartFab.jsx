import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../state/CartContext.jsx';
import CartDrawer from './CartDrawer.jsx';

// Floating bottom CTA — appears as soon as the cart has items, on any
// page. Tap → opens the cart drawer. Hidden during the checkout flow
// (where the cart is already in view) via the `hideOnRoute` prop the
// caller can pass; for now it just shows everywhere.

function rupee(n) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function CartFab() {
  const { itemCount, total } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="group fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full bg-leaf-700 py-3 pl-4 pr-5 text-white shadow-glow ring-1 ring-leaf-800/30 transition-all duration-200 hover:-translate-x-1/2 hover:-translate-y-1 hover:bg-leaf-800 sm:bottom-7"
            aria-label={`View cart — ${itemCount} item${itemCount === 1 ? '' : 's'}`}
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <ShoppingBag className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-spice-500 px-1 text-[10px] font-bold tabular-nums text-white shadow-soft">
                {itemCount}
              </span>
            </span>
            <span className="flex flex-col items-start leading-tight">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-leaf-100/80">
                {itemCount} item{itemCount === 1 ? '' : 's'} added
              </span>
              <span className="font-display text-base font-bold">
                {rupee(total)} · View cart
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
