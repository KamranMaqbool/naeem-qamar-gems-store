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
  if (params.ordering) query.set('ordering', params.ordering);
  const qs = query.toString();
  const data = await apiFetch(`/products/${qs ? '?' + qs : ''}`);
  return data.results || data;
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
