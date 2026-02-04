import { Outlet } from 'react-router-dom';
import { AppShell } from '@/app/AppShell';
import BottomNav from '@/shared/components/BottomNav';

export function AppLayout() {
  return (
    <AppShell>
    <div className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      <BottomNav />
    </div>
    </AppShell>
  );
}