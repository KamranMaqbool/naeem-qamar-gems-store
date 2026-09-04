import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { currencies, timezones, settingsSections } from '../../data/discounts';
import { fetchAdminSettings, isAuthenticated, login, updateAdminSettings } from '../../lib/api';

export default function Settings() {
  const [activeSection, setActiveSection] = useState(() => window.location.hash.slice(1) || 'general');
  const [testMode, setTestMode] = useState(false);
  const [paypalEnabled, setPaypalEnabled] = useState(false);
  const [payoutSchedule, setPayoutSchedule] = useState('weekly');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [taxRate, setTaxRate] = useState('0');
  const [notifications, setNotifications] = useState({ orders: true, inventory: true, marketing: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setSaved(false);
    try {
      if (!isAuthenticated()) await login('admin@virtuoso-gems.com', 'admin123');
      await updateAdminSettings({ store_name: formData.storeName, contact_email: formData.contactEmail, contact_phone: formData.phoneNumber, default_currency: formData.defaultCurrency, order_prefix: formData.orderPrefix, tax_rate_percentage: taxRate, payment_settings: { test_mode: testMode, paypal_enabled: paypalEnabled, payout_schedule: payoutSchedule }, shipping_settings: { method: shippingMethod }, notification_settings: notifications });
      setSaved(true);
    } catch (saveError) { setError(saveError.message || 'Unable to save settings.'); }
    finally { setSaving(false); }
  };

  useEffect(() => {
    async function loadSettings() {
      try {
        if (!isAuthenticated()) await login('admin@virtuoso-gems.com', 'admin123');
        const data = await fetchAdminSettings();
        setFormData((prev) => ({ ...prev, storeName: data.store_name || prev.storeName, contactEmail: data.contact_email || prev.contactEmail, phoneNumber: data.contact_phone || prev.phoneNumber, defaultCurrency: data.default_currency || prev.defaultCurrency, orderPrefix: data.order_prefix || prev.orderPrefix }));
        if (data.tax_rate_percentage !== undefined) setTaxRate(String(data.tax_rate_percentage));
        if (data.payment_settings) { setTestMode(Boolean(data.payment_settings.test_mode)); setPaypalEnabled(Boolean(data.payment_settings.paypal_enabled)); setPayoutSchedule(data.payment_settings.payout_schedule || 'weekly'); }
        if (data.shipping_settings?.method) setShippingMethod(data.shipping_settings.method);
        if (data.notification_settings) setNotifications((prev) => ({ ...prev, ...data.notification_settings }));
      } catch (loadError) { setError(loadError.message || 'Unable to load settings.'); }
    }
    loadSettings();
  }, []);

  useEffect(() => {
    const syncSection = () => setActiveSection(window.location.hash.slice(1) || 'general');
    window.addEventListener('hashchange', syncSection);
    return () => window.removeEventListener('hashchange', syncSection);
  }, []);

  return (
    <div className="relative pb-24">
      <div className="w-full">
          <div className="mb-8">
            <h2 className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-on-surface">Store Settings</h2>
            <p className="text-[14px] leading-[20px] text-on-surface-variant mt-2">Manage your core store configuration and formatting.</p>
          </div>
          {error && <div className="mb-6 rounded-lg border border-error/30 bg-error-bg px-4 py-3 text-sm text-error-text">{error}</div>}
          {saved && <div className="mb-6 rounded-lg border border-success/30 bg-success-bg px-4 py-3 text-sm text-success-text">Settings saved successfully.</div>}

          {/* Bento Grid Layout for Settings Area */}
          <form id="settings-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 items-start pb-24">
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
              <section id="general" className={`card p-6 lg:p-8 ${activeSection === 'general' ? '' : 'hidden'}`}>
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
              <section id="currency" className={`card p-6 lg:p-8 ${activeSection === 'general' ? '' : 'hidden'}`}>
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
              <section id="orders" className={`card p-6 lg:p-8 ${activeSection === 'general' ? '' : 'hidden'}`}>
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

              {/* Section 4: Payments */}
              <section id="payments" className={`space-y-6 ${activeSection === 'payments' ? '' : 'hidden'}`}>
                <div><h3 className="text-3xl font-bold tracking-tight text-on-surface">Payment Providers</h3><p className="mt-1 text-base text-on-surface-variant">Manage the ways you receive money from customers.</p></div>
                <div className="card p-6 lg:p-8"><div className="flex items-start justify-between gap-4"><div><h4 className="text-xl font-semibold text-on-surface">Primary Gateway</h4><p className="mt-1 text-sm text-on-surface-variant">Your main processor for credit and debit cards.</p></div><span className="inline-flex items-center gap-1 rounded-full bg-success-bg px-3 py-1 text-xs font-semibold text-success-text"><span className="h-2 w-2 rounded-full bg-success" />Active</span></div><div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-outline-variant p-4"><div className="flex items-center gap-4"><div className="rounded-md bg-surface-container-low px-3 py-3 text-lg font-bold text-[#635BFF]">Stripe</div><div><p className="font-medium text-on-surface">Stripe Payments</p><p className="text-sm text-on-surface-variant">billing@luxegems.com</p></div></div><div className="flex items-center gap-4"><label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Test mode<input type="checkbox" checked={testMode} onChange={(e) => setTestMode(e.target.checked)} className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary" /></label><button type="button" className="rounded-lg border border-outline px-4 py-2 text-xs font-semibold uppercase tracking-wider text-on-surface hover:bg-surface-container-low">Edit</button></div></div></div>
                <div className="card p-6 lg:p-8"><h4 className="text-xl font-semibold text-on-surface">Alternative Payment Methods</h4><p className="mt-1 text-sm text-on-surface-variant">Offer express checkout options to improve conversion.</p><div className="mt-6 grid gap-4 md:grid-cols-2"><div className="rounded-lg border border-outline-variant p-5"><div className="flex items-center justify-between"><span className="font-semibold text-[#003087]">PayPal</span><span className="rounded bg-surface-container-high px-2 py-1 text-[10px] font-semibold uppercase">{paypalEnabled ? 'Active' : 'Inactive'}</span></div><p className="mt-5 font-medium">PayPal Express</p><p className="mt-1 text-sm text-on-surface-variant">Allow customers to pay with their PayPal balance.</p><button type="button" onClick={() => setPaypalEnabled((value) => !value)} className="mt-5 w-full rounded-lg border border-outline py-2 text-xs font-semibold uppercase tracking-wider hover:bg-surface-container-low">{paypalEnabled ? 'Deactivate' : 'Activate'}</button></div><div className="rounded-lg border border-outline-variant bg-surface-container-low p-5"><p className="font-semibold text-on-surface"> Pay</p><p className="mt-5 font-medium">Apple Pay</p><p className="mt-1 text-sm text-on-surface-variant">Active via Stripe integration.</p><button type="button" className="mt-5 w-full rounded-lg border border-outline py-2 text-xs font-semibold uppercase tracking-wider hover:bg-surface-container-low">Manage</button></div></div></div>
                <div className="card p-6 lg:p-8"><h4 className="text-xl font-semibold text-on-surface">Payout Settings</h4><p className="mt-1 text-sm text-on-surface-variant">Configure how and when you receive funds.</p><div className="mt-6 grid gap-5 border-t border-surface-container-highest pt-5 md:grid-cols-2"><label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Payout schedule<select className="mt-2 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-on-surface" value={payoutSchedule} onChange={(e) => setPayoutSchedule(e.target.value)}><option value="daily">Daily</option><option value="weekly">Weekly (Every Monday)</option><option value="monthly">Monthly</option></select></label><div><p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Bank account</p><div className="mt-2 flex items-center justify-between rounded-lg border border-outline-variant px-3 py-2.5 text-sm"><span>•••• 4582</span><button type="button" className="text-xs font-semibold uppercase tracking-wider text-primary underline">Change</button></div></div></div></div>
                <div className="rounded-lg border border-outline-variant bg-surface-container-low p-6"><h4 className="font-semibold text-on-surface">Current Fee Structure</h4><p className="mt-2 text-sm text-on-surface-variant">Your current plan applies a 0.5% transaction fee on third-party gateways. Using Stripe directly waives this additional fee.</p><div className="mt-4 flex flex-wrap gap-x-12 gap-y-2 text-sm"><span>Stripe Domestic <strong className="ml-8">2.9% + 30¢</strong></span><span>Stripe Int'l <strong className="ml-8">3.9% + 30¢</strong></span></div></div>
              </section>

              {/* Section 5: Shipping */}
              <section id="shipping" className={`space-y-6 ${activeSection === 'shipping' ? '' : 'hidden'}`}>
                <div><h3 className="text-3xl font-bold tracking-tight text-on-surface">Shipping Settings</h3><p className="mt-1 text-base text-on-surface-variant">Configure delivery zones, rates, and fulfillment options.</p></div>
                <div className="card p-6 lg:p-8"><h4 className="text-xl font-semibold text-on-surface">Shipping method</h4><p className="mt-1 text-sm text-on-surface-variant">Choose the default delivery option shown at checkout.</p><div className="mt-6 space-y-3"><label className="flex cursor-pointer items-center justify-between rounded-lg border border-outline-variant p-4"><span><span className="block font-medium">Standard delivery</span><span className="text-sm text-on-surface-variant">3–5 business days · $15.00</span></span><input type="radio" name="shippingMethod" value="standard" checked={shippingMethod === 'standard'} onChange={(e) => setShippingMethod(e.target.value)} className="h-5 w-5 text-primary focus:ring-primary" /></label><label className="flex cursor-pointer items-center justify-between rounded-lg border border-outline-variant p-4"><span><span className="block font-medium">Express delivery</span><span className="text-sm text-on-surface-variant">1–2 business days · $35.00</span></span><input type="radio" name="shippingMethod" value="express" checked={shippingMethod === 'express'} onChange={(e) => setShippingMethod(e.target.value)} className="h-5 w-5 text-primary focus:ring-primary" /></label><label className="flex cursor-pointer items-center justify-between rounded-lg border border-outline-variant p-4"><span><span className="block font-medium">Local pickup</span><span className="text-sm text-on-surface-variant">Ready within 24 hours · Free</span></span><input type="radio" name="shippingMethod" value="pickup" checked={shippingMethod === 'pickup'} onChange={(e) => setShippingMethod(e.target.value)} className="h-5 w-5 text-primary focus:ring-primary" /></label></div></div>
                <div className="card p-6 lg:p-8"><h4 className="text-xl font-semibold text-on-surface">Shipping origin</h4><p className="mt-1 text-sm text-on-surface-variant">Address used for delivery estimates and labels.</p><div className="mt-6 grid gap-4 md:grid-cols-2"><label className="text-sm font-medium">Warehouse address<input className="mt-2 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm" defaultValue="House 45, Street 12, Phase 5" /></label><label className="text-sm font-medium">City<input className="mt-2 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm" defaultValue="Lahore" /></label></div></div>
              </section>

              {/* Section 6: Taxes */}
              <section id="taxes" className={`space-y-6 ${activeSection === 'taxes' ? '' : 'hidden'}`}>
                <div><h3 className="text-3xl font-bold tracking-tight text-on-surface">Tax Settings</h3><p className="mt-1 text-base text-on-surface-variant">Set the tax rules applied to orders at checkout.</p></div>
                <div className="card p-6 lg:p-8"><h4 className="text-xl font-semibold text-on-surface">Default tax rate</h4><p className="mt-1 text-sm text-on-surface-variant">Applied when no specific product or region rule exists.</p><div className="mt-6 max-w-sm"><label className="text-sm font-medium">Tax rate (%)<div className="relative mt-2"><input className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 pr-10 text-sm" type="number" min="0" max="100" step="0.01" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} /><span className="absolute right-3 top-2.5 text-on-surface-variant">%</span></div></label></div><label className="mt-5 flex items-center gap-3 text-sm"><input type="checkbox" defaultChecked className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary" />Prices include tax</label></div>
                <div className="card p-6 lg:p-8"><h4 className="text-xl font-semibold text-on-surface">Tax regions</h4><p className="mt-1 text-sm text-on-surface-variant">Manage where taxes are collected.</p><div className="mt-5 flex items-center justify-between rounded-lg border border-outline-variant p-4"><div><p className="font-medium">Pakistan</p><p className="text-sm text-on-surface-variant">Default region · {taxRate || '0'}% tax</p></div><button type="button" className="text-sm font-semibold text-primary underline">Manage</button></div></div>
              </section>

              {/* Section 7: Notifications */}
              <section id="notifications" className={`space-y-6 ${activeSection === 'notifications' ? '' : 'hidden'}`}>
                <div><h3 className="text-3xl font-bold tracking-tight text-on-surface">Notification Settings</h3><p className="mt-1 text-base text-on-surface-variant">Choose which updates your team receives by email.</p></div>
                <div className="card p-6 lg:p-8"><h4 className="text-xl font-semibold text-on-surface">Email notifications</h4><p className="mt-1 text-sm text-on-surface-variant">Keep your team informed about important store activity.</p><div className="mt-6 divide-y divide-surface-container-highest">{[['orders', 'Order updates', 'New orders, payments, and fulfillment changes.'], ['inventory', 'Inventory alerts', 'Low-stock and out-of-stock warnings.'], ['marketing', 'Marketing insights', 'Sales summaries and promotional performance.']].map(([key, label, description]) => <label key={key} className="flex cursor-pointer items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"><span><span className="block font-medium text-on-surface">{label}</span><span className="text-sm text-on-surface-variant">{description}</span></span><input type="checkbox" checked={notifications[key]} onChange={(e) => setNotifications((prev) => ({ ...prev, [key]: e.target.checked }))} className="h-5 w-5 shrink-0 rounded border-outline-variant text-primary focus:ring-primary" /></label>)}</div></div>
                <div className="card p-6 lg:p-8"><h4 className="text-xl font-semibold text-on-surface">Admin digest</h4><p className="mt-1 text-sm text-on-surface-variant">Receive a weekly summary of store performance.</p><select className="mt-5 w-full max-w-sm rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm"><option>Every Monday</option><option>Every Friday</option><option>Never</option></select></div>
              </section>
            </div>
          </form>
      </div>

      {/* Action Bar (Sticky Footer) */}
      <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-surface-container-lowest border-t border-surface-container-highest p-4 md:px-8 z-30 shadow-[0px_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between md:justify-end gap-6">
          <button type="button" className="text-on-surface-variant hover:text-on-surface font-medium transition-colors">
            Discard Changes
          </button>
          <button type="submit" form="settings-form" disabled={saving} className="px-6 py-2.5 bg-primary-container hover:bg-primary-container/90 text-on-primary rounded-md text-[12px] leading-[16px] font-semibold uppercase tracking-wider transition-all shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] active:scale-95 flex items-center gap-2 disabled:opacity-60">
            <span className="material-symbols-outlined text-sm" data-icon="save">save</span>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
