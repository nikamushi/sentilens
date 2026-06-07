import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeSentiment = async (reviewText) => {
  const response = await api.post('/analyze', { review: reviewText });
  return response.data;
};

export const getHistory = async (search = '', page = 1, limit = 10) => {
  const response = await api.get('/history', {
    params: { search, page, limit },
  });
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

export const getEvaluationMetrics = async () => {
  const response = await api.get('/evaluation');
  return response.data;
};

export default {
  analyzeSentiment,
  getHistory,
  getDashboardStats,
  getEvaluationMetrics,
};
