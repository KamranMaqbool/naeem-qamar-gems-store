import { useAdmin } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { clearTokens } from '../../lib/api';

export default function TopNavBar() {
  const { sidebarOpen, toggleSidebar } = useAdmin();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [openMenu, setOpenMenu] = useState(null);

  const submitSearch = (event) => {
    event.preventDefault();
    const value = search.trim();
    if (!value) return;
    const route = /customer|client/i.test(value) ? '/customers' : /order/i.test(value) ? '/orders' : /stock|inventor/i.test(value) ? '/inventory' : /discount|promo/i.test(value) ? '/discounts' : '/products';
    navigate(`${route}?search=${encodeURIComponent(value)}`);
  };

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-surface-container-lowest border-b border-surface-container-highest shadow-sm z-40">
      <div className="flex justify-between items-center px-6 h-full transition-all duration-200">
        {/* Left Section */}
        <div className="flex items-center gap-4 flex-1">
          <button
            className="md:hidden text-primary p-2 rounded-md hover:bg-surface-container-low transition-colors"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="hidden md:flex items-center gap-2 text-primary font-headline-md text-headline-md text-on-surface">
            <span className="material-symbols-outlined text-primary-container">dashboard</span>
            <span className="font-bold">Admin Dashboard</span>
          </div>
          <form onSubmit={submitSearch} className="relative ml-8 w-full max-w-md hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full font-body-md text-body-md focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/10 transition-shadow"
              placeholder="Search orders, inventory..."
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 font-label-md text-label-md">
          <a
            href={import.meta.env.VITE_STORE_URL || 'http://localhost:5173'}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-on-surface-variant hover:text-primary-container hover:bg-surface-container-low rounded-md transition-colors"
          >
            <span className="material-symbols-outlined text-sm">visibility</span>
            Store Live View
          </a>
          <div className="relative"><button onClick={() => setOpenMenu(openMenu === 'notifications' ? null : 'notifications')} className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors relative" aria-label="Notifications" aria-expanded={openMenu === 'notifications'}>
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full border-2 border-surface-container-lowest" />
          </button>{openMenu === 'notifications' && <div className="absolute right-0 top-12 w-72 rounded-lg border border-outline-variant bg-surface-container-lowest p-4 shadow-floating"><div className="flex items-center justify-between"><p className="font-semibold text-on-surface">Notifications</p><span className="text-xs text-primary">3 new</span></div><div className="mt-3 space-y-3 text-sm"><p className="border-b border-surface-container-highest pb-3 text-on-surface-variant"><strong className="text-on-surface">New order received</strong><br />Order #1045 was placed just now.</p><p className="border-b border-surface-container-highest pb-3 text-on-surface-variant"><strong className="text-on-surface">Low stock alert</strong><br />3 gemstone products need attention.</p><p className="text-on-surface-variant"><strong className="text-on-surface">Report ready</strong><br />Your monthly report is available.</p></div></div>}</div>
          <div className="relative"><button onClick={() => setOpenMenu(openMenu === 'profile' ? null : 'profile')} className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors" aria-label="Account" aria-expanded={openMenu === 'profile'}>
            <span className="material-symbols-outlined">account_circle</span>
          </button>{openMenu === 'profile' && <div className="absolute right-0 top-12 w-52 rounded-lg border border-outline-variant bg-surface-container-lowest py-2 shadow-floating"><button onClick={() => { navigate('/profile'); setOpenMenu(null); }} className="block w-full px-4 py-2 text-left text-sm text-on-surface hover:bg-surface-container-low">My profile</button><button onClick={() => { navigate('/settings'); setOpenMenu(null); }} className="block w-full px-4 py-2 text-left text-sm text-on-surface hover:bg-surface-container-low">Settings</button><button onClick={() => { clearTokens(); navigate('/'); setOpenMenu(null); }} className="block w-full border-t border-surface-container-highest px-4 py-2 text-left text-sm text-error hover:bg-error-bg">Sign out</button></div>}</div>
        </div>
      </div>
    </header>
  );
}
