export default function Orders() {
  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface tracking-tight">Orders</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">Manage and track customer orders.</p>
        </div>
        <button className="btn-primary">
          <span className="material-symbols-outlined text-sm">add</span>
          New Order
        </button>
      </div>
      <div className="card p-12 text-center">
        <span className="material-symbols-outlined text-on-surface-variant/30 text-6xl mb-4 block">shopping_cart</span>
        <p className="font-body-lg text-on-surface-variant">Orders management coming soon</p>
        <p className="font-body-md text-on-surface-variant/70 mt-1">Order listing, filtering, and detail views</p>
      </div>
    </div>
  );
}