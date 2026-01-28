// 카카오 로그인 요청
export interface KakaoLoginRequest {
  code: string;
}

// 카카오 로그인 응답
export interface KakaoLoginResponse {
  tokenType: 'bearer'; // 토큰 타입, bearer로 고정
  accessToken: string; 
  expiresIn: number; // 토큰 만료 시간 (초)
  refreshToken: string; // 리프레시 토큰
  user: {
    id: number;
    nickname: string;
    provider: string;
  };
}
