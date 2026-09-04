import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchInventory, isAuthenticated, login, receiveStock } from '../../lib/api';
import { inventoryItems as fallbackItems } from '../../data/inventory';

const inputClass = 'mt-2 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10';

export default function ReceiveStock() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({ productId: '', quantity: 1, reason: 'RECEIVE_STOCK', notes: '' });

  useEffect(() => {
    async function loadItems() {
      try {
        if (!isAuthenticated()) await login('admin@virtuoso-gems.com', 'admin123');
        const data = await fetchInventory();
        setItems(data.results || data);
      } catch {
        setItems(fallbackItems.map((item) => ({ id: item.id, product: item.id, product_title: item.name, product_sku: item.sku, current_stock: item.stock })));
      } finally {
        setLoading(false);
      }
    }
    loadItems();
  }, []);

  const selected = useMemo(() => items.find((item) => String(item.product) === String(form.productId)), [items, form.productId]);
  const update = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      if (!form.productId) throw new Error('Select a product first.');
      await receiveStock({ product_id: Number(form.productId), quantity: Number(form.quantity), reason: form.reason, notes: form.notes });
      setMessage({ type: 'success', text: 'Stock received and inventory updated successfully.' });
      setForm((prev) => ({ ...prev, quantity: 1, notes: '' }));
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Unable to receive stock.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-8">
        <Link to="/inventory" className="mb-3 inline-flex items-center gap-1 text-sm text-primary hover:text-primary-container"><span className="material-symbols-outlined text-lg">arrow_back</span>Back to inventory</Link>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">Receive Stock</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Add incoming units to a product and keep an auditable stock record.</p>
      </div>

      {message && <div className={`mb-6 rounded-lg border px-4 py-3 text-sm ${message.type === 'success' ? 'border-success/30 bg-success-bg text-success-text' : 'border-error/30 bg-error-bg text-error-text'}`}>{message.text}</div>}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <section className="card p-6">
          <h2 className="text-xl font-semibold text-on-surface">Stock receipt details</h2>
          <p className="mt-1 text-sm text-on-surface-variant">All fields marked required must be completed.</p>
          <div className="mt-6 space-y-5">
            <label className="block text-sm font-medium text-on-surface">Product <select className={inputClass} name="productId" value={form.productId} onChange={update} required><option value="" disabled>{loading ? 'Loading products...' : 'Select a product'}</option>{items.map((item) => <option key={item.id} value={item.product}>{item.product_title || item.name} {item.product_sku ? `(${item.product_sku})` : ''}</option>)}</select></label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-on-surface">Quantity received <input className={inputClass} name="quantity" type="number" min="1" step="1" value={form.quantity} onChange={update} required /></label>
              <label className="block text-sm font-medium text-on-surface">Receipt reason <select className={inputClass} name="reason" value={form.reason} onChange={update}><option value="RECEIVE_STOCK">New stock received</option><option value="RETURN">Customer return</option><option value="MANUAL_ADJUSTMENT">Manual adjustment</option></select></label>
            </div>
            <label className="block text-sm font-medium text-on-surface">Notes <textarea className={`${inputClass} min-h-32 resize-y`} name="notes" value={form.notes} onChange={update} placeholder="Supplier, invoice number, or condition notes" /></label>
          </div>
          <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-surface-container-highest pt-5"><button type="button" onClick={() => navigate('/inventory')} className="rounded-lg px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low">Cancel</button><button type="submit" disabled={saving || loading} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary shadow-resting hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"><span className="material-symbols-outlined text-lg">inventory</span>{saving ? 'Saving...' : 'Receive stock'}</button></div>
        </section>
        <aside className="card h-fit p-6 lg:sticky lg:top-24"><h2 className="text-lg font-semibold text-on-surface">Current stock</h2><div className="mt-5 rounded-lg bg-surface-container-low p-4"><p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Selected product</p><p className="mt-2 font-medium text-on-surface">{selected?.product_title || selected?.name || 'None selected'}</p><p className="mt-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Current units</p><p className="mt-1 text-3xl font-bold text-primary">{selected?.current_stock ?? selected?.stock ?? '—'}</p></div><p className="mt-4 text-xs leading-5 text-on-surface-variant">Receiving stock increases the current quantity and creates a stock-log entry for reporting.</p></aside>
      </form>
    </div>
  );
}
