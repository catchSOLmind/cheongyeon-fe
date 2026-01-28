// KakaoCallbackPage.tsx
import { useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import type { KakaoLoginRequest, KakaoLoginResponse } from '../types/auth.types';

function KakaoCallbackPage() {
  const hasRequested = useRef(false);

  useEffect(() => {
    // 중복 요청 방지
    if (hasRequested.current) {
      return;
    }
    hasRequested.current = true;

    // URL에서 인가코드 꺼내기
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
      console.error('인가 코드 없음');
      return;
    }

    // 백엔드로 인가코드 전달
    const requestData: KakaoLoginRequest = { code };
    
    api.post<KakaoLoginResponse>('/oauth/kakao/login', requestData)
      .then((response) => {
        console.log('로그인 성공:', response.data);
        
        // 로그인 성공 → 홈으로 이동
        window.location.replace('/');
      })
      .catch((error) => {
        console.error('카카오 로그인 실패:', error);
      });
  }, []);

  // 카카오 로그인 처리중
  return <div>카카오 로그인 처리중...</div>;
}

export default KakaoCallbackPage;
