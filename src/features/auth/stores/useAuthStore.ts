// stores/useAuthStore.ts
import { create } from 'zustand';
import { getAccessToken, clearTokens } from '../utils/token';

interface AuthState {
  isAuthenticated: boolean;
  isAuthChecked: boolean;         
  initializeAuth: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isAuthChecked: false,           

  initializeAuth: () => {
    const hasToken = !!getAccessToken();
    set({ isAuthenticated: hasToken, isAuthChecked: true }); 
  },

  logout: () => {
    clearTokens();
    set({ isAuthenticated: false, isAuthChecked: true }); 

    import('./useUserStore')
      .then(({ useUserStore }) => {
        useUserStore.getState().clearUser();
      })
      .catch(() => {});
  },
}));
