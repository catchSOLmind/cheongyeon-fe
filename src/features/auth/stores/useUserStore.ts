// src/features/auth/stores/useUserStore.ts
import { create } from 'zustand';
import type { AxiosError } from 'axios';
import { authenticatedClient } from '../api/client';
import type { ProfileResponse } from '@/features/calendar/types/profile.types';
import type { UserProfile } from '@/features/calendar/types/user.types';

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  isProfileFetched: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  setProfileFromLogin: (profile: UserProfile) => void; 
  clearProfile: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  isLoading: false,
  isProfileFetched: false,
  error: null,

  // 프로필 조회 (/profile)
  fetchProfile: async () => {
    // 이미 로딩 중이면 중복 요청 방지
    if (get().isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const res = await authenticatedClient.get<ProfileResponse>('/profile');
      const profile = res.data.result.profile;

      // 전역 저장: userId / nickname / profileImageUrl / houseworkTypeLabel (+email)
      set((state) => {if (!state.profile) {
        // 로그인 전인데 /profile 먼저 치는 케이스 방지
        return { isLoading: false, error: 'No userId in store yet' };
        }
        return {
          profile: {
            ...state.profile,
            houseworkTypeLabel: profile.houseworkTypeLabel,
          },
          isLoading: false,
          isProfileFetched: true,
        };
      });
    } catch (err) {
      const axiosError = err as AxiosError;
      const isUnauthorized = axiosError.response?.status === 401;

      // 401이면 인증 만료 → 로그아웃 처리
      if (isUnauthorized) {
        import('./useAuthStore')
          .then(({ useAuthStore }) => useAuthStore.getState().logout())
          .catch(() => {});
      }

      set({
        error: err instanceof Error ? err.message : 'Failed to fetch profile',
        isLoading: false,
      });
    }
  },

  // 로그인 응답으로 먼저 전역 반영 
  setProfileFromLogin: (profile) => {
    set({ profile, 
          isProfileFetched: false,
          error: null });
  },

  clearProfile: () =>
    set({
      profile: null,
      isProfileFetched: false,
      error: null,
    }),
}));
