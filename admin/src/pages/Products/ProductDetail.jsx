import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchAdminOrders, fetchAdminProduct, fetchAdminProducts } from '../../lib/api';

const money = (value) => `$${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
const date = (value) => value ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
const mediaUrl = (value) => value?.replace(/^https?:\/\/backend:8000/, '') || '';

function DetailField({ label, value }) {
  return <div><dt className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">{label}</dt><dd className="mt-1 text-on-surface">{value || '—'}</dd></div>;
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadProduct() {
      setProduct(null); setOrders([]); setError('');
      try {
        let detail;
        if (/^\d+$/.test(id)) detail = await fetchAdminProduct(id);
        else {
          const data = await fetchAdminProducts({ search: id });
          const results = data.results || data;
          const identifier = id.toLowerCase();
          const match = results.find((item) => item.sku?.toLowerCase() === identifier || item.slug?.toLowerCase() === identifier);
          if (!match) throw new Error('Product not found.');
          detail = await fetchAdminProduct(match.id);
        }
        if (cancelled) return;
        setProduct(detail); setOrdersLoading(true);
        try {
          const orderData = await fetchAdminOrders({ product: detail.id });
          if (!cancelled) setOrders(orderData.results || orderData || []);
        } finally { if (!cancelled) setOrdersLoading(false); }
      } catch (e) { if (!cancelled) setError(e.message || 'Unable to load product.'); }
    }
    loadProduct();
    return () => { cancelled = true; };
  }, [id]);

  if (error) return <div className="mx-auto w-full max-w-6xl"><Link to="/products" className="mb-6 inline-flex items-center gap-1 text-sm text-primary"><span className="material-symbols-outlined">arrow_back</span>Back to products</Link><div className="rounded-lg border border-error/30 bg-error-bg p-6 text-error-text"><h1 className="text-xl font-semibold">Product unavailable</h1><p className="mt-2">{error}</p></div></div>;
  if (!product) return <div className="mx-auto w-full max-w-6xl py-16 text-center text-on-surface-variant">Loading product…</div>;

  const image = mediaUrl(product.images?.find((item) => item.is_primary)?.image_url || product.images?.[0]?.image_url);
  const attributes = product.gemstone_attributes || {};
  const statusClass = product.status === 'PUBLISHED' ? 'bg-success-bg text-success-text' : product.status === 'ARCHIVED' ? 'bg-error-bg text-error-text' : 'bg-warning-bg text-warning-text';

  return <div className="mx-auto w-full max-w-6xl">
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4"><div><Link to="/products" className="mb-3 inline-flex items-center gap-1 text-sm text-primary"><span className="material-symbols-outlined">arrow_back</span>Back to products</Link><h1 className="text-3xl font-bold text-on-surface">{product.title}</h1><p className="mt-1 font-mono text-sm text-on-surface-variant">{product.sku}</p></div><div className="flex gap-3"><Link to={`/products/${product.id}/edit`} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary">Edit product</Link><Link to={`/inventory?product=${product.id}`} className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-on-surface">Manage stock</Link></div></div>
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]"><section className="card p-5">{image ? <img src={image} alt={product.title} className="aspect-square w-full rounded-lg object-cover" /> : <div className="flex aspect-square items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant"><span className="material-symbols-outlined text-6xl">diamond</span></div>}<div className="mt-5 flex items-center justify-between"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>{product.status}</span><span className="font-semibold">Stock: {product.inventory_stock ?? 0}</span></div><div className="mt-4 border-t border-outline-variant pt-4 text-sm text-on-surface-variant"><p>Inventory status: <span className="font-medium text-on-surface">{product.inventory_status || '—'}</span></p><p className="mt-1">Featured: <span className="font-medium text-on-surface">{product.is_featured ? 'Yes' : 'No'}</span></p></div></section><section className="card p-6"><h2 className="mb-5 text-xl font-semibold">Product details</h2><dl className="grid gap-5 sm:grid-cols-2"><DetailField label="Category" value={product.category_name || product.category?.name || product.category} /><DetailField label="Slug" value={product.slug} /><DetailField label="Regular price" value={money(product.base_price)} /><DetailField label="Sale price" value={product.sale_price ? money(product.sale_price) : 'No sale price'} /><DetailField label="Created" value={date(product.created_at)} /><DetailField label="Last updated" value={date(product.updated_at)} /><DetailField label="Tags" value={product.tags} /><div className="sm:col-span-2"><dt className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Description</dt><dd className="mt-1 whitespace-pre-wrap text-on-surface-variant">{product.description || 'No description provided.'}</dd></div></dl></section></div>
    <section className="card mt-6 p-6"><h2 className="mb-5 text-xl font-semibold">Gemstone specifications</h2><dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><DetailField label="Carat weight" value={attributes.carat_weight ? `${attributes.carat_weight} ct` : null} /><DetailField label="Cut / shape" value={attributes.cut_shape} /><DetailField label="Color grade" value={attributes.color_grade} /><DetailField label="Clarity grade" value={attributes.clarity_grade} /><DetailField label="Origin" value={attributes.origin_country} /><DetailField label="Precious metal" value={attributes.precious_metal} /><DetailField label="Treatment" value={attributes.treatment} /><DetailField label="Certification lab" value={attributes.certification_lab} /><DetailField label="Certificate number" value={attributes.lab_certification_number} /></dl></section>
    <section className="card mt-6 overflow-hidden"><div className="border-b border-outline-variant px-6 py-5"><h2 className="text-xl font-semibold">Product images</h2><p className="mt-1 text-sm text-on-surface-variant">{product.images?.length || 0} image(s) attached to this product.</p></div>{product.images?.length ? <div className="grid gap-4 p-6 sm:grid-cols-3 lg:grid-cols-5">{product.images.map((item) => <div key={item.id || item.image_url} className="relative"><img src={mediaUrl(item.image_url)} alt={item.alt_text || product.title} className="aspect-square w-full rounded-lg object-cover" />{item.is_primary && <span className="absolute bottom-2 left-2 rounded bg-primary px-2 py-1 text-xs text-on-primary">Primary</span>}</div>)}</div> : <p className="p-6 text-sm text-on-surface-variant">No images uploaded.</p>}</section>
    <section className="card mt-6 overflow-hidden"><div className="border-b border-outline-variant px-6 py-5"><h2 className="text-xl font-semibold">Orders containing this product</h2><p className="mt-1 text-sm text-on-surface-variant">A history of customers who purchased this product.</p></div>{ordersLoading ? <p className="p-6 text-sm text-on-surface-variant">Loading order history…</p> : orders.length === 0 ? <p className="p-6 text-sm text-on-surface-variant">No orders have included this product yet.</p> : <div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-surface-container-low"><tr><th className="px-6 py-3 text-xs uppercase tracking-wide text-on-surface-variant">Order</th><th className="px-6 py-3 text-xs uppercase tracking-wide text-on-surface-variant">Customer</th><th className="px-6 py-3 text-xs uppercase tracking-wide text-on-surface-variant">Date</th><th className="px-6 py-3 text-xs uppercase tracking-wide text-on-surface-variant">Qty</th><th className="px-6 py-3 text-xs uppercase tracking-wide text-on-surface-variant">Line total</th><th className="px-6 py-3 text-xs uppercase tracking-wide text-on-surface-variant">Status</th></tr></thead><tbody>{orders.map((order) => { const item = order.items?.find((entry) => String(entry.product) === String(product.id)); const customer = order.customer_name || order.customer_email || 'Guest'; return <tr key={order.id} className="border-t border-outline-variant"><td className="px-6 py-4"><Link to={`/orders/${order.id}`} className="font-semibold text-primary hover:underline">{order.order_number}</Link></td><td className="px-6 py-4">{customer}</td><td className="px-6 py-4 text-sm text-on-surface-variant">{date(order.created_at)}</td><td className="px-6 py-4">{item?.quantity ?? '—'}</td><td className="px-6 py-4">{item ? money(Number(item.unit_price_at_purchase) * item.quantity) : money(order.total_amount)}</td><td className="px-6 py-4"><span className="rounded-full bg-surface-container-low px-2.5 py-1 text-xs font-semibold">{order.order_status}</span></td></tr>; })}</tbody></table></div>}</section>
  </div>;
}
