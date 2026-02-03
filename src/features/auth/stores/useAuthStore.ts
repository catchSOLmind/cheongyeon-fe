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
    //console.log('🔐 [initializeAuth] 토큰 확인:', hasToken); 
    set({ isAuthenticated: hasToken, isAuthChecked: true }); 
    //console.log('✅ [initializeAuth] 완료:', { isAuthenticated: hasToken, isAuthChecked: true }); // 🔍

  },

  logout: () => {
    clearTokens();
    set({ isAuthenticated: false, isAuthChecked: true }); 

    import('./useUserStore')
      .then(({ useUserStore }) => {
        useUserStore.getState().clearProfile();
      })
      .catch(() => {});
  },
}));
