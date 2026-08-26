import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import { brandConfig, footerLinks } from '../config/brand';

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useContext(CartContext);

  const handleQuantityChange = (id, delta) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      updateQuantity(id, item.quantity + delta);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md">
          <div className="max-w-[1440px] mx-auto px-5 md:px-20 flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2" aria-label={`${brandConfig.name} - Home`}>
              <span className="font-headline text-headline-md text-primary tracking-tighter">{brandConfig.name}</span>
            </Link>
            <div className="flex items-center gap-4 text-primary">
              <Link to="/cart" aria-label="Cart" className="cursor-pointer transition-all active:scale-95 hover:opacity-70 p-2">
                <span class="material-symbols-outlined" data-icon="shopping_bag">shopping_bag</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-grow pt-[140px] pb-section-gap max-w-[1440px] mx-auto px-5 md:px-20 w-full flex items-center justify-center">
          <div className="text-center py-16">
            <span class="material-symbols-outlined text-outline text-8xl mb-6 block" data-icon="shopping_bag">
              shopping_bag
            </span>
            <h1 className="font-headline text-headline-lg text-primary mb-4">Your Treasure Bag is Empty</h1>
            <p className="font-body text-body-lg text-on-surface-variant mb-8 max-w-md mx-auto">
              Looks like you haven't added any gems yet. Explore our collection to find your perfect stone.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center bg-primary-container text-on-primary font-button text-button px-8 py-4 rounded hover:bg-primary transition-colors duration-300"
            >
              Shop the Collection
            </Link>
          </div>
        </main>

        <footer className="bg-surface-container-low border-t border-outline-variant/30 w-full py-section-gap mt-auto">
          <div className="max-w-[1440px] mx-auto px-5 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-24">
            <div className="flex flex-col space-y-4">
              <span className="font-headline text-headline-md text-primary">{brandConfig.name}</span>
              <p className="font-body text-body-md text-on-surface-variant">{brandConfig.getCopyright()}</p>
            </div>
            <div className="flex flex-col space-y-2 font-body text-body-md">
              {footerLinks.support.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-on-surface-variant hover:text-secondary transition-colors duration-200 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col space-y-2 font-body text-body-md">
              <Link className="text-on-surface-variant hover:text-secondary transition-colors duration-200 w-fit" to="/terms">Terms</Link>
              <Link className="text-on-surface-variant hover:text-secondary transition-colors duration-200 w-fit" to="/contact">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-5 md:px-20 flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2" aria-label={`${brandConfig.name} - Home`}>
            <span className="font-headline text-headline-md text-primary tracking-tighter">{brandConfig.name}</span>
          </Link>
          <div className="flex items-center gap-4 text-primary">
            <Link to="/cart" aria-label="Cart" className="cursor-pointer transition-all active:scale-95 hover:opacity-70 p-2">
              <span class="material-symbols-outlined" data-icon="shopping_bag">shopping_bag</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-[140px] pb-section-gap max-w-[1440px] mx-auto px-5 md:px-20 w-full">
        <h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-12">Your Treasure Bag</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-24">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-6 bg-surface-container-lowest border border-outline-variant/30 p-6">
                <div className="w-32 h-32 flex-shrink-0 bg-surface-container-low overflow-hidden">
                  <img className="w-full h-full object-cover" src={item.image} alt={item.name} />
                </div>
                <div className="flex flex-col justify-between flex-1 py-2">
                  <div>
                    <h3 className="font-body text-body-lg text-primary font-medium">{item.name}</h3>
                    <p className="font-body text-body-md text-on-surface-variant mt-1">{item.variant || 'Loose Gemstone'}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border border-outline-variant/30 rounded-sm">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="px-3 py-1 text-on-surface-variant hover:text-primary transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <span class="material-symbols-outlined" data-icon="remove">remove</span>
                        </button>
                        <span className="px-4 font-body text-body-md text-primary">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="px-3 py-1 text-on-surface-variant hover:text-primary transition-colors"
                          aria-label="Increase quantity"
                        >
                          <span class="material-symbols-outlined" data-icon="add">add</span>
                        </button>
                      </div>
                      <span className="font-body text-body-lg text-primary ml-auto">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="font-label text-label-caps text-on-surface-variant hover:text-error transition-colors underline decoration-1 underline-offset-4 w-fit"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-surface border border-outline-variant/30 p-8">
              <div className="flex justify-between items-end mb-6">
                <span className="font-body text-body-md text-on-surface-variant uppercase tracking-widest">Subtotal</span>
                <span className="font-headline text-headline-md text-primary tracking-tight">{formatPrice(subtotal)}</span>
              </div>
              <p className="font-body text-body-md text-on-surface-variant mb-6 text-sm text-center">
                Shipping and taxes calculated at checkout.
              </p>
              <button className="w-full py-4 px-8 bg-primary-container text-on-primary font-button text-button uppercase tracking-widest rounded hover:bg-primary transition-colors duration-300 flex items-center justify-center gap-2 group">
                Proceed to Secure Checkout
                <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">
                  arrow_forward
                </span>
              </button>
              <p className="font-body text-body-sm text-on-surface-variant/70 mt-4 text-center">
                By proceeding, you agree to our <Link to="/terms" className="underline hover:text-primary">Terms</Link> and <Link to="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-surface-container-low border-t border-outline-variant/30 w-full py-section-gap mt-auto">
        <div className="max-w-[1440px] mx-auto px-5 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-24">
          <div className="flex flex-col space-y-4">
            <span className="font-headline text-headline-md text-primary">{brandConfig.name}</span>
            <p className="font-body text-body-md text-on-surface-variant">{brandConfig.getCopyright()}</p>
          </div>
          <div className="flex flex-col space-y-2 font-body text-body-md">
            {footerLinks.support.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-on-surface-variant hover:text-secondary transition-colors duration-200 w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col space-y-2 font-body text-body-md">
            <Link className="text-on-surface-variant hover:text-secondary transition-colors duration-200 w-fit" to="/terms">Terms</Link>
            <Link className="text-on-surface-variant hover:text-secondary transition-colors duration-200 w-fit" to="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}