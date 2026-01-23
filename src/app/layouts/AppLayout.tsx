import { Outlet } from 'react-router-dom';
import { AppShell } from '@/app/AppShell';
import BottomNav from '@/shared/components/BottomNav';

export function AppLayout() {
  return (
    <AppShell>
        <Outlet />
      <BottomNav />
    </AppShell>
  );
}