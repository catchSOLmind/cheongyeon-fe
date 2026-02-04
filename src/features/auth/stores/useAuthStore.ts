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

  initializeAuth: async () => {
    const hasToken = !!getAccessToken();
    //console.log('🔐 [initializeAuth] 토큰 확인:', hasToken); 
    set({ isAuthenticated: hasToken, isAuthChecked: true }); 
    //console.log('✅ [initializeAuth] 완료:', { isAuthenticated: hasToken, isAuthChecked: true }); // 🔍
     // 토큰이 있으면 프로필 다시 조회
      if (hasToken) {
        const { useUserStore } = await import('./useUserStore');
        await useUserStore.getState().fetchProfile();
      }
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
