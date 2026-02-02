// 유저 정보 타입
export interface User {
  userId: number;
  email: string;
  nickname: string;
  profileImg: string;
}

// 카카오 로그인 요청
export interface KakaoLoginRequest {
  code: string;
}

// 카카오 로그인 응답
export interface KakaoLoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    accessToken: string; 
    expiresIn: number;
    refreshToken: string;
    refreshTokenExpiresIn: number;
    user: User;
  };
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