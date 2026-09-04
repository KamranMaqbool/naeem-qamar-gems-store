const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

let accessToken = localStorage.getItem('access_token');
let refreshToken = localStorage.getItem('refresh_token');

export function setTokens(access, refresh) {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

export function isAuthenticated() {
  return !!accessToken;
}

async function refreshAccessToken() {
  if (!refreshToken) throw new Error('No refresh token');
  const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  if (!res.ok) {
    clearTokens();
    throw new Error('Token refresh failed');
  }
  const data = await res.json();
  accessToken = data.access;
  localStorage.setItem('access_token', data.access);
  return data.access;
}

async function authFetch(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  let res = await fetch(`${API_BASE}${url}`, { ...options, headers });

  if (res.status === 401 && refreshToken) {
    try {
      await refreshAccessToken();
      headers['Authorization'] = `Bearer ${accessToken}`;
      res = await fetch(`${API_BASE}${url}`, { ...options, headers });
    } catch {
      throw new Error('Authentication expired');
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API error: ${res.status}`);
  }
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Invalid credentials');
  const data = await res.json();
  setTokens(data.access, data.refresh);
  return data;
}

export async function fetchAdminProducts(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.category) query.set('category', params.category);
  if (params.status) query.set('status', params.status);
  const qs = query.toString();
  return authFetch(`/admin/products/${qs ? '?' + qs : ''}`);
}

export async function fetchCategories() {
  return authFetch('/catalog/categories/');
}

export async function createProduct(data) {
  return authFetch('/admin/products/', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateProduct(id, data) {
  return authFetch(`/admin/products/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function deleteProduct(id) {
  return authFetch(`/admin/products/${id}/`, { method: 'DELETE' });
}

export async function fetchAdminOrders(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.status) query.set('status', params.status);
  if (params.page) query.set('page', params.page);
  const qs = query.toString();
  return authFetch(`/admin/orders/${qs ? '?' + qs : ''}`);
}

export async function updateOrder(id, data) {
  return authFetch(`/admin/orders/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function fetchAdminOrder(id) {
  return authFetch(`/admin/orders/${id}/`);
}

export async function deleteOrder(id) {
  return authFetch(`/admin/orders/${id}/`, { method: 'DELETE' });
}

export async function fetchInventory(params = {}) {
  const query = new URLSearchParams();
  if (params.status) query.set('stock_status', params.status);
  if (params.search) query.set('search', params.search);
  if (params.page) query.set('page', params.page);
  const qs = query.toString();
  return authFetch(`/admin/inventory/${qs ? '?' + qs : ''}`);
}

export async function updateInventory(id, data) {
  return authFetch(`/admin/inventory/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function receiveStock(data) {
  return authFetch('/admin/inventory/receive-stock/', { method: 'POST', body: JSON.stringify(data) });
}

export async function fetchDashboardKPIs() {
  return authFetch('/admin/analytics/dashboard-kpis/');
}

export async function fetchRevenueChart(period = 'daily') {
  return authFetch(`/admin/analytics/revenue-chart/?period=${period}`);
}

export async function fetchSalesByGemstone() {
  return authFetch('/admin/analytics/sales-by-gemstone/');
}

export async function fetchAdminDiscounts() {
  return authFetch('/admin/discounts/');
}

export async function createDiscount(data) {
  return authFetch('/admin/discounts/', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateDiscount(id, data) {
  return authFetch(`/admin/discounts/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function deleteDiscount(id) {
  return authFetch(`/admin/discounts/${id}/`, { method: 'DELETE' });
}

export async function fetchAdminSettings() {
  return authFetch('/settings/');
}

export async function fetchAdminCustomers(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.isVip !== '') query.set('is_vip', params.isVip);
  if (params.page) query.set('page', params.page);
  const qs = query.toString();
  return authFetch(`/admin/customers/${qs ? '?' + qs : ''}`);
}

export async function fetchAdminCustomer(id) {
  return authFetch(`/admin/customers/${id}/`);
}

export async function fetchProfile() {
  return authFetch('/users/me/');
}

export async function updateProfile(data) {
  return authFetch('/users/me/', { method: 'PATCH', body: JSON.stringify(data) });
}

export async function updateAdminSettings(data) {
  return authFetch('/settings/', { method: 'PUT', body: JSON.stringify(data) });
}
