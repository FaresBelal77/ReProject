import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Dashboard API
export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
  getGamesBySubject: (subject) => api.get(`/dashboard/games/subject/${subject}`),
  getCreativeActivities: () => api.get('/dashboard/creative'),
  getAchievements: () => api.get('/dashboard/achievements'),
};

// Games API
export const gamesAPI = {
  getAllGames: (params) => api.get('/games', { params }),
  getGame: (gameId) => api.get(`/games/${gameId}`),
  startGame: (gameId) => api.post(`/games/${gameId}/start`),
  submitAnswer: (sessionId, answerData) => api.post(`/games/session/${sessionId}/answer`, answerData),
  saveCreativeWork: (sessionId, creativeWork) => api.post(`/games/session/${sessionId}/creative`, { creativeWork }),
  endGame: (sessionId) => api.post(`/games/session/${sessionId}/end`),
};

// Monitoring API
export const monitoringAPI = {
  getMonitoringData: (userId, params) => api.get(`/monitoring/${userId}`, { params }),
  updateDailyMonitoring: () => api.post('/monitoring/update'),
  getChildren: () => api.get('/monitoring/children'),
};

// Safety API
export const safetyAPI = {
  detectUnsafeBehavior: (data) => api.post('/safety/detect', data),
  getSafetyAlerts: (userId, params) => api.get(`/safety/alerts/${userId}`, { params }),
  getSafetyStatistics: (userId) => api.get(`/safety/statistics/${userId}`),
  resolveAlert: (alertId, resolution) => api.put(`/safety/alerts/${alertId}/resolve`, { resolution }),
};

// Admin API
export const adminAPI = {
  getAllGames: () => api.get('/admin/games'),
  createGame: (gameData) => api.post('/admin/games', gameData),
  updateGame: (gameId, gameData) => api.put(`/admin/games/${gameId}`, gameData),
  toggleGameStatus: (gameId) => api.patch(`/admin/games/${gameId}/toggle`),
  deleteGame: (gameId) => api.delete(`/admin/games/${gameId}`),
  getAllUsers: () => api.get('/admin/users'),
};

export default api;

