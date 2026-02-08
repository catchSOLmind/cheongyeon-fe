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

// src/features/auth/stores/useUserStore.ts

import { create } from 'zustand';
import type { AxiosError } from 'axios';
import { authenticatedClient } from '../api/client';
import type { ProfileResponse, UserProfile } from '@/features/calendar/types/profile.types';
import DEFAULT_PROFILE_IMAGE from '@/assets/common/img-default-profile.svg';

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

fetchProfile: async () => {
  const state = get();

  if (state.isLoading) {
    //console.log('⏳ Already loading profile...');
    return;
  }

  if (state.isProfileFetched && state.profile) {
    //console.log('✅ Profile already fetched:', state.profile);
    return;
  }

  //console.log('🚀 Fetching profile...');
  set({ isLoading: true, error: null });

  try {
    const res = await authenticatedClient.get<ProfileResponse>('/profile');
    // console.log('📦 Full API Response:', res);
    // console.log('📦 Response data:', res.data);
    // console.log('📦 Response data.result:', res.data);

    // API 응답 구조 확인
    if (!res.data) {
      throw new Error('No data in response');
    }

    // res.data.result가 없는 경우 처리
    const responseData = res.data;
    
    //console.log('📦 Response data to use:', responseData);

    // profile과 personalityInfo가 있는지 확인
    if (!responseData.profile || !responseData.personalityInfo) {
      //console.error('❌ Invalid response structure:', responseData);
      throw new Error('Invalid profile response structure');
    }

    const { profile, personalityInfo } = responseData;

    const userProfile = {
      userId: profile.userId,
      groupId: profile.groupId,
      nickname: profile.nickname,
      profileImageUrl: profile.profileImageUrl ?? DEFAULT_PROFILE_IMAGE,
      hasCompleted: personalityInfo.hasCompleted,
      houseworkType: personalityInfo.houseworkType,
      houseworkTypeLabel: personalityInfo.houseworkTypeLabel,
    };

    //console.log('💾 Saving profile to store:', userProfile);

    set({
      profile: userProfile,
      isLoading: false,
      isProfileFetched: true,
      error: null,
    });
  } catch (err) {
    //console.error('❌ Profile fetch error:', err);
    
    const axiosError = err as AxiosError;
    const isUnauthorized = axiosError.response?.status === 401;

    // console.log('🔍 Error details:', {
    //   status: axiosError.response?.status,
    //   data: axiosError.response?.data,
    //   message: err instanceof Error ? err.message : 'Unknown error',
    //   isUnauthorized
    // });

    if (isUnauthorized) {
      // console.log('🚪 Unauthorized - logging out...');
      import('./useAuthStore')
        .then(({ useAuthStore }) => useAuthStore.getState().logout())
        .catch(() => {});
    }

    set({
      error: err instanceof Error ? err.message : 'Failed to fetch profile',
      isLoading: false,
      isProfileFetched: false,
    });
  }
},

  setProfileFromLogin: (profile) => {
    // console.log('📝 Setting profile from login:', profile);
    set({
      profile: {
        ...profile,
        profileImageUrl: profile.profileImageUrl || DEFAULT_PROFILE_IMAGE,
      },
      isProfileFetched: true, // 로그인시에는 true로 설정
      error: null,
    });
  },

  clearProfile: () => {
    // console.log('🗑️ Clearing profile...');
    set({
      profile: null,
      isProfileFetched: false,
      error: null,
    });
  },
}));