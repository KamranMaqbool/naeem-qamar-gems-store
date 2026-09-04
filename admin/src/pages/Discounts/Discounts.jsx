import { useEffect, useState } from 'react';
import { discounts as staticDiscounts, discountTypes } from '../../data/discounts';
import { createDiscount, deleteDiscount, fetchAdminDiscounts, isAuthenticated, login } from '../../lib/api';

export default function Discounts() {
  const [activeTab, setActiveTab] = useState('active');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
  });
  const [discountList, setDiscountList] = useState(staticDiscounts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDiscounts() {
      try {
        if (!isAuthenticated()) await login('admin@virtuoso-gems.com', 'admin123');
        const data = await fetchAdminDiscounts();
        setDiscountList((data.results || data).map((discount) => ({ ...discount, type: discount.discount_type === 'FIXED_AMOUNT' ? 'Fixed Amount' : 'Percentage', value: discount.discount_type === 'PERCENTAGE' ? `${discount.value}%` : `$${discount.value}`, usageCount: `${discount.current_uses} / ${discount.max_uses || '∞'}`, expiryDate: discount.end_date ? new Date(discount.end_date).toLocaleDateString() : 'No Expiry', status: discount.is_active ? 'active' : 'expired' })));
      } catch (loadError) { setError(loadError.message || 'Unable to load discounts.'); }
      finally { setLoading(false); }
    }
    loadDiscounts();
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (type) => {
    setFormData((prev) => ({ ...prev, type }));
  };

  const handleDelete = async (discount) => {
    if (!window.confirm(`Delete discount ${discount.code}?`)) return;
    try { await deleteDiscount(discount.id); setDiscountList((current) => current.filter((item) => item.id !== discount.id)); }
    catch (deleteError) { setError(deleteError.message || 'Unable to delete discount.'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isAuthenticated()) await login('admin@virtuoso-gems.com', 'admin123');
      await createDiscount({ code: formData.code, discount_type: formData.type === 'fixed' ? 'FIXED_AMOUNT' : 'PERCENTAGE', value: formData.value, start_date: `${formData.startDate || new Date().toISOString().slice(0, 10)}T00:00:00Z`, end_date: `${formData.endDate || '2099-12-31'}T23:59:59Z`, max_uses: Number(formData.usageLimit) || 0, is_active: true });
      setDrawerOpen(false);
      window.location.reload();
    } catch (submitError) { setError(submitError.message || 'Unable to save promo.'); }
  };

  return (
    <div className="w-full">
      {/* SideNavBar */}
      <aside className="hidden bg-primary h-screen w-64 fixed left-0 top-0 border-r border-outline-variant shadow-md h-full py-6 z-20">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-secondary-fixed text-sm">diamond</span>
          </div>
          <div>
            <h1 className="text-[20px] leading-[28px] font-bold tracking-tight">VIRTUOSO'S GEMS</h1>
            <p className="text-on-primary/70 text-[12px] mt-1">Luxury Admin</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer active:scale-95" href="/">
                <span className="material-symbols-outlined">dashboard</span>
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer active:scale-95" href="/orders">
                <span className="material-symbols-outlined">shopping_cart</span>
                <span>Orders</span>
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer active:scale-95" href="/products">
                <span className="material-symbols-outlined">save_as</span>
                <span>Products</span>
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer active:scale-95" href="/inventory">
                <span className="material-symbols-outlined">inventory_2</span>
                <span>Inventory</span>
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 px-4 py-3 bg-secondary-container/10 text-secondary-fixed border-l-4 border-secondary-fixed hover:bg-primary-container/50 transition-colors cursor-pointer active:scale-95" href="/discounts">
                <span className="material-symbols-outlined">sell</span>
                <span>Discounts</span>
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer active:scale-95" href="/settings">
                <span className="material-symbols-outlined">settings</span>
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="ml-0 flex-1 flex flex-col min-h-screen">
        {/* TopNavBar */}
        <header className="hidden bg-surface-container-lowest fixed top-0 right-0 left-64 h-16 border-b border-surface-container-highest shadow-sm justify-between items-center px-6 z-10">
          <div className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-on-surface">Admin Dashboard</div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-all duration-200" aria-label="Search">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-all duration-200" aria-label="Notifications">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-all duration-200" aria-label="Account">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </header>

        {/* Canvas */}
        <main className="flex-1 p-0 overflow-visible flex relative w-full">
          {/* Left Side: Content */}
          <div className={`flex-1 pr-0 flex flex-col max-w-none mx-0 w-full transition-all duration-300 ${drawerOpen ? 'mr-[400px]' : ''}`} id="main-content">
            {/* Header & Actions */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-on-surface">Promotions & Discounts</h2>
              <button
                onClick={toggleDrawer}
                className="px-6 py-3 bg-primary-container text-on-primary rounded-md text-[12px] leading-[16px] font-bold uppercase tracking-wider hover:bg-primary transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Create New Code
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-surface-container-highest mb-6 flex gap-8">
              <button
                onClick={() => setActiveTab('active')}
                className={`pb-3 border-b-2 font-semibold text-[12px] leading-[16px] uppercase tracking-wider ${activeTab === 'active' ? 'border-primary-container text-primary-container' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              >
                Active Promos
              </button>
              <button
                onClick={() => setActiveTab('expired')}
                className={`pb-3 border-b-2 font-semibold text-[12px] leading-[16px] uppercase tracking-wider ${activeTab === 'expired' ? 'border-primary-container text-primary-container' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              >
                Expired
              </button>
            </div>

            {/* Data Table Container */}
            {error && <div className="mb-4 rounded-lg border border-error/30 bg-error-bg px-4 py-3 text-sm text-error-text">{error}</div>}
            <div className="card overflow-hidden flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#F1F5F9] border-b border-outline-variant text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">
                  <tr>
                    <th className="py-4 px-6 font-semibold">Discount Code</th>
                    <th className="py-4 px-6 font-semibold">Type</th>
                    <th className="py-4 px-6 font-semibold">Value</th>
                    <th className="py-4 px-6 font-semibold">Usage Count</th>
                    <th className="py-4 px-6 font-semibold">Expiry Date</th>
                    <th className="py-4 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? <tr><td colSpan="6" className="py-12 text-center text-on-surface-variant">Loading discounts...</td></tr> : discountList.filter((discount) => activeTab === 'active' ? discount.status === 'active' : discount.status !== 'active').map((discount) => (
                    <tr key={discount.id} className="border-b border-[#F1F5F9] hover:bg-surface-container-low transition-colors group">
                      <td className="py-4 px-6 font-mono text-[13px] leading-[18px] font-medium text-primary-container">{discount.code}</td>
                      <td className="py-4 px-6 text-on-surface">{discount.type}</td>
                      <td className="py-4 px-6 font-semibold text-on-surface">{discount.value}</td>
                      <td className="py-4 px-6 text-on-surface-variant">{discount.usageCount}</td>
                      <td className="py-4 px-6 text-on-surface-variant">{discount.expiryDate}</td>
                      <td className="py-4 px-6 text-right">
                        <button type="button" onClick={() => handleDelete(discount)} className="text-on-surface-variant hover:text-error transition-colors opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Delete ${discount.code}`}>
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Slide-out Drawer */}
          <div className={`fixed top-16 right-0 bottom-0 w-[400px] bg-surface-container-lowest border-l border-outline-variant shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.08)] flex flex-col z-30 transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`} id="slide-drawer">
            <div className="px-6 py-5 border-b border-surface-container-highest flex justify-between items-center bg-[#F8FAFC]">
              <h3 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-on-surface">Create Discount Code</h3>
              <button
                onClick={toggleDrawer}
                className="text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              <form id="discount-form" onSubmit={handleSubmit} className="space-y-6">
                {/* Code Name */}
                <div>
                  <label className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Code Name</label>
                  <input
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="w-full border border-outline-variant rounded-md px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 text-on-surface placeholder:text-on-surface-variant/50"
                    placeholder="e.g. HOLIDAY25"
                    type="text"
                    required
                  />
                </div>

                {/* Type Toggle */}
                <div>
                  <label className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Discount Type</label>
                  <div className="flex p-1 bg-surface-container-low rounded-md border border-surface-container-highest">
                    {discountTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleTypeChange(type.value)}
                        className={`flex-1 py-2 text-center rounded transition-colors text-[12px] leading-[16px] font-semibold uppercase tracking-wider ${
                          formData.type === type.value
                            ? 'bg-surface-container-lowest shadow-sm text-primary border border-outline-variant/30'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Value */}
                <div>
                  <label className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Discount Value</label>
                  <div className="relative">
                    <span className={`absolute left-4 top-3 text-on-surface-variant ${formData.type === 'percentage' ? '' : 'hidden'}`}>%</span>
                    <span className={`absolute left-4 top-3 text-on-surface-variant ${formData.type === 'fixed' ? '' : 'hidden'}`}>$</span>
                    <input
                      name="value"
                      value={formData.value}
                      onChange={handleChange}
                      className={`w-full border border-outline-variant rounded-md ${formData.type === 'percentage' ? 'pl-8' : 'pl-4'} pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 text-on-surface`}
                      placeholder={formData.type === 'percentage' ? '10' : '0.00'}
                      type="number"
                      step={formData.type === 'percentage' ? '1' : '0.01'}
                      min="0"
                      required
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Start Date</label>
                    <input
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full border border-outline-variant rounded-md px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 text-on-surface text-sm"
                      type="date"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">End Date (Optional)</label>
                    <input
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full border border-outline-variant rounded-md px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 text-on-surface text-sm"
                      type="date"
                    />
                  </div>
                </div>

                {/* Usage Limits */}
                <div>
                  <label className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Total Usage Limit</label>
                  <input
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleChange}
                    className="w-full border border-outline-variant rounded-md px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 text-on-surface placeholder:text-on-surface-variant/50"
                    placeholder="Leave blank for unlimited"
                    type="number"
                  />
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-surface-container-highest bg-surface-container-lowest">
              <button
                type="submit"
                form="discount-form"
                className="w-full bg-primary-container text-on-primary py-3 rounded-md text-[12px] leading-[16px] font-semibold uppercase tracking-wider hover:bg-primary transition-colors shadow-md transition-all"
              >
                Save Promo
              </button>
              <button
                type="button"
                onClick={toggleDrawer}
                className="w-full mt-3 bg-transparent text-on-surface-variant py-3 rounded-md text-[12px] leading-[16px] font-semibold uppercase tracking-wider hover:text-on-surface transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
