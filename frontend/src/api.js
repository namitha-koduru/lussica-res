import axios from 'axios';

// ✅ Use deployed backend URL
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL + '/api',
});

// Attach token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('lussica_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 errors - logout and redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.warn('⚠️ 401 Error: Token invalid or expired');
      localStorage.removeItem('lussica_token');
      localStorage.removeItem('lussica_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────
export const adminLogin = (data) => API.post('/auth/admin-login', data);
export const userLogin = (data) => API.post('/auth/user-login', data);
export const userSignup = (data) => API.post('/auth/user-signup', data);
export const getUserProfile = () => API.get('/auth/profile');
export const changePassword = (data) => API.post('/auth/change-password', data);

// ── Menu ──────────────────────────────────────────────────
export const getMenu = (category) =>
  API.get('/menu', { params: category ? { category } : {} });

export const getAdminMenu = (category) =>
  API.get('/menu/all', {
    params: category && category !== 'all' ? { category } : {},
  });

export const addMenuItem = (data) => API.post('/menu', data);
export const toggleMenuItem = (id) => API.patch(`/menu/${id}/toggle`);
export const deleteMenuItem = (id) => API.delete(`/menu/${id}`);

// ── Feedback ──────────────────────────────────────────────
export const submitFeedback = (data) => API.post('/feedback', data);
export const getFeedbacks = () => API.get('/feedback');

// ── Contact ───────────────────────────────────────────────
export const submitContact = (data) => API.post('/contact', data);

// ── Cart / Checkout ────────────────────────────────────────
export const checkout = (data) => API.post('/cart/checkout', data);
export const getUserOrders = () => API.get('/cart/my-orders');
export const getOrders = () => API.get('/cart/orders');
export const updateOrderStatus = (id, status) => API.patch(`/cart/orders/${id}/status`, { status });