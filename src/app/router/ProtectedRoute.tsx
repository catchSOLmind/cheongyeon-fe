import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { getAccessToken } from '@/features/auth/utils/token';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthChecked = useAuthStore((s) => s.isAuthChecked);
  const hasToken = !!getAccessToken();

  // isAuthChecked 전이라도 토큰 있으면 렌더 허용
  if (!isAuthChecked) {
    return hasToken ? <>{children}</> : null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}