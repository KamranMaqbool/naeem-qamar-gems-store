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
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(null);

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

  const remove = (category) => { setDeleteError(''); setDeleteTarget(category); };
  const confirmRemove = async () => {
    if (!deleteTarget) return;
    setDeleting(deleteTarget.id);
    try { await deleteCategory(deleteTarget.id); setCategories((current) => current.filter((category) => category.id !== deleteTarget.id)); setDeleteTarget(null); }
    catch (removeError) { setDeleteError(removeError.message || 'Unable to delete category.'); }
    finally { setDeleting(null); }
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-8"><h1 className="text-3xl font-bold text-on-surface">Categories</h1><p className="mt-1 text-on-surface-variant">Organize products with manageable catalog categories.</p></div>
      {error && <div className="mb-5 rounded-lg border border-error/30 bg-error-bg px-4 py-3 text-sm text-error-text" role="alert">{error}</div>}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="card overflow-hidden">
          <div className="border-b border-surface-container-highest p-4"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search categories..." className="w-full rounded-lg border border-outline-variant px-3 py-2" /></div>
          {loading ? <p className="p-10 text-center text-on-surface-variant">Loading categories…</p> : categories.length === 0 ? <p className="p-10 text-center text-on-surface-variant">No categories found.</p> : <div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-surface-container-low text-xs uppercase"><tr><th className="p-4">Name</th><th className="p-4">Slug</th><th className="p-4 text-right">Actions</th></tr></thead><tbody>{categories.map((category) => <tr key={category.id} className="border-t border-surface-container-highest"><td className="p-4 font-medium">{category.name}</td><td className="p-4 text-sm text-on-surface-variant">{category.slug}</td><td className="p-4 text-right"><div className="flex items-center justify-end gap-1"><div className="group/action relative"><button onClick={() => { setEditingId(category.id); setForm({ name: category.name, slug: category.slug, description: category.description || '' }); }} className="rounded-md px-3 py-2 text-primary hover:bg-surface-container-low" aria-label="Edit category"><span className="material-symbols-outlined">edit</span><span className="pointer-events-none absolute bottom-full right-0 z-10 mb-2 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover/action:opacity-100">Edit category</span></button></div><div className="group/action relative"><button onClick={() => remove(category)} className="rounded-md px-3 py-2 text-error hover:bg-error-bg" aria-label="Delete category"><span className="material-symbols-outlined">delete</span><span className="pointer-events-none absolute bottom-full right-0 z-10 mb-2 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover/action:opacity-100">Delete category</span></button></div></div></td></tr>)}</tbody></table></div>}
        </section>
        <form onSubmit={submit} className="card h-fit space-y-4 p-6"><h2 className="text-xl font-semibold text-on-surface">{editingId ? 'Edit category' : 'Add category'}</h2><label className="block text-sm font-medium">Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 w-full rounded-lg border border-outline-variant px-3 py-2" /></label><label className="block text-sm font-medium">Slug<input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} className="mt-2 w-full rounded-lg border border-outline-variant px-3 py-2" /></label><label className="block text-sm font-medium">Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-2 w-full rounded-lg border border-outline-variant px-3 py-2" /></label><button disabled={saving} className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-on-primary disabled:opacity-60">{saving ? 'Saving…' : editingId ? 'Update category' : 'Create category'}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="w-full py-2 text-sm text-on-surface-variant">Cancel</button>}</form>
      </div>
      {deleteTarget && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !deleting) setDeleteTarget(null); }}><div className="flex-none rounded-2xl bg-surface-container-lowest p-6 shadow-2xl" style={{ width: 'calc(100vw - 2rem)', maxWidth: '28rem' }} role="dialog" aria-modal="true" aria-labelledby="delete-category-title"><div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-error-bg text-error-text"><span className="material-symbols-outlined">delete_forever</span></div><div className="min-w-0 flex-1"><h2 id="delete-category-title" className="text-xl font-semibold text-on-surface">Delete category?</h2><p className="mt-2 text-sm leading-6 text-on-surface-variant">You are about to permanently delete <span className="font-semibold text-on-surface">{deleteTarget.name}</span>. This action cannot be undone.</p></div></div>{deleteError && <p className="mt-4 rounded-lg border border-error/30 bg-error-bg px-3 py-2 text-sm text-error-text">{deleteError}</p>}<div className="mt-6 flex justify-end gap-3"><button type="button" disabled={Boolean(deleting)} onClick={() => setDeleteTarget(null)} className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-low disabled:opacity-50">Cancel</button><button type="button" disabled={Boolean(deleting)} onClick={confirmRemove} className="rounded-lg bg-error px-4 py-2 text-sm font-semibold text-white hover:bg-error/90 disabled:cursor-wait disabled:opacity-60">{deleting ? 'Deleting…' : 'Delete category'}</button></div></div></div>}
    </div>
  );
}
