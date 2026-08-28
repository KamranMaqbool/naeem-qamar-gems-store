import { useState } from 'react';
import { Link } from 'react-router-dom';
import { currencies, timezones, settingsSections } from '../../data/discounts';

export default function Settings() {
  const [activeSection, setActiveSection] = useState('general');
  const [formData, setFormData] = useState({
    storeName: 'Virtuoso\'s Gems',
    contactEmail: 'admin@virtuoso-gems.com',
    phoneNumber: '+1 (555) 000-0000',
    defaultCurrency: 'USD',
    timezone: 'EST',
    orderPrefix: '#GEM-',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving settings:', formData);
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* SideNavBar */}
      <aside className="bg-primary h-screen w-64 fixed left-0 top-0 border-r border-outline-variant shadow-md flex flex-col py-6 z-20 hidden md:flex">
        {/* Brand Header */}
        <div className="px-6 mb-8 flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-on-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary font-bold" data-icon="diamond" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
          </div>
          <div>
            <h1 className="text-[20px] leading-[28px] font-bold tracking-tight">VIRTUOSO'S GEMS</h1>
            <p className="text-[12px] uppercase tracking-widest text-on-primary/70 mt-1">Luxury Admin</p>
          </div>
        </div>
        {/* Navigation Links */}
        <ul className="flex-1 overflow-y-auto space-y-1">
          <li>
            <Link to="/" className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer active:scale-95">
              <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/orders" className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer active:scale-95">
              <span className="material-symbols-outlined" data-icon="shopping_cart">shopping_cart</span>
              <span>Orders</span>
            </Link>
          </li>
          <li>
            <Link to="/products" className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer active:scale-95">
              <span className="material-symbols-outlined" data-icon="gem">save_as</span>
              <span>Products</span>
            </Link>
          </li>
          <li>
            <Link to="/inventory" className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer active:scale-95">
              <span className="material-symbols-outlined" data-icon="inventory_2">inventory_2</span>
              <span>Inventory</span>
            </Link>
          </li>
          <li>
            <Link to="/discounts" className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer active:scale-95">
              <span className="material-symbols-outlined" data-icon="sell">sell</span>
              <span>Discounts</span>
            </Link>
          </li>
          <li>
            <Link to="/settings" className="flex items-center gap-3 px-4 py-3 bg-secondary-container/10 text-secondary-fixed border-l-4 border-secondary-fixed hover:bg-primary-container/50 transition-colors cursor-pointer active:scale-95">
              <span className="material-symbols-outlined" data-icon="settings" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content Wrapper */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        {/* TopNavBar */}
        <header className="bg-surface-container-lowest fixed top-0 right-0 left-0 md:left-64 h-16 border-b border-surface-container-highest shadow-sm flex justify-between items-center px-6 z-40">
          {/* Mobile Menu Toggle (Visible only on mobile) */}
          <button className="md:hidden text-on-surface p-2 rounded hover:bg-surface-container-low transition-colors" aria-label="Menu">
            <span className="material-symbols-outlined" data-icon="menu">menu</span>
          </button>
          {/* Product Name / Search Area */}
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-on-surface hidden md:block">Admin Dashboard</h2>
            <div className="relative max-w-md w-full md:ml-8">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-sm" data-icon="search">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-transparent rounded-md focus:bg-surface-container-lowest focus:border-outline-variant focus:ring-0 transition-all duration-200" placeholder="Search orders, products..." type="text" />
            </div>
          </div>
          {/* Trailing Actions */}
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all duration-200 relative" aria-label="Notifications">
              <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all duration-200 ml-2" aria-label="Account">
              <span className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
            </button>
          </div>
        </header>

        {/* Page Content Canvas */}
        <main className="flex-1 pt-16 p-4 md:p-8 lg:p-8 mx-auto w-full max-w-[1440px]">
          <div className="mb-8">
            <h2 className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-on-surface">Store Settings</h2>
            <p className="text-[14px] leading-[20px] text-on-surface-variant mt-2">Manage your core store configuration and formatting.</p>
          </div>

          {/* Bento Grid Layout for Settings Area */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 items-start pb-24">
            {/* Inner Sidebar (Secondary Navigation) */}
            <aside className="lg:col-span-3 bg-surface-container-lowest rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.05),0px_1px_2px_rgba(0,0,0,0.03)] border border-[#E2E8F0] overflow-hidden sticky top-24">
              <nav className="flex flex-col py-2">
                {settingsSections.map((section) => (
                  <Link
                    key={section.id}
                    to={`#${section.id}`}
                    className={`flex items-center justify-between px-4 py-3 transition-colors border-l-4 ${
                      activeSection === section.id
                        ? 'bg-primary/5 border-l-4 border-primary text-primary font-medium'
                        : 'text-on-surface-variant hover:bg-surface-container-low border-l-4 border-transparent'
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined ${activeSection === section.id ? 'text-primary' : ''}`} data-icon={section.icon}>
                        {section.icon}
                      </span>
                      <span>{section.label}</span>
                    </div>
                  </Link>
                ))}
              </nav>
            </aside>

            {/* Main Form Area */}
            <div className="lg:col-span-9 space-y-6">
              {/* Section 1: Store Details */}
              <section id="general" className="card p-6 lg:p-8">
                <div className="mb-6 border-b border-surface-variant pb-4">
                  <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface">Store Details</h3>
                  <p className="text-[14px] leading-[20px] text-on-surface-variant mt-1">Basic information used on your storefront and invoices.</p>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2">
                      <label htmlFor="storeName" className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Store Name</label>
                      <input
                        id="storeName"
                        name="storeName"
                        value={formData.storeName}
                        onChange={handleChange}
                        className="w-full bg-surface-bright border border-[#E2E8F0] rounded-md px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 text-on-surface"
                        placeholder="e.g. Virtuoso's Gems"
                        type="text"
                      />
                    </div>
                    <div>
                      <label htmlFor="contactEmail" className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Contact Email</label>
                      <input
                        id="contactEmail"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        className="w-full bg-surface-bright border border-[#E2E8F0] rounded-md px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 text-on-surface"
                        type="email"
                      />
                    </div>
                    <div>
                      <label htmlFor="phoneNumber" className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Phone Number</label>
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full bg-surface-bright border border-[#E2E8F0] rounded-md px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 text-on-surface"
                        placeholder="+1 (555) 000-0000"
                        type="tel"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2: Currency & Region */}
              <section id="currency" className="card p-6 lg:p-8">
                <div className="mb-6 border-b border-surface-variant pb-4">
                  <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface">Currency & Region</h3>
                  <p className="text-[14px] leading-[20px] text-on-surface-variant mt-1">Configure your primary operating currency and timezone.</p>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="defaultCurrency" className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Default Currency</label>
                      <div className="relative">
                        <select
                          id="defaultCurrency"
                          name="defaultCurrency"
                          value={formData.defaultCurrency}
                          onChange={handleChange}
                          className="appearance-none w-full bg-surface-bright border border-[#E2E8F0] rounded-md pl-4 pr-10 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 cursor-pointer"
                        >
                          {currencies.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" data-icon="expand_more">expand_more</span>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="timezone" className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Timezone</label>
                      <div className="relative">
                        <select
                          id="timezone"
                          name="timezone"
                          value={formData.timezone}
                          onChange={handleChange}
                          className="appearance-none w-full bg-surface-bright border border-[#E2E8F0] rounded-md pl-4 pr-10 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 cursor-pointer"
                        >
                          {timezones.map((tz) => (
                            <option key={tz.value} value={tz.value}>{tz.label}</option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" data-icon="expand_more">expand_more</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3: Order Formatting */}
              <section id="orders" className="card p-6 lg:p-8">
                <div className="mb-6 border-b border-surface-variant pb-4">
                  <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface">Order Formatting</h3>
                  <p className="text-[14px] leading-[20px] text-on-surface-variant mt-1">Customize how order numbers appear in your system.</p>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="orderPrefix" className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Order ID Prefix</label>
                      <input
                        id="orderPrefix"
                        name="orderPrefix"
                        value={formData.orderPrefix}
                        onChange={handleChange}
                        className="w-full bg-surface-bright border border-[#E2E8F0] rounded-md px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10"
                        placeholder="#GEM-"
                        type="text"
                      />
                      <p className="text-[14px] leading-[20px] text-on-surface-variant mt-2 text-sm">Example: #GEM-1001</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4: Payments (Placeholder) */}
              <section id="payments" className="card p-6 lg:p-8 hidden" aria-hidden="true">
                <div className="mb-6 border-b border-surface-variant pb-4">
                  <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface">Payments</h3>
                  <p className="text-[14px] leading-[20px] text-on-surface-variant mt-1">Configure payment providers and processing.</p>
                </div>
                <p className="text-on-surface-variant">Payment settings coming soon...</p>
              </section>

              {/* Section 5: Shipping (Placeholder) */}
              <section id="shipping" className="card p-6 lg:p-8 hidden" aria-hidden="true">
                <div className="mb-6 border-b border-surface-variant pb-4">
                  <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface">Shipping</h3>
                  <p className="text-[14px] leading-[20px] text-on-surface-variant mt-1">Configure shipping zones, rates, and methods.</p>
                </div>
                <p className="text-on-surface-variant">Shipping settings coming soon...</p>
              </section>

              {/* Section 6: Taxes (Placeholder) */}
              <section id="taxes" className="card p-6 lg:p-8 hidden" aria-hidden="true">
                <div className="mb-6 border-b border-surface-variant pb-4">
                  <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface">Taxes</h3>
                  <p className="text-[14px] leading-[20px] text-on-surface-variant mt-1">Configure tax rates and rules.</p>
                </div>
                <p className="text-on-surface-variant">Tax settings coming soon...</p>
              </section>

              {/* Section 7: Notifications (Placeholder) */}
              <section id="notifications" className="card p-6 lg:p-8 hidden" aria-hidden="true">
                <div className="mb-6 border-b border-surface-variant pb-4">
                  <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface">Notifications</h3>
                  <p className="text-[14px] leading-[20px] text-on-surface-variant mt-1">Configure email and push notification preferences.</p>
                </div>
                <p className="text-on-surface-variant">Notification settings coming soon...</p>
              </section>
            </div>
          </form>
        </main>
      </div>

      {/* Action Bar (Sticky Footer) */}
      <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-surface-container-lowest border-t border-surface-container-highest p-4 md:px-8 z-30 shadow-[0px_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between md:justify-end gap-6">
          <button type="button" className="text-on-surface-variant hover:text-on-surface font-medium transition-colors">
            Discard Changes
          </button>
          <button type="submit" form="settings-form" className="px-6 py-2.5 bg-primary-container hover:bg-primary-container/90 text-on-primary rounded-md text-[12px] leading-[16px] font-semibold uppercase tracking-wider transition-all shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] active:scale-95 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm" data-icon="save">save</span>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}