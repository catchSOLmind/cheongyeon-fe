// stores/useAuthStore.ts
import { create } from 'zustand';

interface User {
  id: number;
  nickname: string;
  provider: string;
  // 추후에 메일이 추가될 수 있음!!
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: true 
  }),
  
  clearUser: () => set({ 
    user: null, 
    isAuthenticated: false 
  }),
}));