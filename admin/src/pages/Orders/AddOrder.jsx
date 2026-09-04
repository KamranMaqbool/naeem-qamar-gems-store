import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const fieldClass = 'w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10';

export default function AddOrder() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setToast(true);
    window.setTimeout(() => setToast(false), 4200);
  };

  return (
    <div className="relative max-w-5xl mx-auto">
      {toast && <div className="fixed right-6 top-20 z-50 flex items-center gap-3 rounded-lg border border-success/30 bg-surface-container-lowest px-4 py-3 text-sm font-medium text-success-text shadow-floating" role="status"><span className="material-symbols-outlined text-success">check_circle</span>Order created successfully</div>}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link to="/orders" className="mb-3 inline-flex items-center gap-1 text-sm text-primary hover:text-primary-container">
            <span className="material-symbols-outlined text-lg">arrow_back</span> Back to orders
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">Create Order</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Create a new customer order and capture its delivery details.</p>
        </div>
      </div>

      {submitted && <div className="mb-6 rounded-lg border border-success/30 bg-success-bg px-4 py-3 text-sm text-success-text">Order draft created successfully.</div>}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="mb-1 text-xl font-semibold text-on-surface">Customer information</h2>
            <p className="mb-5 text-sm text-on-surface-variant">Who is placing this order?</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-on-surface">Full name<input className={`${fieldClass} mt-2`} name="name" required placeholder="Customer name" /></label>
              <label className="text-sm font-medium text-on-surface">Email address<input className={`${fieldClass} mt-2`} name="email" type="email" required placeholder="customer@example.com" /></label>
              <label className="text-sm font-medium text-on-surface sm:col-span-2">Phone number<input className={`${fieldClass} mt-2`} name="phone" placeholder="+92 300 0000000" /></label>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="mb-1 text-xl font-semibold text-on-surface">Order details</h2>
            <p className="mb-5 text-sm text-on-surface-variant">Select the product and quantity for this order.</p>
            <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
              <label className="text-sm font-medium text-on-surface">Product<select className={`${fieldClass} mt-2`} name="product" required defaultValue=""><option value="" disabled>Select a product</option><option>1.5ct Emerald Cut Diamond</option><option>Round Brilliant Sapphire</option><option>Custom Gemstone Setting</option></select></label>
              <label className="text-sm font-medium text-on-surface">Quantity<input className={`${fieldClass} mt-2`} name="quantity" type="number" min="1" defaultValue="1" required /></label>
            </div>
            <label className="mt-4 block text-sm font-medium text-on-surface">Order notes<textarea className={`${fieldClass} mt-2 min-h-24 resize-y`} name="notes" placeholder="Special requests or internal notes" /></label>
          </section>

          <section className="card p-6">
            <h2 className="mb-1 text-xl font-semibold text-on-surface">Shipping address</h2>
            <p className="mb-5 text-sm text-on-surface-variant">Where should the order be delivered?</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-on-surface sm:col-span-2">Address<input className={`${fieldClass} mt-2`} name="address" required placeholder="Street address" /></label>
              <label className="text-sm font-medium text-on-surface">City<input className={`${fieldClass} mt-2`} name="city" required placeholder="City" /></label>
              <label className="text-sm font-medium text-on-surface">Postal code<input className={`${fieldClass} mt-2`} name="postalCode" placeholder="Postal code" /></label>
              <label className="text-sm font-medium text-on-surface sm:col-span-2">Country<select className={`${fieldClass} mt-2`} name="country" defaultValue="Pakistan"><option>Pakistan</option><option>United States</option><option>United Kingdom</option></select></label>
            </div>
          </section>
        </div>

        <aside className="card h-fit p-6 lg:sticky lg:top-24">
          <h2 className="mb-5 text-xl font-semibold text-on-surface">Order summary</h2>
          <div className="space-y-3 border-b border-surface-container-highest pb-5 text-sm"><div className="flex justify-between"><span className="text-on-surface-variant">Subtotal</span><span>$0.00</span></div><div className="flex justify-between"><span className="text-on-surface-variant">Shipping</span><span>Calculated later</span></div></div>
          <div className="flex justify-between py-5 text-base font-semibold"><span>Total</span><span>$0.00</span></div>
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-on-primary shadow-resting transition hover:bg-primary-container"><span className="material-symbols-outlined text-lg">check</span>Create order</button>
          <button type="button" onClick={() => navigate('/orders')} className="mt-3 w-full rounded-lg px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low">Cancel</button>
        </aside>
      </form>
    </div>
  );
}
