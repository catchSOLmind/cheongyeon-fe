// src/App.tsx
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { appRouter } from '@/app/router/appRoutes';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useUserStore } from '@/features/auth/stores/useUserStore';

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);

  const profile = useUserStore((state) => state.profile);
  const isProfileFetched = useUserStore((s) => s.isProfileFetched);
  const fetchProfile = useUserStore((state) => state.fetchProfile);

  // 1) 앱 초기화 시 토큰 확인하여 인증 상태 복원
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // 2) 로그인 상태면 프로필 조회 (중복 호출 방지: profile 없고 로딩 아닐 때만)
  useEffect(() => {
    if (isAuthChecked && isAuthenticated && profile && !isProfileFetched) {
      fetchProfile();
    }
  }, [isAuthChecked, isAuthenticated, profile, isProfileFetched, fetchProfile]);

  return <RouterProvider router={appRouter} />;
}