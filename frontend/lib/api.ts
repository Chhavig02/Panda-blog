import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const userApi = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/api/v1/users/register', data),
  getProfile: (id: string) => api.get(`/api/v1/users/profile/${id}`),
  updateProfile: (id: string, data: { bio?: string; avatar?: string }) =>
    api.put(`/api/v1/users/profile/${id}`, data),
  addTokens: (amount: number) => api.post('/api/v1/users/tokens/add', { amount }),
  upgradeToPremium: () => api.post('/api/v1/users/premium/upgrade'),
  getLeaderboard: (params?: { limit?: number }) => api.get('/api/v1/users/leaderboard', { params }),
};

export const postApi = {
  getAll: (params?: { page?: number; limit?: number; sort?: string; search?: string; tag?: string; authorId?: string }) =>
    api.get('/api/v1/posts', { params }),
  getTop: (limit?: number) => api.get('/api/v1/posts/top', { params: { limit } }),
  getById: (id: string) => api.get(`/api/v1/posts/${id}`),
  create: (data: { title: string; content: string; tags?: string[]; featuredImage?: string; isPremium?: boolean }) =>
    api.post('/api/v1/posts', data),
  update: (id: string, data: { title?: string; content?: string; tags?: string[]; featuredImage?: string }) =>
    api.put(`/api/v1/posts/${id}`, data),
  delete: (id: string) => api.delete(`/api/v1/posts/${id}`),
  like: (id: string) => api.post(`/api/v1/posts/${id}/like`),
  share: (id: string) => api.post(`/api/v1/posts/${id}/share`),
};

export const commentApi = {
  getByPost: (postId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/api/v1/comments/${postId}`, { params }),
  create: (postId: string, content: string) =>
    api.post(`/api/v1/comments/${postId}`, { content }),
  update: (id: string, content: string) =>
    api.put(`/api/v1/comments/${id}`, { content }),
  delete: (id: string) => api.delete(`/api/v1/comments/${id}`),
};

export default api;

