import { Outlet } from 'react-router-dom';
import { AppShell } from '@/app/AppShell';

export function AppLayout() {
  return (
    <AppShell>
      <Outlet />
      {/* 나중에 BottomNav */}
    </AppShell>
  );
}
