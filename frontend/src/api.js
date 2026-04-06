import axios from 'axios';

// ✅ Use deployed backend URL
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL + '/api',
});

// Attach token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('luccica_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────────
export const adminLogin = (data) => API.post('/auth/admin-login', data);
export const userLogin = (data) => API.post('/auth/user-login', data);

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