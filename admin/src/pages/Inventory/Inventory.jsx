import { useState, useMemo } from 'react';
import { inventoryItems, inventoryStats, stockStatusOptions, statusConfig } from '../../data/inventory';

export default function Inventory() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const filteredItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !status || item.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* SideNavBar */}
      <aside className="bg-primary text-on-primary/70 h-screen w-64 fixed left-0 top-0 border-r border-outline-variant shadow-md flex flex-col h-full py-6 z-20">
        <div className="px-6 mb-8 flex items-center gap-4">
          <div className="w-10 h-10 bg-surface-container-lowest rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary">diamond</span>
          </div>
          <div>
            <h1 className="text-[20px] leading-[28px] font-bold tracking-tight">VIRTUOSO'S GEMS</h1>
            <p className="text-[12px] uppercase tracking-widest text-on-primary/70 mt-1">Luxury Admin</p>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-1 px-2">
          <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors rounded cursor-pointer active:scale-95" href="/">
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors rounded cursor-pointer active:scale-95" href="/orders">
            <span className="material-symbols-outlined">shopping_cart</span>
            Orders
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors rounded cursor-pointer active:scale-95" href="/products">
            <span className="material-symbols-outlined">save_as</span>
            Products
          </a>
          <a className="flex items-center gap-3 px-4 py-3 bg-secondary-container/10 text-secondary-fixed border-l-4 border-secondary-fixed cursor-pointer active:scale-95" href="/inventory">
            <span className="material-symbols-outlined">inventory_2</span>
            Inventory
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors rounded cursor-pointer active:scale-95" href="/discounts">
            <span className="material-symbols-outlined">sell</span>
            Discounts
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors rounded cursor-pointer active:scale-95" href="/settings">
            <span className="material-symbols-outlined">settings</span>
            Settings
          </a>
        </nav>
      </aside>

      {/* TopNavBar */}
      <header className="bg-surface-container-lowest fixed top-0 right-0 left-64 h-16 border-b border-surface-container-highest shadow-sm z-40">
        <div className="flex justify-between items-center px-6 h-full">
          <div className="flex items-center gap-4 w-1/3">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-md bg-surface-bright focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all duration-200 text-on-surface" placeholder="Search..." type="text" />
            </div>
          </div>
          <div className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-on-surface absolute left-1/2 -translate-x-1/2">
            Admin Dashboard
          </div>
          <div className="flex items-center gap-4 text-primary">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-all duration-200" aria-label="Notifications">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-all duration-200" aria-label="Account">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="ml-64 pt-16 p-6 md:p-8 min-h-screen">
        <div className="max-w-[1440px] mx-auto">
          {/* Page Header */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-on-surface">Inventory Management</h2>
              <p className="text-[16px] leading-[24px] text-on-surface-variant mt-2">Monitor and control your luxury gemstone stock.</p>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-2.5 bg-surface-container-lowest border border-tertiary-container text-tertiary-container rounded-md text-[12px] leading-[16px] font-bold uppercase tracking-wider hover:bg-surface-container-low transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export CSV
              </button>
              <button className="px-6 py-2.5 bg-primary-container text-on-primary rounded-md text-[12px] leading-[16px] font-bold uppercase tracking-wider hover:bg-primary transition-colors flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Receive Stock
              </button>
            </div>
          </div>

          {/* Summary Cards (Bento-style Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-[64px] text-primary-container">inventory_2</span>
              </div>
              <p className="text-[12px] leading-[16px] font-semibold uppercase text-on-surface-variant mb-2">Total SKUs</p>
              <p className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-on-surface">{inventoryStats.totalSKUs}</p>
              <p className="text-[14px] leading-[20px] text-on-surface-variant mt-2">Active products in catalog</p>
            </div>
            <div className="card p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-[64px] text-warning">warning</span>
              </div>
              <p className="text-[12px] leading-[16px] font-semibold uppercase text-on-surface-variant mb-2">Low Stock Alerts</p>
              <p className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-warning">{inventoryStats.lowStockAlerts}</p>
              <p className="text-[14px] leading-[20px] text-on-surface-variant mt-2">Items below threshold (5)</p>
            </div>
            <div className="card p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-[64px] text-error">error</span>
              </div>
              <p className="text-[12px] leading-[16px] font-semibold uppercase text-on-surface-variant mb-2">Out of Stock</p>
              <p className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-error">{inventoryStats.outOfStock}</p>
              <p className="text-[14px] leading-[20px] text-on-surface-variant mt-2">Requires immediate reorder</p>
            </div>
          </div>

          {/* Table Controls */}
          <div className="flex justify-between items-center mb-4 bg-surface-container-lowest p-4 rounded-t-xl border border-surface-container-highest border-b-0">
            <div className="relative w-72">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-md bg-surface-bright focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all duration-200 text-on-surface"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">Filter by Status:</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border border-outline-variant rounded-md px-4 py-2 bg-surface-bright focus:border-primary-container focus:ring-4 focus:ring-primary-container/10"
              >
                {stockStatusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Enterprise Data Table */}
          <div className="card overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F1F5F9] border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-6 py-4 text-[12px] leading-[16px] font-semibold uppercase tracking-wider w-1/3">Product</th>
                  <th className="px-6 py-4 text-[12px] leading-[16px] font-semibold uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-4 text-[12px] leading-[16px] font-semibold uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-[12px] leading-[16px] font-semibold uppercase tracking-wider w-32">Current Stock</th>
                  <th className="px-6 py-4 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded bg-surface-dim overflow-hidden shrink-0 border border-outline-variant ${item.status === 'out-of-stock' ? 'opacity-50 grayscale' : ''}`}>
                          <img className="w-full h-full object-cover" src={item.image} alt={item.name} />
                        </div>
                        <span className={`text-[20px] leading-[28px] font-semibold ${item.status === 'out-of-stock' ? 'opacity-60' : ''}`}>{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] leading-[18px] font-medium text-on-surface-variant">{item.sku}</td>
                    <td className="px-6 py-4 text-[14px] leading-[20px] text-on-surface-variant">{item.category}</td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={item.stock}
                        min="0"
                        className={`w-20 px-2 py-1 border rounded text-center text-[13px] leading-[18px] font-medium focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all ${
                          item.status === 'out-of-stock' ? 'border-error/50 bg-error/5 text-error' :
                          item.status === 'low-stock' ? 'border-yellow-400' :
                          'border-outline-variant'
                        }`}
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[item.status]?.className || ''}`}>
                        {statusConfig[item.status]?.label || item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Footer */}
            <div className="border-t border-surface-container-highest p-4 flex justify-between items-center bg-[#F8FAFC] rounded-b-xl">
              <span className="text-[14px] leading-[20px] text-on-surface-variant">Showing 1 to {filteredItems.length} of {inventoryItems.length} entries</span>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant bg-surface-container-lowest text-on-surface-variant disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-primary-container bg-primary-container text-on-primary text-[12px] leading-[16px] font-semibold">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low text-[12px] leading-[16px] font-semibold">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low text-[12px] leading-[16px] font-semibold">3</button>
                <span className="px-2 text-on-surface-variant">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}