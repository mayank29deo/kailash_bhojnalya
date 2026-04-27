import { useEffect, useRef } from 'react';

export default function CategoryNav({ categories, activeId, onSelect }) {
  const railRef = useRef(null);
  const activeBtnRef = useRef(null);

  useEffect(() => {
    if (activeBtnRef.current && railRef.current) {
      const btn = activeBtnRef.current;
      const rail = railRef.current;
      const offset = btn.offsetLeft - rail.clientWidth / 2 + btn.clientWidth / 2;
      rail.scrollTo({ left: offset, behavior: 'smooth' });
    }
  }, [activeId]);

  return (
    <div
      ref={railRef}
      className="sticky top-20 z-30 -mx-5 sm:-mx-8 lg:-mx-12 overflow-x-auto border-b border-leaf-100/70 bg-cream-50/80 px-5 sm:px-8 lg:px-12 py-3 backdrop-blur-xl scrollbar-hide"
    >
      <div className="flex gap-2 whitespace-nowrap">
        <button
          type="button"
          onClick={() => onSelect('all')}
          ref={activeId === 'all' ? activeBtnRef : null}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
            activeId === 'all'
              ? 'bg-leaf-700 text-white shadow-soft'
              : 'bg-white/70 text-leaf-700 hover:bg-leaf-50'
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            ref={activeId === c.id ? activeBtnRef : null}
            onClick={() => onSelect(c.id)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeId === c.id
                ? 'bg-leaf-700 text-white shadow-soft'
                : 'bg-white/70 text-leaf-700 hover:bg-leaf-50'
            }`}
          >
            <span aria-hidden>{c.icon}</span>
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
