import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Plus,
  X,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Search,
  Star,
  Trash2,
  Save,
} from 'lucide-react';
import {
  listMenuForAdmin,
  updateMenuItem,
  createMenuItem,
  deleteMenuItem,
  uploadMenuImage,
} from '../../services/adminService.js';

export default function AdminMenu() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null); // item being edited (or 'new')
  const [defaultCategoryId, setDefaultCategoryId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (kind, text) => {
    setToast({ kind, text });
    setTimeout(() => setToast(null), 2400);
  };

  const refresh = async () => {
    setError(null);
    try {
      const data = await listMenuForAdmin();
      setCategories(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  // Flattened item list with category info attached for searching.
  const allItems = useMemo(
    () =>
      categories.flatMap((c) =>
        (c.items || []).map((i) => ({ ...i, _category: { id: c.id, name: c.name } }))
      ),
    [categories]
  );

  const visibleItems = useMemo(() => {
    let list = allItems;
    if (filter !== 'all') list = list.filter((i) => i.category_id === filter);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((i) => (i.name || '').toLowerCase().includes(q));
    // Group by category for the section headers
    const grouped = new Map();
    for (const i of list) {
      const key = i.category_id;
      if (!grouped.has(key)) grouped.set(key, { id: key, name: i._category.name, items: [] });
      grouped.get(key).items.push(i);
    }
    return Array.from(grouped.values());
  }, [allItems, filter, query]);

  const handleSave = async (payload, isNew) => {
    try {
      if (isNew) {
        if (!payload.id) {
          payload.id = slugify(payload.name);
        }
        await createMenuItem(payload);
        showToast('ok', 'Item added.');
      } else {
        const { id, ...patch } = payload;
        await updateMenuItem(id, patch);
        showToast('ok', 'Saved.');
      }
      setEditing(null);
      await refresh();
    } catch (e) {
      showToast('err', e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item permanently? This cannot be undone.')) return;
    try {
      await deleteMenuItem(id);
      showToast('ok', 'Deleted.');
      setEditing(null);
      await refresh();
    } catch (e) {
      showToast('err', e.message);
    }
  };

  const handleToggle = async (item, field) => {
    try {
      const patch = { [field]: !item[field] };
      await updateMenuItem(item.id, patch);
      showToast('ok', `${prettyField(field)} updated.`);
      await refresh();
    } catch (e) {
      showToast('err', e.message);
    }
  };

  return (
    <section className="section py-10 lg:py-14">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="heading-display text-3xl sm:text-4xl">Menu editor</h1>
          <p className="mt-2 text-sm text-leaf-700/85">
            {loading
              ? 'Loading…'
              : `${allItems.length} item${allItems.length === 1 ? '' : 's'} across ${categories.length} categor${categories.length === 1 ? 'y' : 'ies'}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setDefaultCategoryId(categories[0]?.id || null);
            setEditing('new');
          }}
          className="btn-primary !py-2.5"
        >
          <Plus className="h-4 w-4" />
          Add item
        </button>
      </header>

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Category filters + search */}
      <div className="mt-6 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          <FilterPill active={filter === 'all'} onClick={() => setFilter('all')}>
            All ({allItems.length})
          </FilterPill>
          {categories.map((c) => (
            <FilterPill
              key={c.id}
              active={filter === c.id}
              onClick={() => setFilter(c.id)}
            >
              {c.icon ? `${c.icon} ` : ''}
              {c.name} ({c.items?.length || 0})
            </FilterPill>
          ))}
        </div>
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-leaf-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dish name…"
            className="w-full rounded-full border border-leaf-200 bg-white py-2 pl-9 pr-4 text-sm text-leaf-900 outline-none transition-colors focus:border-leaf-400"
          />
        </div>
      </div>

      {loading ? (
        <div className="mt-12 flex items-center justify-center text-leaf-500">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-leaf-100 bg-white p-10 text-center text-sm text-leaf-600">
          No items match.
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {visibleItems.map((cat) => (
            <div key={cat.id}>
              <h2 className="font-display text-xl font-semibold text-leaf-900">{cat.name}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {cat.items.map((item) => (
                  <AdminItemCard
                    key={item.id}
                    item={item}
                    onEdit={() => setEditing(item)}
                    onToggle={(field) => handleToggle(item, field)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor drawer */}
      <AnimatePresence>
        {editing && (
          <EditorDrawer
            mode={editing === 'new' ? 'new' : 'edit'}
            item={editing === 'new' ? null : editing}
            categories={categories}
            defaultCategoryId={defaultCategoryId}
            onClose={() => setEditing(null)}
            onSave={(payload) => handleSave(payload, editing === 'new')}
            onDelete={editing !== 'new' ? () => handleDelete(editing.id) : null}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className={`fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-soft ${
              toast.kind === 'ok'
                ? 'bg-leaf-700 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {toast.kind === 'ok' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function FilterPill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
        active
          ? 'bg-leaf-700 text-white shadow-soft'
          : 'border border-leaf-200 bg-white text-leaf-700 hover:bg-leaf-50'
      }`}
    >
      {children}
    </button>
  );
}

function AdminItemCard({ item, onEdit, onToggle }) {
  const src = item.image_url || `/menu/${item.id}.jpg`;
  const inactive = item.is_active === false;
  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-ring ${
        inactive ? 'border-leaf-100 opacity-65' : 'border-leaf-100'
      }`}
    >
      <button
        type="button"
        onClick={onEdit}
        className="block w-full text-left"
      >
        <div className="relative aspect-[16/10] bg-leaf-50">
          <img
            src={src}
            alt={item.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="h-full w-full object-cover"
          />
          {item.is_featured && (
            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-spice-500/95 px-2 py-0.5 text-[10px] font-bold text-white shadow">
              <Star className="h-2.5 w-2.5 fill-white" /> Featured
            </span>
          )}
          {inactive && (
            <span className="absolute right-2 top-2 rounded-full bg-leaf-900/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              Hidden
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="font-display text-base font-semibold text-leaf-900">{item.name}</p>
          {item.description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-leaf-600">{item.description}</p>
          )}
          <p className="mt-2 font-display text-lg font-bold text-leaf-800">{item.price}</p>
        </div>
      </button>
      <div className="flex items-center justify-between border-t border-leaf-100 px-4 py-2 text-xs">
        <button
          type="button"
          onClick={() => onToggle('is_active')}
          className={`rounded-full px-2.5 py-1 font-medium ${
            inactive ? 'bg-leaf-100 text-leaf-700' : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          {inactive ? 'Inactive' : 'Active'}
        </button>
        <button
          type="button"
          onClick={() => onToggle('is_featured')}
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium ${
            item.is_featured ? 'bg-spice-400/30 text-spice-700' : 'bg-leaf-50 text-leaf-600'
          }`}
        >
          <Star className={`h-3 w-3 ${item.is_featured ? 'fill-spice-600' : ''}`} />
          Featured
        </button>
      </div>
    </div>
  );
}

function EditorDrawer({ mode, item, categories, defaultCategoryId, onClose, onSave, onDelete }) {
  const fileRef = useRef(null);
  const [form, setForm] = useState(() => ({
    id: item?.id || '',
    category_id: item?.category_id || defaultCategoryId || categories[0]?.id || '',
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || '',
    price_num: item?.price_num ?? 0,
    tags: (item?.tags || []).join(', '),
    image_url: item?.image_url || '',
    is_active: item?.is_active ?? true,
    is_featured: item?.is_featured ?? false,
  }));
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const setF = (patch) => setForm((f) => ({ ...f, ...patch }));

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setLocalError(null);
    try {
      const targetId = form.id || slugify(form.name) || 'unnamed';
      const url = await uploadMenuImage(targetId, file);
      setF({ image_url: url });
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (!form.name.trim() || !form.price.trim()) {
      setLocalError('Name and price are required.');
      return;
    }
    const payload = {
      ...(mode === 'edit' ? { id: form.id } : {}),
      id: form.id || slugify(form.name),
      category_id: form.category_id,
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: form.price.trim(),
      price_num: Number(form.price_num) || 0,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      image_url: form.image_url?.trim() || null,
      is_active: form.is_active,
      is_featured: form.is_featured,
    };
    setBusy(true);
    await onSave(payload);
    setBusy(false);
  };

  return (
    <>
      <motion.div
        key="bd"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[55] bg-leaf-950/40 backdrop-blur-sm"
      />
      <motion.aside
        key="dr"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-lg flex-col bg-cream-50 shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <header className="flex items-center justify-between border-b border-leaf-100 bg-white px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-leaf-600">
              {mode === 'new' ? 'New item' : 'Edit item'}
            </p>
            <h2 className="heading-display text-xl">
              {form.name || 'Untitled dish'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-leaf-700 transition-colors hover:bg-leaf-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <form onSubmit={submit} className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex-1 space-y-5 p-6">
            {/* Image */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-leaf-700">Photo</p>
              <div className="mt-2 flex items-center gap-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-leaf-50 ring-1 ring-leaf-100">
                  {form.image_url ? (
                    <img src={form.image_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-leaf-400">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={onFile}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="btn-ghost !py-2 !px-4 !text-xs"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Uploading…
                      </>
                    ) : form.image_url ? (
                      'Replace photo'
                    ) : (
                      'Upload photo'
                    )}
                  </button>
                  {form.image_url && (
                    <button
                      type="button"
                      onClick={() => setF({ image_url: '' })}
                      className="text-[11px] text-leaf-600 hover:text-leaf-800"
                    >
                      Remove photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            <Field
              label="Category"
              as="select"
              value={form.category_id}
              onChange={(e) => setF({ category_id: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon ? `${c.icon} ` : ''}
                  {c.name}
                </option>
              ))}
            </Field>

            <Field label="Name" value={form.name} onChange={(e) => setF({ name: e.target.value })} />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Display price"
                placeholder="₹240"
                value={form.price}
                onChange={(e) => setF({ price: e.target.value })}
              />
              <Field
                label="Numeric price (₹)"
                type="number"
                inputMode="numeric"
                value={form.price_num}
                onChange={(e) => setF({ price_num: e.target.value })}
              />
            </div>

            <Field
              label="Description"
              as="textarea"
              rows={3}
              value={form.description}
              onChange={(e) => setF({ description: e.target.value })}
              placeholder="Optional — a line or two about the dish"
            />

            <Field
              label="Tags (comma-separated)"
              value={form.tags}
              onChange={(e) => setF({ tags: e.target.value })}
              placeholder="Bestseller, Signature, Tandoor"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <Toggle
                label="Active (visible to customers)"
                value={form.is_active}
                onChange={(v) => setF({ is_active: v })}
              />
              <Toggle
                label="Featured on home page"
                value={form.is_featured}
                onChange={(v) => setF({ is_featured: v })}
              />
            </div>

            {mode === 'new' && (
              <Field
                label="ID (slug — auto from name if blank)"
                value={form.id}
                onChange={(e) => setF({ id: e.target.value })}
                placeholder={form.name ? slugify(form.name) : 'auto'}
              />
            )}

            {localError && (
              <div className="flex items-start gap-2 rounded-2xl bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{localError}</span>
              </div>
            )}
          </div>

          <footer className="flex items-center justify-between gap-2 border-t border-leaf-100 bg-white px-6 py-4">
            {onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            ) : (
              <span />
            )}
            <button type="submit" disabled={busy} className="btn-primary !py-2.5">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {mode === 'new' ? 'Create item' : 'Save changes'}
            </button>
          </footer>
        </form>
      </motion.aside>
    </>
  );
}

function Field({ label, as = 'input', children, ...rest }) {
  const className =
    'mt-1.5 w-full rounded-2xl border border-leaf-200 bg-white px-4 py-2.5 text-sm text-leaf-900 outline-none transition-colors focus:border-leaf-400';
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-leaf-700">{label}</span>
      {as === 'textarea' ? (
        <textarea {...rest} className={className} />
      ) : as === 'select' ? (
        <select {...rest} className={className}>
          {children}
        </select>
      ) : (
        <input {...rest} className={className} />
      )}
    </label>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
        value
          ? 'border-leaf-400 bg-leaf-50 text-leaf-900'
          : 'border-leaf-200 bg-white text-leaf-700'
      }`}
    >
      <span>{label}</span>
      <span
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
          value ? 'bg-leaf-600' : 'bg-leaf-200'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
            value ? 'translate-x-4' : 'translate-x-1'
          }`}
        />
      </span>
    </button>
  );
}

function prettyField(field) {
  return field === 'is_active' ? 'Visibility' : 'Featured';
}

function slugify(s) {
  return (s || '')
    .toString()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}
