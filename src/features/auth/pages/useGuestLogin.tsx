// hooks/useGuestLogin.ts
import { useNavigate } from 'react-router-dom';
import { setAccessToken, setRefreshToken } from '../utils/token';
import { useAuthStore } from '../stores/useAuthStore';
import { useUserStore } from '../stores/useUserStore';

import type { UserProfile } from '@/features/calendar/types/profile.types';
import { guestLogin } from '../api/geustApi';

export function useGuestLogin() {
  const navigate = useNavigate();

  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const setProfileFromLogin = useUserStore((state) => state.setProfileFromLogin);

  const runGuestLogin = async () => {
    const res = await guestLogin();

    if (!res.isSuccess) {
      throw new Error(res.message ?? '게스트 로그인 실패');
    }

    const {
      accessToken,
      refreshToken,
      userId,
      nickname,
      groupId,
    //   groupName,
    //   memberStatus,
    } = res.result;

    // 1) 토큰 저장
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    // 2) 인증 상태 업데이트
    await initializeAuth();

    // 3) 전역 프로필 저장 (게스트는 이미지 없음)
    const profile: UserProfile = {
      userId,
      nickname,
      profileImageUrl: null,
      hasCompleted: false,
      groupId: groupId ?? null,
      houseworkType: undefined,
      houseworkTypeLabel: null,
    };
    setProfileFromLogin(profile);

    // 4) 이동 분기(카카오 로직 그대로 재사용)
    const postLoginAction = sessionStorage.getItem('postLoginAction');
    const pendingInvitationId = sessionStorage.getItem('pendingInvitationId');

    if (postLoginAction === 'ACCEPT_INVITE' && pendingInvitationId) {
      navigate('/invite/accept', { replace: true });
      return;
    }

    navigate('/calendar', { replace: true });
  };

  return { runGuestLogin };
}
