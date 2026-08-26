import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, subtotal, removeItem, clearCart } = useContext(CartContext);

  if (!isOpen) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div aria-modal="true" className="fixed inset-0 z-50 flex justify-end" role="dialog">
      <div
        className="absolute inset-0 bg-primary/20 backdrop-blur-sm backdrop-fade-in"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md h-full bg-surface-container-lowest shadow-2xl flex flex-col drawer-slide-in">
        <div className="px-8 py-6 border-b border-outline-variant/30 flex items-center justify-between">
          <h2 className="font-headline text-headline-md text-primary">Your Treasure Bag</h2>
          <button
            className="text-on-surface-variant hover:text-primary transition-colors p-2 -mr-2"
            onClick={onClose}
            aria-label="Close cart"
          >
            <span class="material-symbols-outlined" data-icon="close">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <span class="material-symbols-outlined text-outline text-6xl mb-4 block" data-icon="shopping_bag">
                shopping_bag
              </span>
              <p className="font-body text-body-md text-on-surface-variant">Your bag is empty</p>
              <p className="font-body text-body-sm text-on-surface-variant/70 mt-2">Add some gems to get started</p>
            </div>
          ) : (
            <>
              {items.map((item, index) => (
                <div key={item.id} className="flex gap-6 group">
                  <div className="w-24 h-24 flex-shrink-0 bg-surface-container-low overflow-hidden">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={item.image}
                      alt={item.name}
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div>
                      <h3 className="font-body text-body-lg text-primary font-medium">{item.name}</h3>
                      <p className="font-body text-body-md text-on-surface-variant mt-1">{item.variant || 'Loose Gemstone'}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="font-body text-body-lg text-primary">{formatPrice(item.price * item.quantity)}</span>
                      <button
                        className="font-label text-label-caps text-on-surface-variant hover:text-error transition-colors underline decoration-1 underline-offset-4"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {items.length > 1 && <hr className="border-outline-variant/30" />}
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="px-8 py-8 bg-surface border-t border-outline-variant/30">
            <div className="flex justify-between items-end mb-6">
              <span className="font-body text-body-md text-on-surface-variant uppercase tracking-widest">Subtotal</span>
              <span className="font-headline text-headline-md text-primary tracking-tight">{formatPrice(subtotal)}</span>
            </div>
            <p className="font-body text-body-md text-on-surface-variant mb-6 text-sm text-center">
              Shipping and taxes calculated at checkout.
            </p>
            <button
              className="w-full py-4 px-8 bg-primary-container text-on-primary font-button text-button uppercase tracking-widest rounded hover:bg-primary transition-colors duration-300 flex items-center justify-center gap-2 group"
            >
              Proceed to Secure Checkout
              <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">
                arrow_forward
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}