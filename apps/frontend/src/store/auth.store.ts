import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('ops_forge_token'),
  user: (() => {
    try {
      const raw = localStorage.getItem('ops_forge_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })(),

  setAuth: (token, user) => {
    localStorage.setItem('ops_forge_token', token);
    localStorage.setItem('ops_forge_user', JSON.stringify(user));
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem('ops_forge_token');
    localStorage.removeItem('ops_forge_user');
    set({ token: null, user: null });
  },
}));
