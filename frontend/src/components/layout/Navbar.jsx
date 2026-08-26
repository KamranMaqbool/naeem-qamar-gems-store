import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { brandConfig, navLinks } from '../../config/brand';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isHome
          ? 'bg-surface-container-lowest'
          : scrolled
          ? 'bg-background/95 shadow-sm'
          : 'bg-background/80 backdrop-blur-md'
      }`}
      id="main-nav"
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 flex justify-between items-center h-20">
        <Link
          to="/"
          className="flex items-center gap-2 group cursor-pointer transition-all active:scale-95 hover:opacity-70"
          aria-label={`${brandConfig.name} - Home`}
        >
          <img
            src={brandConfig.logo.src}
            alt={brandConfig.logo.alt}
            className="h-10 w-auto object-contain"
          />
          <span className="font-headline text-headline-md text-primary tracking-tighter">
            {brandConfig.name}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-label text-label-caps">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`relative transition-all active:scale-95 hover:opacity-70 ${
                location.pathname === link.href || (link.active && location.pathname.startsWith(link.href))
                  ? 'text-secondary after:content-[\"\"] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-secondary after:rounded-full'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 text-primary">
          <button
            aria-label="Search"
            className="cursor-pointer transition-all active:scale-95 hover:opacity-70 p-2"
          >
            <span class="material-symbols-outlined" data-icon="search">search</span>
          </button>
          <button
            aria-label="Account"
            className="cursor-pointer transition-all active:scale-95 hover:opacity-70 p-2 hidden md:block"
          >
            <span class="material-symbols-outlined" data-icon="person">person</span>
          </button>
          <Link
            to="/cart"
            aria-label="Cart"
            className="cursor-pointer transition-all active:scale-95 hover:opacity-70 p-2"
          >
            <span class="material-symbols-outlined" data-icon="shopping_bag">shopping_bag</span>
          </Link>

          <button
            className="md:hidden p-2"
            aria-label="Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span class="material-symbols-outlined" data-icon={mobileMenuOpen ? 'close' : 'menu'}>
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={`md:hidden border-t border-outline-variant/30 px-5 py-6 ${
          isHome
            ? 'bg-surface-container-lowest'
            : scrolled
            ? 'bg-background/95'
            : 'bg-background/95 backdrop-blur-md'
        }`}>
          <nav className="flex flex-col gap-4 font-label text-label-caps">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-on-surface-variant hover:text-primary transition-colors ${
                  location.pathname === link.href ? 'text-secondary' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </nav>
  );
}