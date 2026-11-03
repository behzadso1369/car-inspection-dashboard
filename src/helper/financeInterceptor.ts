import axios from 'axios';
import { API_ORIGIN } from '../config/api/base-url';
import { clearFinanceAuth, getFinanceAccessToken } from '../pages/FinancePortal/financeAuth';

export const FINANCE_API_BASE = `${API_ORIGIN}/api/Finance/`;

const financeInstance = axios.create({
  baseURL: FINANCE_API_BASE,
});

financeInstance.interceptors.request.use((config) => {
  const token = getFinanceAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

financeInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearFinanceAuth();
      if (!window.location.pathname.startsWith('/finance/login')) {
        window.location.href = '/finance/login';
      }
    }
    return Promise.reject(error);
  }
);

export default financeInstance;
