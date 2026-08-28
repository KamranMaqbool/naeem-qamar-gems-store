import { Link, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: 'dashboard', fill: true },
  { path: '/orders', label: 'Orders', icon: 'shopping_cart', fill: false },
  { path: '/products', label: 'Products', icon: 'save_as', fill: false },
  { path: '/inventory', label: 'Inventory', icon: 'inventory_2', fill: false },
  { path: '/discounts', label: 'Discounts', icon: 'sell', fill: false },
  { path: '/settings', label: 'Settings', icon: 'settings', fill: false },
];

export default function Sidebar() {
  const { sidebarOpen, closeSidebar, currentPage } = useAdmin();
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`h-screen w-64 fixed left-0 top-0 bg-primary border-r border-outline-variant shadow-md z-50 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full py-6">
          {/* Logo */}
          <div className="px-6 mb-8 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0">
              <img
                alt="Virtuoso's Gems Logo"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDKhjs6C8ZDzjD6pjh7FTZidgY5PGooWSnkAqFGEzxqyY-hxGmlRAAioUNq21oJPCo6BslWLJCAsjVk1jeqTY1uqkMuaf5Io5gLQCAZDyMDAcnp7RcVcdrn5fzroCo1OQvdDVd6s_cVD93_XWmp34MbFuFKhJ08kStrizT3cNqepFLlhp7FlmQ5nkxSsUxHmWuXdQuPcWThDXStCGKbGssx87HEiDbSWA6vig4qv3UFb0BImOR6WZ5eA"
              />
            </div>
            <div>
              <h1 className="font-headline-sm text-headline-sm font-bold text-on-primary tracking-tight">VIRTUOSO'S GEMS</h1>
              <p className="font-label-md text-label-md text-on-primary/70">Luxury Admin</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-1 font-body-md text-body-md" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={closeSidebar}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span
                    className="material-symbols-outlined"
                    data-weight={item.fill ? 'fill' : undefined}
                    style={{ fontVariationSettings: item.fill ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="px-6 mt-auto">
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEpoImCMH7iVlLl42f7T86T11YaUjU5RC1FNRYUDA3ChWQ6JtgIt8VakJelhjeqpx7-h9fYnVAMC_S3l0Gml2EzUo0Yihr_eeXrc-oz2wdp-3HnYeE1R4h7mLW0m9NDhR_BZn2shRd_haqp7yWUvxTb2Mcl0q6sTX_OxqdAZsz9XmnhMabcc040Zk4F1qbhwKUXvZkRcJwwIG7-Rozmgh3xQ4GiHKPJIN40obYPJEnoV-3RciRPMz8eQ"
                alt="Admin User"
              />
              <div className="flex-1 min-w-0">
                <p className="font-label-md text-label-md text-on-primary truncate">{user?.name || 'Admin User'}</p>
                <p className="font-body-md text-xs text-on-primary/70 truncate">{user?.email || 'admin@virtuoso-gems.com'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}