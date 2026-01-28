// kakaoAuth.
// 카카로 로그인 URL 생성
export function getKakaoLoginUrl() {
    const clientId = import.meta.env.VITE_KAKAO_LOGIN_REST_API_KEY;
    const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  
    return (
      'https://kauth.kakao.com/oauth/authorize' +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      '&response_type=code'
    );
  }
  