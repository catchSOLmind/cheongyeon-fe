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
 * - 로그인 직후: setProfileFromLogin(profile)  // 임시값 저장
 * - 앱 진입 시: fetchProfile()               // /profile 1회 호출로 진짜값 덮어쓰기
 * - 로그아웃 시: clearProfile()
 *
 * ✅ 무한 재시도 방지:
 * - hasAttemptedFetch 플래그로 "성공/실패 상관없이 1회 시도" 후에는 자동 재호출 안 함
 * - 필요하면 fetchProfile(true) 로 강제 갱신 가능
 */

import { create } from 'zustand';
import type { AxiosError } from 'axios';
import { authenticatedClient } from '../api/client';
import type { ProfileResponse, UserProfile } from '@/features/calendar/types/profile.types';
import DEFAULT_PROFILE_IMAGE from '@/assets/common/img-default-profile.svg';

interface UserState {
  profile: UserProfile | null;

  isLoading: boolean;
  isProfileFetched: boolean;

  /** ✅ 성공/실패 상관없이 1회라도 /profile 시도했는지 */
  hasAttemptedFetch: boolean;

  error: string | null;

  /**
   * @param force true면 hasAttemptedFetch / isProfileFetched 무시하고 강제 호출
   */
  fetchProfile: (force?: boolean) => Promise<void>;

  /** 로그인 응답으로 받은 최소 프로필 저장(임시값) */
  setProfileFromLogin: (profile: UserProfile) => void;

  /** 로그아웃 등에서 프로필 초기화 */
  clearProfile: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,

  isLoading: false,
  isProfileFetched: false,

  hasAttemptedFetch: false,
  error: null,

  fetchProfile: async (force = false) => {
    const state = get();

    // 중복 요청 방지
    if (state.isLoading) return;

    // ✅ 성공/실패 상관없이 "이미 시도"했으면 자동 재호출 방지
    //    (원하면 force=true로 강제 갱신)
    if (!force && state.hasAttemptedFetch) return;

    // ✅ 호출 시작 시점에 hasAttemptedFetch를 true로 찍어서,
    //    실패해도 무한 재시도가 발생하지 않게 함
    set({ isLoading: true, error: null, hasAttemptedFetch: true });

    try {
      const res = await authenticatedClient.get<ProfileResponse>('/profile');

      if (!res.data) {
        throw new Error('No data in response');
      }

      const responseData = res.data;

      // profile과 personalityInfo가 있는지 확인
      if (!responseData.profile || !responseData.personalityInfo) {
        throw new Error('Invalid profile response structure');
      }

      const { profile, personalityInfo } = responseData;

      const userProfile: UserProfile = {
        userId: profile.userId,
        groupId: profile.groupId ?? null,
        nickname: profile.nickname,
        profileImageUrl: profile.profileImageUrl ?? DEFAULT_PROFILE_IMAGE,
        hasCompleted: personalityInfo.hasCompleted,
        houseworkType: personalityInfo.houseworkType,
        houseworkTypeLabel: personalityInfo.houseworkTypeLabel ?? null,
      };

      set({
        profile: userProfile,
        isLoading: false,
        isProfileFetched: true,
        error: null,
      });
    } catch (err) {
      const axiosError = err as AxiosError;
      const isUnauthorized = axiosError.response?.status === 401;

      if (isUnauthorized) {
        import('./useAuthStore')
          .then(({ useAuthStore }) => useAuthStore.getState().logout())
          .catch(() => {});
      }

      set({
        error: err instanceof Error ? err.message : 'Failed to fetch profile',
        isLoading: false,
        isProfileFetched: false,
        // hasAttemptedFetch: true 유지 (무한 재시도 방지)
      });
    }
  },

  setProfileFromLogin: (profile) => {
    // 로그인 응답은 임시값이므로 isProfileFetched는 false 유지
    // fetchProfile()로 진짜 프로필(/profile) 가져와 덮어쓰게 함
    set({
      profile: {
        ...profile,
        profileImageUrl: profile.profileImageUrl || DEFAULT_PROFILE_IMAGE,
      },
      isProfileFetched: false,
      hasAttemptedFetch: false, // ✅ 로그인 직후에는 아직 /profile 시도 안 했다고 보는게 자연스러움
      error: null,
    });
  },

  clearProfile: () => {
    set({
      profile: null,
      isProfileFetched: false,
      hasAttemptedFetch: false,
      error: null,
      isLoading: false,
    });
  },
}));
