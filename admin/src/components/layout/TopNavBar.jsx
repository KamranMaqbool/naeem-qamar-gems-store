import { useAdmin } from '../../context/AdminContext';

export default function TopNavBar() {
  const { sidebarOpen, toggleSidebar } = useAdmin();

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
          <div className="relative ml-8 w-full max-w-md hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full font-body-md text-body-md focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/10 transition-shadow"
              placeholder="Search orders, inventory..."
              type="text"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 font-label-md text-label-md">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-on-surface-variant hover:text-primary-container hover:bg-surface-container-low rounded-md transition-colors"
          >
            <span className="material-symbols-outlined text-sm">visibility</span>
            Store Live View
          </a>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors relative" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full border-2 border-surface-container-lowest" />
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors" aria-label="Account">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
}