import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { addToServerCart, checkoutOrder } from '../lib/api';

const emptyForm = { email: '', phone: '', firstName: '', lastName: '', address: '', city: '', state: '', postalCode: '', country: 'United States' };

export default function Checkout() {
  const { items, subtotal, clearCart } = useContext(CartContext);
  const { formatPrice, settings } = useStoreSettings();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      // The drawer is local for a fast shopping experience; synchronize it
      // with the session cart before creating the order through the API.
      await Promise.all(items.map((item) => addToServerCart(item.id, item.quantity)));
      const order = await checkoutOrder({
        guest_email: form.email,
        guest_phone: form.phone,
        shipping_address: { recipient_name: `${form.firstName} ${form.lastName}`.trim(), address1: form.address, city: form.city, state: form.state, postal_code: form.postalCode, country: form.country },
        billing_address: { recipient_name: `${form.firstName} ${form.lastName}`.trim(), address1: form.address, city: form.city, state: form.state, postal_code: form.postalCode, country: form.country },
      });
      clearCart();
      setConfirmation(order);
    } catch (submitError) {
      setError(submitError.message || 'We could not place your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <main className="flex-grow px-5 pb-section-gap pt-32 md:px-20">
        <div className="mx-auto max-w-2xl border border-outline-variant/40 bg-surface-container-lowest px-6 py-16 text-center shadow-sm md:px-16">
          <span className="material-symbols-outlined mb-5 text-5xl text-secondary">verified</span>
          <p className="font-label text-label-caps text-secondary">Order confirmed</p>
          <h1 className="mt-3 font-display text-display-lg-mobile text-primary md:text-display-lg">Thank you for your purchase</h1>
          <p className="mx-auto mt-5 max-w-lg text-on-surface-variant">Your order has been received. A private client advisor will contact you with delivery and certification details.</p>
          <p className="mt-6 font-mono text-sm text-primary">Order {confirmation.order_number || `#${confirmation.id}`}</p>
          <Link to="/shop" className="mt-10 inline-flex bg-primary-container px-8 py-4 font-button text-button uppercase tracking-wider text-on-primary hover:bg-primary">Continue shopping</Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return <main className="flex-grow px-5 pb-section-gap pt-32 text-center"><h1 className="font-display text-display-lg-mobile text-primary md:text-display-lg">Your bag is empty</h1><Link to="/shop" className="mt-8 inline-flex bg-primary-container px-8 py-4 font-button text-button uppercase text-on-primary">Shop the collection</Link></main>;
  }

  return (
    <main className="flex-grow px-5 pb-section-gap pt-32 md:px-20">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12">
          <Link to="/cart" className="font-label text-label-caps text-on-surface-variant hover:text-primary">← Back to your bag</Link>
          <h1 className="mt-6 font-display text-display-lg-mobile text-primary md:text-display-lg">Secure checkout</h1>
          <p className="mt-2 text-on-surface-variant">Your information is encrypted and used only to fulfill your order.</p>
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-8">
            {error && <div className="border border-error/30 bg-error-bg px-4 py-3 text-sm text-error-text">{error}</div>}
            <section className="border border-outline-variant/40 bg-surface-container-lowest p-6 md:p-8">
              <h2 className="font-headline text-headline-md text-primary">Contact information</h2>
              <p className="mt-1 text-sm text-on-surface-variant">We’ll send your order confirmation here.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Email address" name="email" type="email" value={form.email} onChange={update} required className="sm:col-span-2" />
                <Field label="Phone number" name="phone" type="tel" value={form.phone} onChange={update} required className="sm:col-span-2" />
              </div>
            </section>
            <section className="border border-outline-variant/40 bg-surface-container-lowest p-6 md:p-8">
              <h2 className="font-headline text-headline-md text-primary">Shipping address</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="First name" name="firstName" value={form.firstName} onChange={update} required />
                <Field label="Last name" name="lastName" value={form.lastName} onChange={update} required />
                <Field label="Address" name="address" value={form.address} onChange={update} required className="sm:col-span-2" />
                <Field label="City" name="city" value={form.city} onChange={update} required />
                <Field label="State / region" name="state" value={form.state} onChange={update} required />
                <Field label="Postal code" name="postalCode" value={form.postalCode} onChange={update} required />
                <Field label="Country" name="country" value={form.country} onChange={update} required />
              </div>
            </section>
            <div className="flex items-center gap-3 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-secondary">lock</span>Secure, insured delivery with signature confirmation.</div>
          </div>

          <aside className="h-fit border border-outline-variant/40 bg-surface p-6 lg:sticky lg:top-28">
            <h2 className="font-headline text-headline-md text-primary">Order summary</h2>
            <div className="mt-6 space-y-5 border-b border-outline-variant/30 pb-6">
              {items.map((item) => <div key={item.id} className="flex gap-3"><img src={item.image} alt="" className="h-16 w-16 object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm text-primary">{item.name}</p><p className="mt-1 text-xs text-on-surface-variant">Qty {item.quantity}</p></div><span className="whitespace-nowrap text-sm text-primary">{formatPrice(item.price * item.quantity)}</span></div>)}
            </div>
            <div className="flex justify-between pt-6 text-on-surface-variant"><span>Subtotal</span><span className="font-semibold text-primary">{formatPrice(subtotal)}</span></div>
            <p className="mt-3 text-xs text-on-surface-variant">Taxes are calculated using the store’s {settings.tax_rate_percentage || 0}% rate. Shipping is confirmed by your client advisor.</p>
            <button type="submit" disabled={submitting} className="mt-6 flex w-full items-center justify-center gap-2 bg-primary-container px-5 py-4 font-button text-button uppercase tracking-wider text-on-primary hover:bg-primary disabled:cursor-wait disabled:opacity-60"><span className="material-symbols-outlined">lock</span>{submitting ? 'Placing order…' : 'Place secure order'}</button>
          </aside>
        </form>
      </div>
    </main>
  );
}

function Field({ label, name, className = '', ...props }) {
  return <label className={`block text-sm text-on-surface-variant ${className}`}><span className="mb-2 block font-label text-[11px] uppercase tracking-wider">{label}</span><input name={name} className="w-full border border-outline-variant bg-background px-3 py-3 text-sm text-on-surface outline-none focus:border-primary" {...props} /></label>;
}
