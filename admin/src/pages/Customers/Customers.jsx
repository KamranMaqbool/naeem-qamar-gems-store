import { useState, useRef, useEffect } from 'react';
import { customers, kpiCards, filterOptions } from '../../data/customers';
import { fetchAdminCustomer, fetchAdminCustomers, isAuthenticated, login } from '../../lib/api';

export default function Customers() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  const drawerRef = useRef(null);
  const [search, setSearch] = useState('');
  const [vipFilter, setVipFilter] = useState('');
  const [customerList, setCustomerList] = useState(customers);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(customers.length);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCustomers() {
      try {
        if (!isAuthenticated()) await login('admin@virtuoso-gems.com', 'admin123');
        const data = await fetchAdminCustomers({ search, isVip: vipFilter, page });
        const rows = (data.results || data).map((item) => ({ ...item, name: item.username, email: item.email, phone: item.phone_number, tier: item.is_vip ? 'VIP' : 'Standard', totalSpend: Number(item.total_lifetime_spend || 0), orders: item.orders_count || 0, lastOrder: item.last_order || '-', status: 'active', initials: item.username?.slice(0, 2).toUpperCase() || 'CU' }));
        setCustomerList(rows); setTotalCustomers(data.count ?? rows.length); setTotalPages(data.count ? Math.max(1, Math.ceil(data.count / 20)) : 1);
      } catch (loadError) { setError(loadError.message || 'Unable to load customers.'); }
      finally { setLoading(false); }
    }
    loadCustomers();
  }, [search, vipFilter, page]);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const openDrawer = async (customer) => {
    setSelectedCustomer(customer);
    setDrawerOpen(true);
    try {
      const detail = await fetchAdminCustomer(customer.id);
      setSelectedCustomer((current) => ({ ...current, ...detail, name: detail.username, email: detail.email, phone: detail.phone_number, address: detail.addresses?.[0] ? `${detail.addresses[0].street_address}\n${detail.addresses[0].city}` : current.address, notes: detail.notes?.[0]?.content || current.notes }));
    } catch { /* Keep list data in the drawer when detail is unavailable. */ }
  };

  const exportCsv = () => {
    const rows = [['Customer', 'Email', 'Phone', 'VIP', 'Lifetime Spend'], ...customerList.map((customer) => [customer.name, customer.email, customer.phone, customer.tier, customer.totalSpend])];
    const csv = rows.map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); link.download = 'customers.csv'; link.click(); URL.revokeObjectURL(link.href);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const getStatusConfig = (status) => {
    const configs = {
      active: { label: 'Active', className: 'bg-success-bg text-success-text' },
      inactive: { label: 'Inactive', className: 'bg-warning-bg text-warning-text' },
      blocked: { label: 'Blocked', className: 'bg-error-bg text-error-text' },
    };
    return configs[status] || { label: status, className: '' };
  };

  return (
    <div className="relative">
      <div className={`flex flex-col gap-6 min-w-0 transition-[margin] duration-300 ${drawerOpen ? 'mr-96' : ''}`}>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-on-surface">Customers</h1>
                <p className="text-[14px] leading-[20px] text-on-surface-variant mt-1">Manage client relationships and purchase history.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative hidden md:block"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span><input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search customers..." className="w-52 rounded-md border border-outline-variant bg-surface-container-lowest py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none" /></div>
                <div className="relative">
                  <select value={vipFilter} onChange={(e) => { setVipFilter(e.target.value); setPage(1); }} className="appearance-none bg-surface-container-lowest border border-outline-variant rounded-md pl-4 pr-10 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm">
                    {filterOptions.map((option) => <option key={option.value} value={option.value === 'vip' ? 'true' : ''}>{option.label}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">arrow_drop_down</span>
                </div>
                <button type="button" onClick={exportCsv} className="bg-surface-container-lowest border border-outline-variant text-on-surface px-4 py-2 rounded-md text-[12px] leading-[16px] font-semibold uppercase tracking-wider hover:bg-surface-container-low transition-colors shadow-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Export (CSV)
                </button>
              </div>
            </div>

            {error && <div className="rounded-lg border border-error/30 bg-error-bg px-4 py-3 text-sm text-error-text">{error}</div>}
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {kpiCards.map((kpi, index) => (
                    <div key={index} className="bg-surface-container-lowest p-6 rounded-xl border border-surface-container-highest shadow-[0px_1px_3px_rgba(0,0,0,0.05),0px_1px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.08)] transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">{kpi.label}</span>
                    <div className="w-8 h-8 rounded-full bg-primary-container/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]" style={{ color: `var(--color-${kpi.iconColor})` }}>{kpi.icon}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-on-surface">{kpi.value}</div>
                    <div className="flex items-center gap-1 mt-2 text-primary">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span>
                      <span className="text-[12px] leading-[16px] font-semibold">{kpi.change}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Data Table Section */}
            <div className="card flex-1 flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b border-surface-container-highest flex justify-between items-center bg-[#F1F5F9]">
                <h3 className="text-[12px] leading-[16px] font-semibold uppercase tracking-widest text-on-surface-variant">Client Directory</h3>
                <button className="text-primary hover:text-primary-container text-[12px] leading-[16px] font-semibold flex items-center gap-1">
                  View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F1F5F9] border-b border-surface-container-highest">
                      <th className="px-6 py-3 text-[12px] leading-[16px] font-semibold uppercase tracking-widest text-on-surface-variant">Customer</th>
                      <th className="px-6 py-3 text-[12px] leading-[16px] font-semibold uppercase tracking-widest text-on-surface-variant">Contact</th>
                      <th className="px-6 py-3 text-[12px] leading-[16px] font-semibold uppercase tracking-widest text-on-surface-variant text-right">Orders</th>
                      <th className="px-6 py-3 text-[12px] leading-[16px] font-semibold uppercase tracking-widest text-on-surface-variant text-right">Total Spend</th>
                      <th className="px-6 py-3 text-[12px] leading-[16px] font-semibold uppercase tracking-widest text-on-surface-variant">Last Order</th>
                      <th className="px-6 py-3 text-[12px] leading-[16px] font-semibold uppercase tracking-widest text-on-surface-variant text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {loading ? <tr><td colSpan="6" className="py-12 text-center text-on-surface-variant">Loading customers...</td></tr> : customerList.map((customer, index) => {
                      const status = customer.status || 'active';
                      const config = getStatusConfig(status);

                      return (
                        <tr
                          key={customer.id}
                          className={`hover:bg-surface-container-low transition-colors cursor-pointer ${index === 0 ? 'bg-surface-container-low' : ''}`}
                          onClick={() => openDrawer(customer)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {customer.avatar ? (
                                <img
                                  className="w-10 h-10 rounded-full object-cover border border-outline-variant/30"
                                  src={customer.avatar}
                                  alt={customer.name}
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center font-bold">
                                  {customer.initials || customer.name.charAt(0)}
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{customer.name}</div>
                                <div className="text-[12px] text-on-surface-variant">{customer.tier}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span>{customer.email}</span>
                              <span className="text-on-surface-variant text-[12px]">{customer.phone}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-[13px] leading-[18px]">{customer.orders}</td>
                          <td className="px-6 py-4 text-right font-mono text-[13px] leading-[18px]">{customer.totalSpend.toLocaleString()} PKR</td>
                          <td className="px-6 py-4 text-on-surface-variant text-[13px]">{customer.lastOrder}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
                              {config.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-surface-container-highest px-6 py-4"><span className="text-sm text-on-surface-variant">Showing {customerList.length} of {totalCustomers} customers</span><div className="flex items-center gap-2"><button type="button" disabled={page === 1 || loading} onClick={() => setPage((value) => value - 1)} className="rounded border border-outline-variant px-3 py-1 text-sm disabled:opacity-40">Previous</button><span className="text-sm text-on-surface-variant">Page {page} of {totalPages}</span><button type="button" disabled={page >= totalPages || loading} onClick={() => setPage((value) => value + 1)} className="rounded border border-outline-variant px-3 py-1 text-sm disabled:opacity-40">Next</button></div></div>
            </div>
          {/* Right Slide-out Drawer */}
          <div
            ref={drawerRef}
            className={`fixed top-16 right-0 bottom-0 w-96 bg-surface-container-lowest border-l border-surface-container-highest shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-20 flex flex-col overflow-hidden transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-surface-container-highest flex justify-between items-center bg-surface-bright shrink-0">
              <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface">Client Details</h3>
              <button onClick={closeDrawer} className="text-on-surface-variant hover:bg-surface-container-low p-1.5 rounded-full transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-surface-container-lowest custom-scrollbar">
              {/* Profile Header */}
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <img
                    className="w-24 h-24 rounded-full object-cover border-4 border-surface shadow-sm mb-3"
                    src={selectedCustomer.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKzPEuImyC5cZIH3y-al9hH7t05L-EurL5Ud3_kn8lMNXNeKP8xSZo7B7594ZLU3IILRz-FTcY5_rd0STM3lXzYb-2XlK1ULq04d6UAI10Jppi8GumYllBS8ydTc4a50UE4pkrKG_hXWR5smBNfHV0ScNU8oEW0GU1StZV8nZg07KmmjAG1F0zwP93HjDAZy6_8OT-mPZnTKPPeDgwM_fy7pT6DkofjbEaqqDyLSfxfqceIk80Lw9g-Q'}
                    alt={selectedCustomer.name}
                  />
                  <div className="absolute bottom-3 right-0 w-4 h-4 bg-success border-2 border-surface-container-lowest rounded-full" />
                </div>
                <h4 className="text-[20px] leading-[28px] font-semibold text-on-surface">{selectedCustomer.name}</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary mt-2">
                  VIP Client
                </span>
              </div>

              {/* Contact Info */}
              <div className="bg-surface-bright rounded-lg p-4 border border-outline-variant/30 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px] mt-0.5">mail</span>
                  <div>
                    <div className="text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">Email</div>
                    <div className="text-[14px] leading-[20px] text-on-surface">{selectedCustomer.email}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px] mt-0.5">call</span>
                  <div>
                    <div className="text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">Phone</div>
                    <div className="text-[14px] leading-[20px] text-on-surface">{selectedCustomer.phone}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px] mt-0.5">location_on</span>
                  <div>
                    <div className="text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">Shipping Address</div>
                    <div className="text-[14px] leading-[20px] text-on-surface whitespace-pre-line">{selectedCustomer.address || 'Not available'}</div>
                  </div>
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <h5 className="text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">edit_note</span> Staff Notes
                </h5>
                <textarea
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-24 resize-none shadow-inner"
                  placeholder="Add confidential notes about preferences, sizes, etc."
                  defaultValue={selectedCustomer.notes || ''}
                  readOnly
                />
              </div>

              {/* Purchase Timeline */}
              <div>
                <h5 className="text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">history</span> Purchase History
                </h5>
                <div className="relative pl-4 border-l-2 border-surface-container-highest space-y-6">
                  {selectedCustomer.purchaseHistory?.map((purchase, index) => (
                    <div key={index} className="relative">
                      <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-surface-container-lowest ${index === 0 ? 'bg-primary' : 'bg-surface-container-highest ring-4 ring-surface-container-lowest border border-outline-variant'}`} />
                      <div className="flex flex-col">
                        <span className={`font-semibold ${index === 0 ? 'text-primary' : 'text-on-surface-variant'} text-[12px] leading-[16px] uppercase tracking-wider mb-0.5`}>{purchase.date}</span>
                        <span className="text-[14px] leading-[20px] font-medium text-on-surface">{purchase.item}</span>
                        <span className="text-[12px] text-on-surface-variant mt-1">{purchase.orderId} • {purchase.amount.toLocaleString()} PKR</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-surface-container-highest bg-surface-container-lowest flex gap-3 shrink-0">
                <button className="flex-1 py-2 px-4 rounded-lg border border-outline-variant text-on-surface text-[12px] leading-[16px] font-semibold uppercase tracking-wider hover:bg-surface-container-low transition-colors shadow-sm">
                  Message
                </button>
                <button className="flex-1 py-2 px-4 rounded-lg bg-primary text-on-primary text-[12px] leading-[16px] font-semibold uppercase tracking-wider hover:bg-primary-container transition-colors shadow-sm">
                  Edit Profile
                </button>
              </div>
            </div>
      </div>
    </div>
  );
}
