// pages/KakaoCallbackPage.tsx
import { useEffect, useRef } from 'react';
import { publicClient } from '../api/publicClient';
import { setAccessToken, setRefreshToken } from '../utils/token';
import { useAuthStore } from '../stores/useAuthStore';
import { useUserStore } from '../stores/useUserStore';
import type { KakaoLoginRequest, KakaoLoginResponse } from '../types/auth.types';

function KakaoCallbackPage() {
  const hasRequested = useRef(false);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (hasRequested.current) return;
    hasRequested.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
      console.error('인가 코드 없음');
      window.location.replace('/login');
      return;
    }

    const requestData: KakaoLoginRequest = { code };
    
    publicClient.post<KakaoLoginResponse>('/oauth/kakao/login', requestData)
      .then((response) => {
        const { accessToken, refreshToken, user } = response.data;
        
        // 1. 토큰 저장 (localStorage)
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        
        // 2. 인증 상태 업데이트
        initializeAuth();
        
        // 3. 유저 정보 저장 (받은 정보 활용)
        setUser(user);
        
        // 4. 홈으로 이동 
        window.location.replace('/');
      })
      .catch((error) => {
        console.error('카카오 로그인 실패:', error);
        window.location.replace('/login');
      });
  }, [initializeAuth, setUser]);

  return <div>카카오 로그인 처리중...</div>;
}

export default KakaoCallbackPage;