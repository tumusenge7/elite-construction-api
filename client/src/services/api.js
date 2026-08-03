import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  profile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const crud = (resource) => ({
  list: (params) => api.get(`/${resource}`, { params }),
  get: (id) => api.get(`/${resource}/${id}`),
  create: (data) => api.post(`/${resource}`, data),
  update: (id, data) => api.put(`/${resource}/${id}`, data),
  delete: (id) => api.delete(`/${resource}/${id}`),
});

export const contact = {
  submit: (data) => api.post('/contact', data),
};

export const estimator = {
  calculate: (data) => api.post('/estimator/calculate', data),
};

export const uploads = {
  upload: (file, category = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/uploads?category=${category}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadMultiple: (files, category = 'general') => {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    return api.post(`/uploads/multiple?category=${category}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const analytics = {
  dashboard: () => api.get('/analytics/dashboard'),
  projectsByStatus: () => api.get('/analytics/projects-by-status'),
  revenueByMonth: () => api.get('/analytics/revenue-by-month'),
  quotesByMonth: () => api.get('/analytics/quotes-by-month'),
  serviceDemand: () => api.get('/analytics/service-demand'),
};

export const notifications = {
  mine: (params) => api.get('/notifications/mine', { params }),
  unreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export default api;
