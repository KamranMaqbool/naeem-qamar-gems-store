export default function Customers() {
  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-on-surface">Customers</h1>
          <p className="text-[16px] leading-[24px] text-on-surface-variant mt-1">Manage your customer database and relationships.</p>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-md text-[12px] leading-[16px] font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-resting flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          Add Customer
        </button>
      </div>
      <div className="card p-12 text-center">
        <span className="material-symbols-outlined text-on-surface-variant/30 text-6xl mb-4 block">group</span>
        <p className="text-[16px] leading-[24px] text-on-surface-variant">Customers management coming soon</p>
        <p className="text-[14px] leading-[20px] text-on-surface-variant/70 mt-1">Customer listing, search, and detail views</p>
      </div>
    </div>
  );
}