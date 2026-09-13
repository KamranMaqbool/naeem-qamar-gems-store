const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams();
  if (params.category) query.set('category', params.category);
  if (params.min_price) query.set('min_price', params.min_price);
  if (params.max_price) query.set('max_price', params.max_price);
  if (params.search) query.set('search', params.search);
  if (params.is_featured) query.set('is_featured', params.is_featured);
  if (params.cut_shape) query.set('cut_shape', params.cut_shape);
  if (params.gemstone_type) query.set('gemstone_type', params.gemstone_type);
  if (params.carat_ranges) query.set('carat_ranges', params.carat_ranges);
  if (params.stock_status) query.set('stock_status', params.stock_status);
  if (params.ordering) query.set('ordering', params.ordering);
  if (params.page) query.set('page', params.page);
  if (params.page_size) query.set('page_size', params.page_size);
  const qs = query.toString();
  const data = await apiFetch(`/products/${qs ? '?' + qs : ''}`);
  return params.withMeta ? data : data.results || data;
}

export async function fetchProductBySlug(slug) {
  return apiFetch(`/products/${slug}/`);
}

export async function fetchCategories() {
  const data = await apiFetch('/products/categories/');
  return data.results || data;
}

export async function fetchStoreSettings() {
  return apiFetch('/settings/public/');
}

export async function submitBespokeInquiry(data) {
  return apiFetch('/bespoke/request/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function validateDiscountCode(code, cartTotal) {
  return apiFetch('/discounts/validate/', {
    method: 'POST',
    body: JSON.stringify({ code, cart_total: cartTotal }),
  });
}

export async function addToServerCart(productId, quantity) {
  return apiFetch('/cart/items/', {
    method: 'POST',
    body: JSON.stringify({ product_id: productId, quantity }),
  });
}

export async function checkoutOrder(data) {
  return apiFetch('/orders/checkout/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
