import { Outlet } from 'react-router-dom';
import { AppShell } from '@/app/AppShell';
import BottomNav from '@/shared/components/BottomNav';
import { useUserStore } from '@/features/auth/stores/useUserStore';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useEffect } from 'react';


export function AppLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const fetchProfile = useUserStore((s) => s.fetchProfile);
  const isProfileFetched = useUserStore((s) => s.isProfileFetched);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (isProfileFetched) return;
    fetchProfile();
  }, [isAuthenticated, isProfileFetched, fetchProfile]);

  return (
    <AppShell>
    <div className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      <BottomNav />
    </div>
    </AppShell>
  );
}