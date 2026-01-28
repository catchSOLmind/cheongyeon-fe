// stores/useAuthStore.ts
import { create } from 'zustand';
import { getAccessToken, clearTokens } from '../utils/token';

interface AuthState {
  isAuthenticated: boolean;
  initializeAuth: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  
  initializeAuth: () => {
    const hasToken = !!getAccessToken();
    set({ isAuthenticated: hasToken });
  },
  
  logout: () => {
    clearTokens();
    set({ isAuthenticated: false });
    
    // useUserStore도 클리어 (순환 참조 방지를 위해 lazy import)
    import('./useUserStore').then(({ useUserStore }) => {
      useUserStore.getState().clearUser();
    }).catch(() => {
      // store가 없거나 import 실패해도 무시
    });
  },
}));