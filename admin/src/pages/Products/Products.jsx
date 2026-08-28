import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { products, categories, stockStatuses, statusConfig } from '../../data/products';

export default function Products() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [stockStatus, setStockStatus] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !category || product.category.toLowerCase() === category.toLowerCase();
      const matchesStock = !stockStatus || product.status === stockStatus;
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [search, category, stockStatus]);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-on-surface">Products</h1>
          <p className="text-[16px] leading-[24px] text-on-surface-variant mt-1">Manage your luxury inventory and product listings.</p>
        </div>
        <Link to="/products/add" className="px-4 py-2 bg-primary-container text-white rounded-md text-[12px] leading-[16px] font-semibold uppercase tracking-wider hover:bg-primary transition-colors shadow-resting flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          Add New Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-md text-[14px] leading-[20px] focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/10"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-surface-container-low border border-outline-variant text-on-surface-variant text-[12px] leading-[16px] font-semibold uppercase tracking-wider rounded-md px-4 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <select
            value={stockStatus}
            onChange={(e) => setStockStatus(e.target.value)}
            className="bg-surface-container-low border border-outline-variant text-on-surface-variant text-[12px] leading-[16px] font-semibold uppercase tracking-wider rounded-md px-4 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none"
          >
            {stockStatuses.map((status) => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F1F5F9] border-b border-surface-container-highest">
                <th className="py-3 px-6 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">Product</th>
                <th className="py-3 px-6 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">Category</th>
                <th className="py-3 px-6 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">SKU</th>
                <th className="py-3 px-6 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">Stock</th>
                <th className="py-3 px-6 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">Price</th>
                <th className="py-3 px-6 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">Status</th>
                <th className="py-3 px-6 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-[#F1F5F9] hover:bg-surface-bright transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium text-on-surface">{product.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-on-surface-variant">{product.category}</td>
                  <td className="py-4 px-6 font-mono text-[13px] leading-[18px] font-medium text-primary-container">{product.sku}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      product.stock <= 0 ? 'bg-error-bg text-error-text' :
                      product.stock <= 5 ? 'bg-warning-bg text-warning-text' :
                      'bg-success-bg text-success-text'
                    }`}>
                      {product.stock <= 0 ? 'Out of Stock' : product.stock <= 5 ? `Low Stock (${product.stock})` : `In Stock (${product.stock})`}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-on-surface">
                    {product.salePrice ? (
                      <>
                        <span className="line-through text-on-surface-variant">${product.price.toLocaleString()}</span>
                        <span className="ml-2 text-primary">${product.salePrice.toLocaleString()}</span>
                      </>
                    ) : (
                      `$${product.price.toLocaleString()}`
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusConfig[product.status]?.className || ''}`}>
                      {statusConfig[product.status]?.label || product.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/products/${product.id}/edit`} className="px-4 py-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-low rounded-md" aria-label="Edit product">
                        <span className="material-symbols-outlined">edit</span>
                      </Link>
                      <button className="px-4 py-2 text-on-surface-variant hover:text-error transition-colors hover:bg-surface-container-low rounded-md" aria-label="Delete product">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-on-surface-variant/30 text-6xl mb-4 block">inventory_2</span>
            <p className="text-[16px] leading-[24px] text-on-surface-variant">No products found</p>
            <p className="text-[14px] leading-[20px] text-on-surface-variant/70 mt-1">Try adjusting your filters or search term</p>
          </div>
        )}
        <div className="px-6 py-4 border-t border-surface-container-highest bg-white flex items-center justify-between">
          <span className="text-[14px] leading-[20px] text-sm text-on-surface-variant">Showing 1 to {filteredProducts.length} of {products.length} entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-outline-variant rounded-md text-sm text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 bg-primary-container text-white rounded-md text-sm shadow-sm">1</button>
            <button className="px-3 py-1 border border-outline-variant rounded-md text-sm text-on-surface hover:bg-surface-container-low">2</button>
            <button className="px-3 py-1 border border-outline-variant rounded-md text-sm text-on-surface hover:bg-surface-container-low">3</button>
            <button className="px-3 py-1 border border-outline-variant rounded-md text-sm text-on-surface hover:bg-surface-container-low">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}