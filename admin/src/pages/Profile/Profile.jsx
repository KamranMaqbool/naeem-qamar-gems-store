import { useEffect, useState } from 'react';
import { fetchProfile, isAuthenticated, login, updateProfile } from '../../lib/api';

export default function Profile() {
  const [toggle2FA, setToggle2FA] = useState(true);
  const [profile, setProfile] = useState({ username: 'Eleanor Vance', email: 'admin@luxefacet.com', phone_number: '', role: 'Super Admin', avatar: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        if (!isAuthenticated()) await login('admin@virtuoso-gems.com', 'admin123');
        const data = await fetchProfile();
        if (data) setProfile(data);
      } catch { /* Keep the local profile preview when unavailable. */ }
    }
    loadProfile();
  }, []);

  const saveProfile = async () => {
    setSaving(true); setMessage('');
    try { setProfile((await updateProfile({ username: profile.username, phone_number: profile.phone_number })) || profile); setMessage('Profile updated successfully.'); }
    catch (error) { setMessage(error.message || 'Unable to update profile.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="w-full">
      {/* Side Navigation */}
      <aside className="hidden bg-primary h-screen w-64 fixed inset-y-0 left-0 border-r border-outline-variant shadow-md py-6 z-20 overflow-y-auto">
        {/* Header */}
        <div className="px-6 mb-8 flex flex-col gap-4">
          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-secondary-fixed text-sm">diamond</span>
          </div>
          <div>
            <h1 className="text-[20px] leading-[28px] font-bold tracking-tight">VIRTUOSO'S GEMS</h1>
            <p className="text-on-primary/70 text-[12px] mt-1">Luxury Admin</p>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 px-2">
          <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer rounded-lg" href="/">
            <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
            Dashboard
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer rounded-lg" href="/orders">
            <span className="material-symbols-outlined" data-icon="shopping_cart">shopping_cart</span>
            Orders
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer rounded-lg" href="/products">
            <span className="material-symbols-outlined" data-icon="save_as">save_as</span>
            Products
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer rounded-lg" href="/inventory">
            <span className="material-symbols-outlined" data-icon="inventory_2">inventory_2</span>
            Inventory
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer rounded-lg" href="/discounts">
            <span className="material-symbols-outlined" data-icon="sell">sell</span>
            Discounts
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer rounded-lg" href="/customers">
            <span className="material-symbols-outlined" data-icon="group">group</span>
            Customers
          </a>
          {/* Active State */}
          <a className="flex items-center gap-3 px-4 py-3 bg-white/10 text-white border-l-4 border-white transition-colors cursor-pointer rounded-r-lg" href="/profile">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
            Settings
          </a>
        </nav>
        {/* User Quick Profile */}
        <div className="px-6 mt-auto pt-4 border-t border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center font-bold text-sm">
              EV
            </div>
            <div className="flex flex-col">
              <span className="text-white text-sm font-medium">Eleanor Vance</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-0 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <header className="hidden bg-surface-container-lowest fixed top-0 right-0 left-64 h-16 border-b border-surface-container-highest shadow-sm justify-between items-center px-6 sticky top-0 z-10 w-full">
          <div className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-on-surface">Admin Dashboard</div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]" data-icon="search">search</span>
              <input className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-2 focus:ring-primary text-on-surface placeholder:text-on-surface-variant w-64" placeholder="Search..." type="text" />
            </div>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-low transition-all duration-200 rounded-full cursor-pointer" aria-label="Notifications">
              <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-low transition-all duration-200 rounded-full cursor-pointer" aria-label="Account">
              <span className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
            </button>
          </div>
        </header>

        {/* Main Content Wrapper */}
        <main className="flex-1 w-full">
          <div className="flex flex-col gap-8 w-full">
            {/* Page Title */}
            <div>
              <h2 className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-on-surface tracking-tight flex items-center gap-3">
                Admin Profile & Security
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[12px] leading-[16px] uppercase tracking-wider border border-primary/20">Active Account</span>
              </h2>
            <p className="text-[16px] leading-[24px] text-on-surface-variant mt-1">Manage your administrative account settings and security preferences.</p>
            {message && <p className="mt-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-primary">{message}</p>}
            </div>

            {/* Profile Header */}
            <div className="card p-6 lg:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative shrink-0">
                <img className="w-24 h-24 rounded-full object-cover border-2 border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIDyJpwsivG2TaL8vXP2zPhIzEDQcxeViWcuU1cz0P9xx0RyF20fM9RRABtI69foWrDlcxEi_ok0u1Eh5AZyNhSMWuFW-oQtuitI75gQW8OmNYQdFANPIusQxnFcgDOEZAR61sN5a2qu_3Jz5lQ2o-NQ_ZkbdHedii6Bx1yafHon-pps13SIqEP8UwVAPjgejtQZCombnduKIN3oBvlqk2U4jI_6Yky4IUbVDqDqAx44m2t-Yif6k_EQ" alt="Eleanor Vance" />
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center border-2 border-surface-container-lowest">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
              </div>
              <div className="flex flex-col items-center md:items-start flex-1 w-full">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
                <h3 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-on-surface">{profile.username}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary text-white font-semibold text-[12px] leading-[16px] uppercase tracking-wider">Super Admin</span>
                </div>
                <p className="text-[14px] leading-[20px] text-on-surface-variant mb-4">{profile.email}</p>
                <div className="flex gap-3">
                  <button className="bg-surface-container-lowest border border-outline font-semibold text-[12px] leading-[16px] uppercase tracking-wider text-on-surface px-4 py-2 rounded hover:bg-surface-container-low transition-colors shadow-sm">
                    Upload New Photo
                  </button>
                  <button className="font-semibold text-[12px] leading-[16px] uppercase tracking-wider text-error px-4 py-2 hover:bg-error/5 transition-colors rounded">
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Split Layout: Personal Info & Security */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
              {/* Left Card: Personal Information */}
              <div className="card p-6 lg:p-8 flex flex-col h-full">
                <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface mb-6 border-b border-surface-container-highest pb-4">Personal Information</h3>
                <form className="flex flex-col gap-5 flex-1">
                  <div>
                    <label className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Full Name</label>
                    <input className="w-full h-10 px-4 bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-on-surface" type="text" value={profile.username} onChange={(e) => setProfile((prev) => ({ ...prev, username: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Email Address</label>
                    <input className="w-full h-10 px-4 bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-on-surface" type="email" value={profile.email} readOnly />
                  </div>
                  <div>
                    <label className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Role</label>
                    <input className="w-full h-10 px-4 bg-surface-container-low border border-outline-variant rounded text-on-surface-variant cursor-not-allowed" disabled type="text" value="Super Admin" />
                  </div>
                  <div className="mt-auto pt-6">
                    <button onClick={saveProfile} disabled={saving} className="w-full bg-primary text-white font-semibold text-[12px] leading-[16px] uppercase tracking-wider py-3 rounded hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-60" type="button">
                      {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Card: Security Settings */}
              <div className="card p-6 lg:p-8 flex flex-col h-full">
                <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface mb-6 border-b border-surface-container-highest pb-4">Password & Security</h3>
                <form className="flex flex-col gap-5 flex-1">
                  <div>
                    <label className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Current Password</label>
                    <input className="w-full h-10 px-4 bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-on-surface" placeholder="••••••••" type="password" />
                  </div>
                  <div>
                    <label className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">New Password</label>
                    <input className="w-full h-10 px-4 bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-on-surface" type="password" />
                  </div>
                  <div>
                    <label className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Confirm Password</label>
                    <input className="w-full h-10 px-4 bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-on-surface" type="password" />
                  </div>
                  <button className="w-full bg-primary text-white font-semibold text-[12px] leading-[16px] uppercase tracking-wider py-3 rounded hover:bg-primary/90 transition-colors shadow-sm mt-2" type="button">
                    Update Password
                  </button>
                  {/* 2FA Section */}
                  <div className="mt-auto pt-6 border-t border-surface-container-highest">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-[14px] leading-[20px] font-semibold text-on-surface">Two-Factor Authentication (2FA)</h4>
                        <p className="text-[14px] leading-[20px] text-on-surface-variant text-sm mt-1">Secure your account with an extra layer of security.</p>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in cursor-pointer shrink-0">
                        <input
                          checked={toggle2FA}
                          onChange={(e) => setToggle2FA(e.target.checked)}
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-surface-container-lowest border-4 border-primary appearance-none cursor-pointer right-0 z-10 transition-transform duration-200"
                          id="toggle"
                          name="toggle"
                          type="checkbox"
                        />
                        <label className="toggle-label block overflow-hidden h-6 rounded-full bg-primary cursor-pointer" htmlFor="toggle"></label>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Bottom Section: Recent Login Activity */}
            <div className="card overflow-hidden">
              <div className="px-6 lg:px-8 py-5 border-b border-surface-container-highest">
                <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface">Recent Login Activity</h3>
              </div>
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-surface-container-low text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">
                      <th className="py-3 px-6 lg:px-8 font-semibold">Date/Time</th>
                      <th className="py-3 px-6 lg:px-8 font-semibold">IP Address</th>
                      <th className="py-3 px-6 lg:px-8 font-semibold">Location</th>
                      <th className="py-3 px-6 lg:px-8 font-semibold">Device</th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px] leading-[20px] text-on-surface">
                    <tr className="border-b border-surface-container-highest hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-4 px-6 lg:px-8">Oct 26, 2023 10:45 AM</td>
                      <td className="py-4 px-6 lg:px-8 font-mono text-[13px] leading-[18px]">192.168.1.1</td>
                      <td className="py-4 px-6 lg:px-8 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant" data-icon="location_on">location_on</span>
                        London, UK
                      </td>
                      <td className="py-4 px-6 lg:px-8">Chrome on MacOS</td>
                    </tr>
                    <tr className="border-b border-surface-container-highest hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-4 px-6 lg:px-8">Oct 25, 2023 09:12 AM</td>
                      <td className="py-4 px-6 lg:px-8 font-mono text-[13px] leading-[18px]">192.168.1.1</td>
                      <td className="py-4 px-6 lg:px-8 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant" data-icon="location_on">location_on</span>
                        London, UK
                      </td>
                      <td className="py-4 px-6 lg:px-8">Safari on iOS</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-4 px-6 lg:px-8">Oct 20, 2023 14:30 PM</td>
                      <td className="py-4 px-6 lg:px-8 font-mono text-[13px] leading-[18px]">82.13.204.15</td>
                      <td className="py-4 px-6 lg:px-8 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant" data-icon="location_on">location_on</span>
                        Manchester, UK
                      </td>
                      <td className="py-4 px-6 lg:px-8">Chrome on Windows</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
