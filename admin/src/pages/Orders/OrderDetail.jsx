import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderDetail, statusOptions, statusConfig } from '../../data/orders';
import { fetchAdminOrder, isAuthenticated, login, updateOrder } from '../../lib/api';

export default function OrderDetail() {
  const { id } = useParams();
  const [status, setStatus] = useState(orderDetail.status);
  const [order, setOrder] = useState(orderDetail);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      try {
        if (!isAuthenticated()) await login('admin@virtuoso-gems.com', 'admin123');
        const data = await fetchAdminOrder(id);
        const address = data.shipping_address || {};
        const mapped = {
          ...orderDetail,
          id: `#${data.order_number}`,
          status: data.order_status?.toLowerCase() || 'pending',
          date: new Date(data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          customer: { name: data.user?.username || data.guest_email || 'Guest', email: data.user?.email || data.guest_email || '', phone: data.guest_phone || '' },
          shipping: { name: data.user?.username || data.guest_email || 'Guest', address1: address.address1 || address.street || '', address2: address.address2 || '', city: address.city || '', state: address.state || '', zip: address.zip || address.postal_code || '', country: address.country || '' },
          items: (data.items || []).map((item) => ({ id: item.id, name: item.product_title, category: '', unitPrice: Number(item.unit_price_at_purchase), quantity: item.quantity, total: Number(item.unit_price_at_purchase) * item.quantity })),
          summary: { subtotal: Number(data.subtotal || 0), shipping: Number(data.shipping_cost || 0), tax: Number(data.tax_amount || 0), total: Number(data.total_amount || 0) },
        };
        setOrder(mapped);
        setStatus(mapped.status);
      } catch {
        // Keep the static preview if the API is unavailable.
      }
    }
    loadOrder();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleUpdateOrder = async () => {
    setSaving(true);
    try {
      if (!isAuthenticated()) await login('admin@virtuoso-gems.com', 'admin123');
      await updateOrder(id, { order_status: status.toUpperCase() });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <main>
        <div className="max-w-[1440px] mx-auto p-6 md:p-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-on-surface-variant text-[12px] leading-[16px] font-semibold uppercase tracking-wider mb-2">
                <Link className="hover:text-primary transition-colors" to="/orders">Orders</Link>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span className="text-on-surface">{order.id}</span>
              </div>
              <div className="flex items-center gap-4">
                <h2 className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-on-surface">{order.id}</h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full ${statusConfig[order.status]?.className || 'bg-secondary/10 text-secondary'} text-[12px] leading-[16px] font-semibold uppercase tracking-wider`}>
                  {statusConfig[order.status]?.label || order.status}
                </span>
              </div>
              <p className="text-[14px] leading-[20px] text-on-surface-variant mt-1">Placed on {order.date}</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-outline-variant text-on-surface text-[12px] leading-[16px] font-semibold uppercase tracking-wider rounded hover:bg-surface-container-low transition-colors shadow-sm">
                Print Packing Slip
              </button>
            </div>
          </div>

          {/* Asymmetric Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Items & Total (Col Span 2) */}
            <div className="lg:col-span-2 min-w-0 space-y-6">
              {/* Items Card */}
              <div className="card min-w-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-surface-variant">
                  <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface">Order Items</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left border-collapse">
                    <thead className="bg-surface-container-low text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant border-b border-surface-variant">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Product</th>
                        <th className="px-6 py-4 font-semibold">Category</th>
                        <th className="px-6 py-4 font-semibold text-right">Unit Price</th>
                        <th className="px-6 py-4 font-semibold text-center">Qty</th>
                        <th className="px-6 py-4 font-semibold text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-variant">
                      {order.items.map((item) => (
                        <tr key={item.id} className="hover:bg-surface-bright transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <img
                                className="w-12 h-12 rounded object-cover border border-outline-variant shadow-sm"
                                src={item.image}
                                alt={item.name}
                              />
                              <span className="font-medium text-on-surface">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-on-surface-variant">{item.category}</td>
                          <td className="px-6 py-4 text-right text-on-surface">{formatPrice(item.unitPrice)}</td>
                          <td className="px-6 py-4 text-center text-on-surface">{item.quantity}</td>
                          <td className="px-6 py-4 text-right font-medium text-on-surface">{formatPrice(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Summary Section */}
                <div className="px-6 py-6 bg-surface-bright border-t border-surface-variant">
                  <div className="flex justify-end">
                    <div className="w-full max-w-sm space-y-3">
                      <div className="flex items-center justify-between gap-6 text-on-surface-variant">
                        <span>Subtotal</span>
                        <span className="text-on-surface">{formatPrice(order.summary.subtotal)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-6 text-on-surface-variant">
                        <span>Shipping (Insured Overnight)</span>
                        <span className="text-on-surface">{formatPrice(order.summary.shipping)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-6 text-on-surface-variant">
                        <span>Tax (8.5%)</span>
                        <span className="text-on-surface">{formatPrice(order.summary.tax)}</span>
                      </div>
                      <div className="pt-4 border-t border-surface-variant flex justify-between items-center">
                        <span className="text-[20px] leading-[28px] font-semibold text-on-surface">Total</span>
                        <span className="text-[20px] leading-[28px] font-semibold text-primary">{formatPrice(order.summary.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Customer & Actions (Col Span 1) */}
            <div className="lg:col-span-1 space-y-6">
              {/* Customer Info Card */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface">Customer</h3>
                  <span className="material-symbols-outlined text-on-surface-variant">person</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-on-surface">{order.customer.name}</p>
                    <p className="text-on-surface-variant mt-1">{order.customer.email}</p>
                    <p className="text-on-surface-variant">{order.customer.phone}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Info Card */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface">Shipping Address</h3>
                  <span className="material-symbols-outlined text-on-surface-variant">local_shipping</span>
                </div>
                <div className="text-on-surface-variant">
                  <p className="font-medium text-on-surface mb-1">{order.shipping.name}</p>
                  <p>{order.shipping.address1}</p>
                  <p>{order.shipping.address2}</p>
                  <p>{order.shipping.city}, {order.shipping.state} {order.shipping.zip}</p>
                  <p>{order.shipping.country}</p>
                </div>
              </div>

              {/* Fulfillment Actions Card */}
              <div className="card p-6">
                <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface mb-4">Fulfillment</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Status</label>
                    <div className="relative">
                      <select
                        value={status}
                        onChange={handleStatusChange}
                        className="w-full appearance-none bg-surface border border-outline-variant text-on-surface rounded px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary pr-10"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
                    </div>
                  </div>
                  <button
                    onClick={handleUpdateOrder}
                    disabled={saving}
                    className="w-full px-4 py-3 bg-primary text-on-primary text-[12px] leading-[16px] font-semibold uppercase tracking-wider rounded hover:bg-primary-container transition-colors shadow-sm flex justify-center items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    {saving ? 'Saving...' : 'Update Order'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
