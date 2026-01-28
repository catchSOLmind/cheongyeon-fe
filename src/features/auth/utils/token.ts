// utils/token.ts
import axios from 'axios';
import type { RefreshTokenRequest, RefreshTokenResponse } from '../types/auth.types';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const storage = localStorage;

// 액세스 토큰 저장
export const setAccessToken = (token: string) => {
  storage.setItem(ACCESS_TOKEN_KEY, token);
};

// 액세스 토큰 조회
export const getAccessToken = (): string | null => {
  return storage.getItem(ACCESS_TOKEN_KEY);
};

// 리프레시 토큰 저장
export const setRefreshToken = (token: string) => {
  storage.setItem(REFRESH_TOKEN_KEY, token);
};

// 리프레시 토큰 조회
export const getRefreshToken = (): string | null => {
  return storage.getItem(REFRESH_TOKEN_KEY);
};

// 모든 토큰 제거
export const clearTokens = () => {
  storage.removeItem(ACCESS_TOKEN_KEY);
  storage.removeItem(REFRESH_TOKEN_KEY);
};

// 로그인 상태 확인
export const isAuthenticated = (): boolean => {
  return getAccessToken() !== null;
};

// 리프레시 토큰으로 액세스 토큰 갱신
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const baseURL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';
    const response = await axios.post<RefreshTokenResponse>(
      `${baseURL}/oauth/kakao/refresh`,
      { refreshToken } as RefreshTokenRequest,
      {
        withCredentials: false,
      }
    );

    const { accessToken } = response.data;
    setAccessToken(accessToken);

    return accessToken;
  } catch {
    // 리프레시 실패 시 토큰만 삭제 (store는 호출하는 쪽에서 처리)
    clearTokens();
    return null;
  }
};