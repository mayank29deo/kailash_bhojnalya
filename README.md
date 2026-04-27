# Kailash Bhojnalya — Web Platform

Heritage pure-vegetarian restaurant in Deoghar, Jharkhand. Operating since **1963**.
This web app is a digital storefront that complements the existing Zomato / Swiggy / Google Maps presence — pilot focus is delighting users who land on the page from a Google Business / Maps search and giving them a frictionless path to the menu, ordering, and contact.

---

## Quick start

```bash
npm install
cp .env.example .env       # fill in Supabase keys when ready
npm run dev
```

Drop the restaurant's logo at `public/logo.png` (or `.jpg`/`.jpeg`) — the `Logo` component picks it up automatically. A leaf-themed SVG fallback is used until then.

---

## Architectural Layers

The app is intentionally small but cleanly layered so future features (live menu admin, online payments, loyalty, etc.) can slot in without rework.

### 1. Presentation Layer — `src/components/`, `src/pages/`
- React functional components, organised by feature: `layout/`, `home/`, `menu/`, `util/`.
- Tailwind utility CSS + a small set of design tokens in `src/styles/index.css` (`btn-primary`, `glass-card`, `gradient-text`, `pill`, `veg-dot`, etc.).
- Framer Motion is used sparingly for entrance animations and hover lifts.

### 2. Routing Layer — `src/App.jsx`, `react-router-dom`
- Four routes: `/`, `/menu`, `/about`, `/contact`. All other paths fall through to Home.
- `ScrollToTop` ensures route changes scroll predictably, with hash-anchor support.

### 3. Configuration Layer — `src/config/restaurant.js`
- Single source of truth for everything that varies: phone, hours, ordering links, social, story copy, GST notes. Components import from here, never hardcode.
- Order links and contact numbers can be overridden at deploy time via `VITE_*` env vars.

### 4. Data Layer — `src/data/menu.js`
- The complete menu (all 14 categories, 80+ dishes) extracted from the printed menu, with handwritten price updates honoured.
- Pure JS module — easy to edit, ship, and search. Helpers: `getCategoryById`, `getAllItems`, `searchItems`, `getFeaturedItems`.

### 5. Service / DAL Layer — `src/services/`
- `menuService.fetchMenuCategories()` — returns Supabase data when configured, falls back to bundled menu.
- `reviewsService.fetchReviews()` — same pattern, with curated fallback testimonials.
- `contactService.submitEnquiry()` — writes to `enquiries` table when configured; otherwise responds with an offline acknowledgement so the form still works during local dev.
- The shape returned by these functions is stable, so swapping bundled → Supabase is invisible to UI components.

### 6. Backend Layer — Supabase (`supabase/schema.sql`)
- Tables: `menu_categories`, `menu_items`, `reviews`, `enquiries`.
- Row-Level Security: public can read menu and reviews; anonymous insert allowed for enquiries; mutations require auth.
- Run `schema.sql` once in the Supabase SQL editor to bootstrap.

### 7. Integration Layer
- Zomato / Swiggy deep links rendered as the hero CTA (`OrderCards.jsx`) — primary conversion path.
- Google Maps embedded iframe on Contact page.
- `tel:` and `wa.me/` links throughout for one-tap call / WhatsApp.

---

## Project structure

```
src/
├─ App.jsx                 — Router + layout shell
├─ main.jsx                — Entry point, BrowserRouter
├─ config/
│  └─ restaurant.js        — Business info + env-driven URLs
├─ data/
│  └─ menu.js              — All categories & dishes
├─ lib/
│  └─ supabase.js          — Lazy Supabase client
├─ services/               — Data Access Layer
│  ├─ menuService.js
│  ├─ reviewsService.js
│  └─ contactService.js
├─ hooks/
│  └─ useReducedMotion.js
├─ components/
│  ├─ layout/              Logo, Navbar, Footer
│  ├─ home/                Hero, OrderCards, HeritageStrip,
│  │                       FeaturedDishes, Reviews, VisitCta
│  ├─ menu/                MenuItemCard, CategoryNav
│  └─ util/                ScrollToTop
├─ pages/                  Home, Menu, About, Contact
└─ styles/
   └─ index.css            Tailwind layers + design primitives
supabase/
└─ schema.sql              Bootstrap migration for the database
```

---

## Theme

- **Palette** — whitish-green gradient (`leaf` 50–950 in `tailwind.config.js`), accented with a warm `spice` orange and a soft `cream`.
- **Typography** — `Playfair Display` for headings, `Inter` for body, `Dancing Script` for the small heritage flourishes ("Since 1963").
- **Surfaces** — frosted glass cards (`glass-card`), large radii (`rounded-3xl`), tasteful blur, subtle shadows tinted with the leaf palette.

---

## Roadmap

- Wire Supabase: run `supabase/schema.sql`, paste keys into `.env`, optionally seed `menu_items` from `data/menu.js`.
- Replace the placeholder logo with the real PNG once provided.
- Add a small admin tool for the owner to update prices and add specials.
- Image gallery once we have plated photographs.
- Online table reservation (post-pilot).
