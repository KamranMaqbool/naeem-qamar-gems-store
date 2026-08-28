import { useState, useEffect, useMemo } from 'react';
import { inventoryItems as staticItems, inventoryStats as staticStats, stockStatusOptions, statusConfig } from '../../data/inventory';
import { fetchInventory, isAuthenticated, login } from '../../lib/api';

export default function Inventory() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [apiItems, setApiItems] = useState(null);
  const [inventoryStats, setInventoryStats] = useState(staticStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInventory() {
      try {
        if (!isAuthenticated()) {
          await login('admin@virtuoso-gems.com', 'admin123');
        }
        const data = await fetchInventory();
        const items = data.results || data;
        const mapped = items.map((inv) => ({
          id: inv.id,
          name: inv.product_title || inv.product?.title || '',
          category: inv.product_category || 'Loose Gems',
          sku: inv.product_sku || inv.product?.sku || '',
          stock: inv.current_stock,
          threshold: inv.low_stock_threshold,
          image: inv.product_image || '',
          status: inv.stock_status === 'IN_STOCK' ? 'in-stock'
            : inv.stock_status === 'LOW_STOCK' ? 'low-stock' : 'out-of-stock',
        }));
        setApiItems(mapped);
        setInventoryStats({
          totalSKUs: mapped.length,
          lowStockAlerts: mapped.filter((i) => i.status === 'low-stock').length,
          outOfStock: mapped.filter((i) => i.status === 'out-of-stock').length,
        });
      } catch {
        setApiItems(null);
      } finally {
        setLoading(false);
      }
    }
    loadInventory();
  }, []);

  const inventoryItems = apiItems || staticItems;

  const filteredItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !status || item.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [inventoryItems, search, status]);

  return (
    <div>
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

      <div className="flex justify-between items-center mb-4 bg-surface-container-lowest p-4 rounded-t-xl border border-surface-container-highest border-b-0">
        <div className="relative w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input type="text" placeholder="Search by name or SKU..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-md bg-surface-bright focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all duration-200 text-on-surface" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">Filter by Status:</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-outline-variant rounded-md px-4 py-2 bg-surface-bright focus:border-primary-container focus:ring-4 focus:ring-primary-container/10">
            {stockStatusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

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
            {loading ? (
              <tr><td colSpan="5" className="py-12 text-center text-on-surface-variant">Loading inventory...</td></tr>
            ) : filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-surface-container-low transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded bg-surface-dim overflow-hidden shrink-0 border border-outline-variant ${item.status === 'out-of-stock' ? 'opacity-50 grayscale' : ''}`}>
                      {item.image && <img className="w-full h-full object-cover" src={item.image} alt={item.name} />}
                    </div>
                    <span className={`text-[20px] leading-[28px] font-semibold ${item.status === 'out-of-stock' ? 'opacity-60' : ''}`}>{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[13px] leading-[18px] font-medium text-on-surface-variant">{item.sku}</td>
                <td className="px-6 py-4 text-[14px] leading-[20px] text-on-surface-variant">{item.category}</td>
                <td className="px-6 py-4">
                  <input type="number" defaultValue={item.stock} min="0" className={`w-20 px-2 py-1 border rounded text-center text-[13px] leading-[18px] font-medium focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all ${
                    item.status === 'out-of-stock' ? 'border-error/50 bg-error/5 text-error' :
                    item.status === 'low-stock' ? 'border-yellow-400' : 'border-outline-variant'
                  }`} />
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
        <div className="border-t border-surface-container-highest p-4 flex justify-between items-center bg-[#F8FAFC] rounded-b-xl">
          <span className="text-[14px] leading-[20px] text-on-surface-variant">Showing {filteredItems.length} of {inventoryItems.length} entries</span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-primary-container bg-primary-container text-on-primary text-[12px] leading-[16px] font-semibold">1</button>
          </div>
        </div>
      </div>
    </div>
  );
}
