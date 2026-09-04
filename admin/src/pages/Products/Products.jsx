import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { products as staticProducts, categories, stockStatuses, statusConfig } from '../../data/products';
import { deleteProduct, fetchAdminProducts, isAuthenticated, login } from '../../lib/api';

export default function Products() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [apiProducts, setApiProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        if (!isAuthenticated()) {
          await login('admin@virtuoso-gems.com', 'admin123');
        }
        const data = await fetchAdminProducts({ search, category, stockStatus, page });
        const productList = data.results || data;
        setApiProducts(productList.map((p) => ({
          id: p.id,
          name: p.title,
          category: p.category?.name || p.category || '',
          sku: p.sku,
          stock: p.inventory_stock ?? p.inventory?.current_stock ?? 0,
          price: parseFloat(p.base_price),
          salePrice: p.sale_price ? parseFloat(p.sale_price) : null,
          status: (p.inventory_status || p.inventory?.stock_status) === 'OUT_OF_STOCK' ? 'out-of-stock'
            : (p.inventory_status || p.inventory?.stock_status) === 'LOW_STOCK' ? 'low-stock' : 'active',
          image: typeof p.primary_image === 'object' ? p.primary_image?.image_url : p.primary_image || '',
        })));
        setTotalProducts(data.count ?? productList.length);
        setTotalPages(data.count ? Math.max(1, Math.ceil(data.count / 20)) : 1);
      } catch {
        setApiProducts(null);
        setTotalProducts(staticProducts.length);
        setTotalPages(Math.max(1, Math.ceil(staticProducts.length / 20)));
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [search, category, stockStatus, page]);

  const products = apiProducts || staticProducts;

  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesSearch = apiProducts !== null || product.name.toLowerCase().includes(search.toLowerCase()) || product.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = apiProducts !== null || !category || product.category.toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCategory && (!stockStatus || product.status === stockStatus);
  }), [products, apiProducts, search, category, stockStatus]);
  const updateSearch = (value) => { setSearch(value); setPage(1); };
  const updateCategory = (value) => { setCategory(value); setPage(1); };
  const updateStockStatus = (value) => { setStockStatus(value); setPage(1); };
  const handleDelete = async (product) => {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    setDeleting(product.id);
    try {
      await deleteProduct(product.id);
      setApiProducts((current) => current ? current.filter((item) => item.id !== product.id) : current);
      setTotalProducts((count) => Math.max(0, count - 1));
    } catch (deleteError) {
      window.alert(deleteError.message || 'Unable to delete product.');
    } finally { setDeleting(null); }
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-on-surface">Products</h1>
          <p className="text-[16px] leading-[24px] text-on-surface-variant mt-1">Manage your luxury inventory and product listings.</p>
        </div>
        <div className="flex gap-3"><Link to="/categories" className="px-4 py-2 border border-outline-variant rounded-md text-[12px] font-semibold uppercase tracking-wider">Categories</Link><Link to="/products/add" className="px-4 py-2 bg-primary-container text-white rounded-md text-[12px] leading-[16px] font-semibold uppercase tracking-wider hover:bg-primary transition-colors shadow-resting flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          Add New Product
        </Link></div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => updateSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-md text-[14px] leading-[20px] focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/10"
          />
        </div>
        <div className="flex gap-4">
          <select value={category} onChange={(e) => updateCategory(e.target.value)} className="bg-surface-container-low border border-outline-variant text-on-surface-variant text-[12px] leading-[16px] font-semibold uppercase tracking-wider rounded-md px-4 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none">
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <select value={stockStatus} onChange={(e) => updateStockStatus(e.target.value)} className="bg-surface-container-low border border-outline-variant text-on-surface-variant text-[12px] leading-[16px] font-semibold uppercase tracking-wider rounded-md px-4 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none">
            {stockStatuses.map((status) => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </div>

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
              {loading ? (
                <tr><td colSpan="7" className="py-12 text-center text-on-surface-variant">Loading products...</td></tr>
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-[#F1F5F9] hover:bg-surface-bright transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-md object-cover" />
                      <div><p className="font-medium text-on-surface">{product.name}</p></div>
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
                      <button onClick={() => handleDelete(product)} disabled={deleting === product.id} className="px-4 py-2 text-on-surface-variant hover:text-error transition-colors hover:bg-surface-container-low rounded-md disabled:opacity-50" aria-label="Delete product">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-on-surface-variant/30 text-6xl mb-4 block">inventory_2</span>
            <p className="text-[16px] leading-[24px] text-on-surface-variant">No products found</p>
            <p className="text-[14px] leading-[20px] text-on-surface-variant/70 mt-1">Try adjusting your filters or search term</p>
          </div>
        )}
        <div className="px-6 py-4 border-t border-surface-container-highest bg-white flex items-center justify-between">
          <span className="text-[14px] leading-[20px] text-sm text-on-surface-variant">Showing {filteredProducts.length} of {totalProducts} entries</span>
          <div className="flex items-center gap-2">
            <button type="button" disabled={page === 1 || loading} onClick={() => setPage((current) => current - 1)} className="rounded-md border border-outline-variant px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
            <span className="px-2 text-sm text-on-surface-variant">Page {page} of {totalPages}</span>
            <button type="button" disabled={page >= totalPages || loading} onClick={() => setPage((current) => current + 1)} className="rounded-md border border-outline-variant px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
