// pages/KakaoCallbackPage.tsx
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicClient } from '../api/publicClient';
import { setAccessToken, setRefreshToken } from '../utils/token';
import { useAuthStore } from '../stores/useAuthStore';
import { useUserStore } from '../stores/useUserStore';
import type { KakaoLoginResponse } from '../types/auth.types';
import type { UserProfile } from '@/features/calendar/types/profile.types';

function KakaoCallbackPage() {
  const hasRequested = useRef(false);
  const navigate = useNavigate();

  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  
  const setProfileFromLogin = useUserStore((state) => state.setProfileFromLogin);

  useEffect(() => {
    if (hasRequested.current) return;
    hasRequested.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    // if (!code) {
    //   console.error('인가 코드 없음');
    //   navigate('/login', { replace: true });
    //   return;
    // }

    publicClient
      .post<KakaoLoginResponse>('/oauth/kakao/login', null, {
        params: {
          code,
          // 배포 전 필요 시만 사용
          //redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
        },
      })
      .then((response) => {

        const { accessToken, refreshToken, user } = response.data.result;

        // 1) 토큰 저장 (localStorage)
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);

        // 2) 인증 상태 업데이트
        initializeAuth();

        // 3) 전역 프로필 저장 (닉네임/프로필이미지/태그)
        const profile: UserProfile = {
            userId: user.userId,
            nickname: user.nickname,

            // 로그인 응답 키에 맞춰서
            profileImageUrl: user.profileImg ?? null, 

            // 나중에 프로필 API로 채울 값
            hasCompleted: false,
            groupId: null,
            houseworkType: undefined,
            houseworkTypeLabel: null,
          };
        setProfileFromLogin(profile);

        // 4) 이동 분기 (초대 수락 플로우 우선)
        const postLoginAction = sessionStorage.getItem('postLoginAction');
        const pendingInvitationId = sessionStorage.getItem('pendingInvitationId');


        if (postLoginAction === 'ACCEPT_INVITE' && pendingInvitationId) {
          navigate('/invite/accept', { replace: true });
          return;
        }

        // 기본 이동
        navigate('/calendar', { replace: true });
      })
      .catch((error) => {
        console.error('카카오 로그인 실패:', error);
        navigate('/login', { replace: true });
      });
  }, [initializeAuth, setProfileFromLogin, navigate]);

  return <div>카카오 로그인 처리중...</div>;
}

export default KakaoCallbackPage;
