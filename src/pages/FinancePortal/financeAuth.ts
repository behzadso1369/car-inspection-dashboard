const FINANCE_TOKEN_KEY = 'financeAccessToken';

export const getFinanceAccessToken = () => localStorage.getItem(FINANCE_TOKEN_KEY) || '';

export const setFinanceAccessToken = (token: string) => {
  localStorage.setItem(FINANCE_TOKEN_KEY, token);
};

export const clearFinanceAuth = () => {
  localStorage.removeItem(FINANCE_TOKEN_KEY);
};

export const isFinanceLoggedIn = () => !!getFinanceAccessToken();
