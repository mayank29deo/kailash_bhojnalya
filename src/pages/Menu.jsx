import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Info, X } from 'lucide-react';
import { fetchMenuCategories } from '../services/menuService.js';
import { searchItems, menuMeta, menuCategories as localMenu } from '../data/menu.js';
import MenuItemCard from '../components/menu/MenuItemCard.jsx';
import CategoryNav from '../components/menu/CategoryNav.jsx';
import { restaurant } from '../config/restaurant.js';

export default function Menu() {
  // Optimistic render: start with the bundled static menu so the page
  // is never empty, even before (or if) the Supabase fetch resolves.
  // The DB swap happens silently once data arrives.
  const [categories, setCategories] = useState(() => localMenu);
  const [activeId, setActiveId] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let active = true;
    fetchMenuCategories().then((cats) => {
      if (active && Array.isArray(cats) && cats.length > 0) {
        setCategories(cats);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const visibleCategories = useMemo(() => {
    if (activeId === 'all') return categories;
    return categories.filter((c) => c.id === activeId);
  }, [categories, activeId]);

  const searchResults = useMemo(
    () => (query.trim() ? searchItems(query) : null),
    [query]
  );

  const onCategorySelect = (id) => {
    setActiveId(id);
    if (id === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(`cat-${id}`);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 160;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="section pt-12 pb-6 lg:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="pill-leaf">Our Menu</span>
          <h1 className="heading-display mt-4 text-4xl sm:text-5xl">
            Everything we cook, <span className="gradient-text">all in one place.</span>
          </h1>
          <p className="mt-4 text-leaf-700/80">
            From our signature thalis to South Indian, Chinese, paneer, mushroom and
            milkshakes — every dish is 100% pure vegetarian.
          </p>

          <div className="mt-8 flex justify-center">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-leaf-500" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dishes — paneer, dosa, thali…"
                className="w-full rounded-full border border-leaf-200 bg-white/80 py-3 pl-11 pr-11 text-sm text-leaf-900 placeholder:text-leaf-500/70 shadow-soft outline-none transition-all focus:border-leaf-400 focus:bg-white focus:shadow-ring"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-leaf-500 hover:bg-leaf-100"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {!searchResults && categories.length > 0 && (
        <div className="section">
          <CategoryNav
            categories={categories}
            activeId={activeId}
            onSelect={onCategorySelect}
          />
        </div>
      )}

      <section className="section py-10">
        {searchResults ? (
          <SearchResults results={searchResults} query={query} />
        ) : (
          <div className="space-y-14">
            {visibleCategories.map((cat) => (
              <CategoryBlock key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </section>

      <section className="section pb-24">
        <div className="rounded-3xl border border-leaf-200/70 bg-white/70 p-6 backdrop-blur">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-leaf-100 p-2 text-leaf-700">
              <Info className="h-5 w-5" />
            </div>
            <div className="text-sm leading-relaxed text-leaf-700/85">
              <p className="font-semibold text-leaf-900">A few notes from the kitchen</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>{restaurant.notes.gst}</li>
                <li>{restaurant.notes.thaliPackaging}</li>
                <li>{restaurant.notes.alcohol}</li>
                <li>{menuMeta.notice}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function CategoryBlock({ category }) {
  return (
    <section id={`cat-${category.id}`} className="scroll-mt-40">
      <div
        className={`rounded-3xl bg-gradient-to-br ${category.accent || 'from-leaf-50 to-cream-50'} p-6 sm:p-8`}
      >
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-3xl">{category.icon}</p>
            <h2 className="heading-display mt-2 text-2xl sm:text-3xl">{category.name}</h2>
            {category.tagline && (
              <p className="mt-1 text-sm text-leaf-700/80">{category.tagline}</p>
            )}
          </div>
          <span className="text-xs font-medium text-leaf-600/80">
            {category.items.length} {category.items.length === 1 ? 'dish' : 'dishes'}
          </span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {category.items.map((item, idx) => (
            <MenuItemCard
              key={item.id}
              item={{ ...item, categoryId: category.id, categoryName: category.name }}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SearchResults({ results, query }) {
  if (results.length === 0) {
    return (
      <div className="rounded-3xl border border-leaf-100 bg-white/70 p-10 text-center backdrop-blur">
        <p className="font-display text-xl text-leaf-800">No dishes match "{query}"</p>
        <p className="mt-2 text-sm text-leaf-600">
          Try searching for paneer, dal, biryani, dosa, or thali.
        </p>
      </div>
    );
  }
  return (
    <div>
      <p className="mb-5 text-sm text-leaf-700">
        Found <span className="font-semibold">{results.length}</span> dish
        {results.length === 1 ? '' : 'es'} for "{query}"
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {results.map((item, idx) => (
          <div key={item.id} className="rounded-2xl">
            <p className="mb-1 ml-1 text-[11px] font-semibold uppercase tracking-wide text-leaf-600">
              {item.categoryName}
            </p>
            <MenuItemCard item={item} index={idx} />
          </div>
        ))}
      </div>
    </div>
  );
}
