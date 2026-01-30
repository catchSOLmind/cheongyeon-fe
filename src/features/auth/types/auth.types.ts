// 유저 정보 타입
export interface User {
  id: number;
  nickname: string;
  provider: string;
  // 추후에 메일이 추가될 수 있음!! + 프로필 사진
}

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
  user: User;
}

// 리프레시 토큰 요청
export interface RefreshTokenRequest {
  refreshToken: string;
}

// 리프레시 토큰 응답
export interface RefreshTokenResponse {
  tokenType: 'bearer';
  accessToken: string;
  expiresIn: number;
}
