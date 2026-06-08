import api from './api';
import { AuthResponse, User } from '../../shared/types/user';

export const authApi = {
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post('/auth/register', { name, email, password });
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  async getProfile(): Promise<{ success: boolean; data: User }> {
    const { data } = await api.get('/auth/profile');
    return data;
  },
};
