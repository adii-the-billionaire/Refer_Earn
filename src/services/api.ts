import axios from 'axios';
import { User, Transaction, Earning } from '../types';

// const API_BASE_URL = 'http://localhost:5000/api';

const API_BASE_URL = 'https://5000-firebase-assignment07-1749642308774.cluster-ys234awlzbhwoxmkkse6qo3fz6.cloudworkstations.dev/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userService = {
  register: async (userData: { username: string; email: string; parentReferralCode?: string }): Promise<{ user: User; message: string }> => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  getUser: async (userId: string): Promise<User> => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },
};

export const transactionService = {
  createTransaction: async (transactionData: { userId: string; amount: number; description?: string }): Promise<{ transaction: Transaction; message: string; profitGenerated: boolean }> => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },

  getUserTransactions: async (userId: string): Promise<Transaction[]> => {
    const response = await api.get(`/transactions/user/${userId}`);
    return response.data;
  },

  getAllTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get('/transactions');
    return response.data;
  },
};

export const earningsService = {
  getUserEarnings: async (userId: string): Promise<Earning[]> => {
    const response = await api.get(`/earnings/user/${userId}`);
    return response.data;
  },

  getAllEarnings: async (): Promise<Earning[]> => {
    const response = await api.get('/earnings');
    return response.data;
  },
};

export default api;