export default function Settings() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface tracking-tight">Settings</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">Configure your admin panel and store settings.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Store Name</label>
                <input type="text" value="Virtuoso's Gems" className="input-field" />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Store Email</label>
                <input type="email" value="admin@virtuoso-gems.com" className="input-field" />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Currency</label>
                <select className="input-field">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Timezone</label>
                <select className="input-field">
                  <option>UTC</option>
                  <option>America/New_York</option>
                  <option>Europe/London</option>
                  <option>Asia/Dubai</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">Notifications</h2>
            <div className="space-y-3">
              {[
                { label: 'New Order Alerts', description: 'Receive email when new orders are placed' },
                { label: 'Low Stock Alerts', description: 'Notify when inventory falls below threshold' },
                { label: 'Payment Failures', description: 'Alert on failed payment transactions' },
                { label: 'Weekly Reports', description: 'Receive weekly sales summary reports' },
              ].map((item, i) => (
                <label key={i} className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-body-md text-on-surface">{item.label}</p>
                    <p className="font-body-md text-sm text-on-surface-variant">{item.description}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-container border-outline-variant rounded focus:ring-primary-container focus:ring-offset-2" />
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">Account</h2>
            <div className="flex items-center gap-3 mb-4">
              <img
                className="w-16 h-16 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEpoImCMH7iVlLl42f7T86T11YaUjU5RC1FNRYUDA3ChWQ6JtgIt8VakJelhjeqpx7-h9fYnVAMC_S3l0Gml2EzUo0Yihr_eeXrc-oz2wdp-3HnYeE1R4h7mLW0m9NDhR_BZn2shRd_haqp7yWUvxTb2Mcl0q6sTX_OxqdAZsz9XmnhMabcc040Zk4F1qbhwKUXvZkRcJwwIG7-Rozmgh3xQ4GiHKPJIN40obYPJEnoV-3RciRPMz8eQ"
                alt="Admin User"
              />
              <div>
                <p className="font-headline-sm text-on-surface">Admin User</p>
                <p className="font-body-md text-on-surface-variant">admin@virtuoso-gems.com</p>
              </div>
            </div>
            <button className="btn-secondary w-full">Edit Profile</button>
          </div>

          <div className="card p-6 border-error/20">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">Danger Zone</h2>
            <p className="font-body-md text-on-surface-variant mb-4">These actions are irreversible. Please proceed with caution.</p>
            <button className="px-4 py-2 rounded-md bg-error/10 text-error border border-error/20 font-label-md text-label-md hover:bg-error/20 transition-colors w-full">
              Delete All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}