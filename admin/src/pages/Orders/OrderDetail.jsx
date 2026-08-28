import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderDetail, statusOptions, statusConfig } from '../../data/orders';

export default function OrderDetail() {
  const { id } = useParams();
  const [status, setStatus] = useState(orderDetail.status);

  const order = orderDetail;

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

  const handleUpdateOrder = () => {
    // In a real app, this would call an API
    alert(`Order status updated to: ${status}`);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* SideNavBar */}
      <aside className="bg-primary text-on-primary/70 h-screen w-64 fixed left-0 top-0 border-r border-outline-variant shadow-md flex flex-col h-full py-6 z-20">
        <div className="px-6 mb-8">
          <h1 className="text-[20px] leading-[28px] font-bold tracking-tight">VIRTUOSO'S GEMS</h1>
          <p className="text-on-primary/70 text-[12px] leading-[16px] font-semibold uppercase tracking-wider mt-1">Luxury Admin</p>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer active:scale-95" href="/">
            <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
            Dashboard
          </a>
          <a className="flex items-center gap-3 px-4 py-3 bg-secondary-container/10 text-secondary-fixed border-l-4 border-secondary-fixed cursor-pointer active:scale-95" href="/orders">
            <span className="material-symbols-outlined" data-icon="shopping_cart">shopping_cart</span>
            Orders
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer active:scale-95" href="/products">
            <span className="material-symbols-outlined" data-icon="save_as">save_as</span>
            Products
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer active:scale-95" href="/inventory">
            <span className="material-symbols-outlined" data-icon="inventory_2">inventory_2</span>
            Inventory
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer active:scale-95" href="/discounts">
            <span className="material-symbols-outlined" data-icon="sell">sell</span>
            Discounts
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer active:scale-95" href="/settings">
            <span className="material-symbols-outlined" data-icon="settings">settings</span>
            Settings
          </a>
        </nav>
      </aside>

      {/* TopNavBar */}
      <header className="bg-surface-container-lowest text-primary fixed top-0 right-0 left-64 h-16 border-b border-surface-container-highest shadow-sm flex justify-between items-center px-6 z-10 transition-all duration-200">
        <div className="flex items-center gap-4 w-1/3">
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input className="w-full pl-10 pr-4 py-2 bg-surface rounded-full border border-surface-container-highest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface" placeholder="Search orders, customers..." type="text" />
          </div>
        </div>
        <div className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-on-surface absolute left-1/2 -translate-x-1/2">
          Admin Dashboard
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors duration-200" aria-label="Notifications">
            <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors duration-200" aria-label="Account">
            <span className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="ml-64 pt-16 min-h-screen">
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
            <div className="lg:col-span-2 space-y-6">
              {/* Items Card */}
              <div className="card overflow-hidden">
                <div className="px-6 py-4 border-b border-surface-variant">
                  <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface">Order Items</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
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
                      <div className="flex justify-between text-on-surface-variant">
                        <span>Subtotal</span>
                        <span className="text-on-surface">{formatPrice(order.summary.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-on-surface-variant">
                        <span>Shipping (Insured Overnight)</span>
                        <span className="text-on-surface">{formatPrice(order.summary.shipping)}</span>
                      </div>
                      <div className="flex justify-between text-on-surface-variant">
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
                    className="w-full px-4 py-3 bg-primary text-on-primary text-[12px] leading-[16px] font-semibold uppercase tracking-wider rounded hover:bg-primary-container transition-colors shadow-sm flex justify-center items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    Update Order
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

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price);
}