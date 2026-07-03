const API_BASE = 'http://localhost:5000/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<any> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function loginVendor(email: string, password: string): Promise<any> {
  const res = await fetch(`${API_BASE}/auth/login/vendor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function registerVendor(data: any): Promise<any> {
  const res = await fetch(`${API_BASE}/auth/register/vendor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Registration failed' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function getProfile(): Promise<any> {
  return fetchWithAuth('/vendors/profile');
}

export async function updateProfile(data: any): Promise<any> {
  return fetchWithAuth('/vendors/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getPackages(): Promise<any[]> {
  return fetchWithAuth('/packages');
}

export async function getPublicPackages(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/packages/public`);
  if (!res.ok) throw new Error('Failed to fetch packages');
  return res.json();
}

export async function getPackage(id: number): Promise<any> {
  return fetchWithAuth(`/packages/${id}`);
}

export async function createPackage(data: any): Promise<any> {
  return fetchWithAuth('/packages', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePackage(id: number, data: any): Promise<any> {
  return fetchWithAuth(`/packages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deletePackage(id: number): Promise<any> {
  return fetchWithAuth(`/packages/${id}`, {
    method: 'DELETE',
  });
}

export async function uploadImage(file: File, type: 'banner' | 'logo' | 'package'): Promise<any> {
  const token = getToken();
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_BASE}/upload/${type}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// ===== DASHBOARD & REPORTS =====
export async function getDashboard(): Promise<any> {
  return fetchWithAuth('/vendors/dashboard');
}

export async function getReports(year?: string, type?: string): Promise<any> {
  const params = new URLSearchParams();
  if (year) params.set('year', year);
  if (type) params.set('type', type);
  const qs = params.toString();
  return fetchWithAuth(`/vendors/reports${qs ? '?' + qs : ''}`);
}

export async function exportReport(format: 'pdf' | 'excel', year?: string, type?: string): Promise<void> {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams();
  if (year) params.set('year', year);
  if (type) params.set('type', type);
  const qs = params.toString();
  const res = await fetch(`http://localhost:5000/api/vendors/reports/export/${format}${qs ? '?' + qs : ''}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Export failed' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `report.${format}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ===== SERVICES =====
export async function getVendorServices(): Promise<any[]> {
  return fetchWithAuth('/vendors/my-services');
}

export async function getAllServices(params?: { vendorId?: number; categoryId?: number }): Promise<any[]> {
  const query = params ? '?' + new URLSearchParams(Object.entries(params).filter(([_, v]) => v).map(([k, v]) => [k, String(v)])).toString() : '';
  return fetchWithAuth(`/services${query}`);
}

export async function getServiceById(id: number): Promise<any> {
  return fetchWithAuth(`/services/${id}`);
}

export async function createService(data: any): Promise<any> {
  return fetchWithAuth('/services', { method: 'POST', body: JSON.stringify(data) });
}

// ===== REVIEWS =====
export async function getVendorReviews(vendorId: number): Promise<any> {
  return fetchWithAuth(`/reviews/vendor/${vendorId}`);
}

export async function createReview(data: any): Promise<any> {
  return fetchWithAuth('/reviews', { method: 'POST', body: JSON.stringify(data) });
}

// ===== NOTIFICATIONS =====
export async function getNotifications(): Promise<any> {
  return fetchWithAuth('/notifications');
}

export async function markNotificationRead(id: number): Promise<any> {
  return fetchWithAuth(`/notifications/${id}/read`, { method: 'PUT' });
}

export async function markAllNotificationsRead(): Promise<any> {
  return fetchWithAuth('/notifications/read-all', { method: 'PUT' });
}

// ===== CATEGORIES =====
export async function getCategories(): Promise<any[]> {
  return fetchWithAuth('/categories');
}

// ===== BOOKINGS (Vendor) =====
export async function getVendorBookings(): Promise<any[]> {
  return fetchWithAuth('/bookings/vendor');
}

export async function getBookingById(id: number): Promise<any> {
  return fetchWithAuth(`/bookings/${id}`);
}

export async function updateBookingStatus(id: number, status: string): Promise<any> {
  return fetchWithAuth(`/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
}

// ===== ORDERS (Vendor) =====
export async function getVendorOrders(): Promise<any[]> {
  return fetchWithAuth('/orders/vendor');
}

export async function updateOrderStatus(id: number, status: string): Promise<any> {
  return fetchWithAuth(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
}

// ===== PAYMENTS (Vendor) =====
export async function getVendorPayments(): Promise<any> {
  return fetchWithAuth('/vendors/payments');
}

// ===== MESSAGES =====
export async function getConversations(): Promise<any[]> {
  return fetchWithAuth('/messages/conversations');
}

export async function getMessages(conversationId: string): Promise<any> {
  return fetchWithAuth(`/messages/${conversationId}`);
}

export async function sendMessage(receiverId: number, message: string): Promise<any> {
  return fetchWithAuth('/messages/send', { method: 'POST', body: JSON.stringify({ receiverId, message }) });
}
