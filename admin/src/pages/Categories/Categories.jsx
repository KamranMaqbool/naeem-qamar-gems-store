import { useEffect, useState } from 'react';
import { createCategory, deleteCategory, fetchAdminCategories, updateCategory } from '../../lib/api';

const emptyForm = { name: '', slug: '', description: '' };

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchAdminCategories({ search });
        if (mounted) setCategories(data.results || data || []);
      } catch (loadError) {
        if (mounted) setError(loadError.message || 'Unable to load categories.');
      } finally { if (mounted) setLoading(false); }
    };
    load();
    return () => { mounted = false; };
  }, [search]);

  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    const slug = form.slug || form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    try {
      if (editingId) await updateCategory(editingId, { ...form, slug });
      else await createCategory({ ...form, slug });
      setForm(emptyForm); setEditingId(null);
      const data = await fetchAdminCategories({ search }); setCategories(data.results || data || []);
    } catch (submitError) { setError(submitError.message || 'Unable to save category.'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try { await deleteCategory(id); setCategories((current) => current.filter((category) => category.id !== id)); }
    catch (removeError) { setError(removeError.message || 'Unable to delete category.'); }
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-8"><h1 className="text-3xl font-bold text-on-surface">Categories</h1><p className="mt-1 text-on-surface-variant">Organize products with manageable catalog categories.</p></div>
      {error && <div className="mb-5 rounded-lg border border-error/30 bg-error-bg px-4 py-3 text-sm text-error-text" role="alert">{error}</div>}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="card overflow-hidden">
          <div className="border-b border-surface-container-highest p-4"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search categories..." className="w-full rounded-lg border border-outline-variant px-3 py-2" /></div>
          {loading ? <p className="p-10 text-center text-on-surface-variant">Loading categories…</p> : categories.length === 0 ? <p className="p-10 text-center text-on-surface-variant">No categories found.</p> : <div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-surface-container-low text-xs uppercase"><tr><th className="p-4">Name</th><th className="p-4">Slug</th><th className="p-4 text-right">Actions</th></tr></thead><tbody>{categories.map((category) => <tr key={category.id} className="border-t border-surface-container-highest"><td className="p-4 font-medium">{category.name}</td><td className="p-4 text-sm text-on-surface-variant">{category.slug}</td><td className="p-4 text-right"><button onClick={() => { setEditingId(category.id); setForm({ name: category.name, slug: category.slug, description: category.description || '' }); }} className="mr-3 text-primary">Edit</button><button onClick={() => remove(category.id)} className="text-error">Delete</button></td></tr>)}</tbody></table></div>}
        </section>
        <form onSubmit={submit} className="card h-fit space-y-4 p-6"><h2 className="text-xl font-semibold text-on-surface">{editingId ? 'Edit category' : 'Add category'}</h2><label className="block text-sm font-medium">Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 w-full rounded-lg border border-outline-variant px-3 py-2" /></label><label className="block text-sm font-medium">Slug<input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} className="mt-2 w-full rounded-lg border border-outline-variant px-3 py-2" /></label><label className="block text-sm font-medium">Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-2 w-full rounded-lg border border-outline-variant px-3 py-2" /></label><button disabled={saving} className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-on-primary disabled:opacity-60">{saving ? 'Saving…' : editingId ? 'Update category' : 'Create category'}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="w-full py-2 text-sm text-on-surface-variant">Cancel</button>}</form>
      </div>
    </div>
  );
}
