// stores/useUserStore.ts
import { create } from 'zustand';
import type { AxiosError } from 'axios';
import { authenticatedClient } from '../api/client';
import type { User } from '../types/auth.types';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  
  // 새로고침 했을 때 , 앱 처음 들어왔을 때 , 프로필 변경 등 유저 정보가 바뀌었을 때 호출
  fetchUser: async () => {
    // 이미 로딩 중이면 중복 요청 방지
    if (get().isLoading) {
      return;
    }
    
    set({ isLoading: true, error: null });
    try {
      const response = await authenticatedClient.get<User>('/api/profile');
      set({ user: response.data, isLoading: false });
    } catch (error) {
      const axiosError = error as AxiosError;
      const isUnauthorized = axiosError.response?.status === 401;
      
      // 401 에러인 경우 인증 상태도 클리어
      if (isUnauthorized) {
        // useAuthStore도 클리어 (순환 참조 방지를 위해 lazy import)
        import('./useAuthStore').then(({ useAuthStore }) => {
          useAuthStore.getState().logout();
        }).catch(() => {
          // store가 없거나 import 실패해도 무시
        });
      }
      
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch user',
        isLoading: false 
      });
    }
  },
  
  setUser: (user) => set({ user }),
  
  clearUser: () => set({ user: null, error: null }),
}));