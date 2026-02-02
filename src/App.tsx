import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { appRouter } from '@/app/router/appRoutes';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useUserStore } from '@/features/auth/stores/useUserStore';

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const user = useUserStore((state) => state.user);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);

  // 1. 앱 초기화 시 토큰 확인하여 인증 상태 복원
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // 2. 로그인 상태면 유저 정보 조회
  useEffect(() => {
    if (isAuthChecked && isAuthenticated && !user) {
      fetchUser();
    }
  }, [isAuthChecked, isAuthenticated, user, fetchUser]);

  return <RouterProvider router={appRouter} />;
}