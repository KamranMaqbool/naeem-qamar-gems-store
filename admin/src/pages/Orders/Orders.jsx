import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { orders, statusConfig } from '../../data/orders';

export default function Orders() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !status || order.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-on-surface">Orders</h1>
          <p className="text-[16px] leading-[24px] text-on-surface-variant mt-1">Manage and track customer orders.</p>
        </div>
        <button className="px-4 py-2 bg-primary-container text-white rounded-md text-[12px] leading-[16px] font-semibold uppercase tracking-wider hover:bg-primary transition-colors shadow-resting flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          New Order
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-md text-[14px] leading-[20px] focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/10"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-surface-container-low border border-outline-variant text-on-surface-variant text-[12px] leading-[16px] font-semibold uppercase tracking-wider rounded-md px-4 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F1F5F9] border-b border-surface-container-highest">
                <th className="py-3 px-6 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">Order ID</th>
                <th className="py-3 px-6 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">Customer</th>
                <th className="py-3 px-6 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">Date</th>
                <th className="py-3 px-6 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">Items</th>
                <th className="py-3 px-6 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">Amount</th>
                <th className="py-3 px-6 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">Status</th>
                <th className="py-3 px-6 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-[#F1F5F9] hover:bg-surface-bright transition-colors group">
                  <td className="py-4 px-6 font-mono text-[13px] leading-[18px] font-medium text-primary-container">
                    <Link to={`/orders/${order.id}`} className="hover:text-primary transition-colors">
                      {order.id}
                    </Link>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold text-xs">
                        {order.customer.initials}
                      </div>
                      <div>
                        <p className="font-medium text-on-surface">{order.customer.name}</p>
                        <p className="text-[12px] leading-[16px] text-on-surface-variant">{order.customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-on-surface-variant">{order.date}</td>
                  <td className="py-4 px-6 text-on-surface">{order.items}</td>
                  <td className="py-4 px-6 font-medium text-on-surface">{order.amount}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusConfig[order.status]?.className || ''}`}>
                      {statusConfig[order.status]?.label || order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link to={`/orders/${order.id}`} className="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-on-surface-variant/30 text-6xl mb-4 block">shopping_cart</span>
            <p className="text-[16px] leading-[24px] text-on-surface-variant">No orders found</p>
            <p className="text-[14px] leading-[20px] text-on-surface-variant/70 mt-1">Try adjusting your filters or search term</p>
          </div>
        )}
        <div className="px-6 py-4 border-t border-surface-container-highest bg-white flex items-center justify-between">
          <span className="text-[14px] leading-[20px] text-sm text-on-surface-variant">Showing 1 to {filteredOrders.length} of {orders.length} entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-outline-variant rounded-md text-sm text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 bg-primary-container text-white rounded-md text-sm shadow-sm">1</button>
            <button className="px-3 py-1 border border-outline-variant rounded-md text-sm text-on-surface hover:bg-surface-container-low">2</button>
            <button className="px-3 py-1 border border-outline-variant rounded-md text-sm text-on-surface hover:bg-surface-container-low">3</button>
            <button className="px-3 py-1 border border-outline-variant rounded-md text-sm text-on-surface hover:bg-surface-container-low">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}