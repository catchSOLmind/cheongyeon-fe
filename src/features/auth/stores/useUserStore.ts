// src/features/auth/stores/useUserStore.ts

/**
 * 🧠 useUserStore
 *
 * [Usage]
 * const profile = useUserStore((s) => s.profile);
 * const avatarUrl = useUserStore((s) => s.profile?.profileImageUrl);
 * const fetchProfile = useUserStore((s) => s.fetchProfile);
 *
 * [When]
 * - 로그인 직후: setProfileFromLogin(profile)
 * - 앱 진입 시: fetchProfile()
 * - 로그아웃 시: clearProfile()
 */


import { create } from 'zustand';
import type { AxiosError } from 'axios';
import { authenticatedClient } from '../api/client';
import type { ProfileResponse } from '@/features/calendar/types/profile.types';
import type { UserProfile } from '@/features/calendar/types/user.types';
import DEFAULT_PROFILE_IMAGE from '@/assets/common/img-default-profile.svg'

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
      //console.log('[fetchProfile] 시작, 현재 profile:', get().profile); // 로그 1 

      const res = await authenticatedClient.get<ProfileResponse>('/profile');
      const profile = res.data.result.profile;

      //console.log('[fetchProfile] API 응답:', profile); // 로그 2

      // 전역 저장: userId / nickname / profileImageUrl / houseworkTypeLabel (+email)
      set((state) => {if (!state.profile) {
        // 로그인 전인데 /profile 먼저 치는 케이스 방지
        //console.error('[fetchProfile] profile이 없어서 실패');  // 로그 3
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
  set({
    profile: {
      ...profile,
      profileImageUrl: profile.profileImageUrl || DEFAULT_PROFILE_IMAGE,
    },
    isProfileFetched: false,
    error: null,
  });
},

  clearProfile: () =>
    set({
      profile: null,
      isProfileFetched: false,
      error: null,
    }),
}));
