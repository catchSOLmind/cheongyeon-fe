// pages/KakaoCallbackPage.tsx
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicClient } from '../api/publicClient';
import { setAccessToken, setRefreshToken } from '../utils/token';
import { useAuthStore } from '../stores/useAuthStore';
import { useUserStore } from '../stores/useUserStore';
import type { KakaoLoginResponse } from '../types/auth.types';


function KakaoCallbackPage() {
  const hasRequested = useRef(false);
  const navigate = useNavigate();
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (hasRequested.current) return;
    hasRequested.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    // 인가코드 로그 출력
    // console.log('카카오 인가코드:', code);

    if (!code) {
      console.error('인가 코드 없음');
      navigate('/login', { replace: true });
      return;
    }

    // 쿼리 파라미터로 전송: POST /oauth/kakao/login?code=XXXXX
    publicClient.post<KakaoLoginResponse>('/oauth/kakao/login', null, {
      params: { code,
        // 카카오 로그인 개발환경에서의 테스트를 위한 리다이렉트 URI
        // 배포전에 삭제 필요
        redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI
       }
    })
      .then((response) => {
        const { accessToken, refreshToken, user } = response.data.result;
        
        // 1. 토큰 저장 (localStorage)
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        
        // 2. 인증 상태 업데이트
        initializeAuth();
        
        // 3. 유저 정보 저장 (받은 정보 활용)
        setUser(user);
        
        // 4. 홈으로 이동 (React Router 사용)
        navigate('/calendar', { replace: true });
      })
      .catch((error) => {
        console.error('카카오 로그인 실패:', error);
        navigate('/login', { replace: true });
      });
  }, [initializeAuth, setUser, navigate]);

  return <div>카카오 로그인 처리중...</div>;
}

export default KakaoCallbackPage;