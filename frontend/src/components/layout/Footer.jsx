import { Link } from 'react-router-dom';
import { brandConfig, footerLinks } from '../../config/brand';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/30 w-full py-section-gap">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-24">
        <div className="flex flex-col gap-6 md:col-span-1">
          <span className="font-headline text-headline-md text-primary">{brandConfig.name}</span>
          <p className="font-body text-body-md text-on-surface-variant max-w-sm">
            Join our inner circle for early access to new acquisitions and bespoke design inspiration.
          </p>
          <form className="flex w-full max-w-sm mt-2" onSubmit={(e) => e.preventDefault()}>
            <input
              className="bg-transparent border-0 border-b border-primary-container text-primary placeholder-on-surface-variant/50 focus:ring-0 focus:border-outline minimalist-float w-full py-2 px-0 font-body text-body-md"
              placeholder="Email Address"
              type="email"
              required
            />
            <button
              type="submit"
              className="text-primary font-button text-button px-4 border-b border-primary-container hover:text-secondary transition-colors uppercase tracking-widest"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-8 md:col-span-2 md:justify-items-end mt-12 md:mt-0">
          <div className="flex flex-col gap-4">
            <h5 className="font-label text-label-caps text-primary mb-2">Discover</h5>
            {footerLinks.discover.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="font-body text-body-md text-on-surface-variant hover:text-primary hover:text-secondary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <h5 className="font-label text-label-caps text-primary mb-2">Support</h5>
            {footerLinks.support.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="font-body text-body-md text-on-surface-variant hover:text-primary hover:text-secondary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-5 md:px-20 mt-16 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-body text-body-md text-on-surface-variant text-sm">
          {brandConfig.copyright}
        </p>
        <div className="flex gap-6">
          {brandConfig.socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              className="text-on-surface-variant hover:text-primary transition-colors"
              aria-label={social.name}
            >
              <span class="material-symbols-outlined" data-icon={social.icon}>
                {social.icon}
              </span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}