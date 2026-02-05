import { Outlet } from 'react-router-dom';
import { AppShell } from '@/app/AppShell';

export function DefaultLayout() {
  return (
    <AppShell>
      <div className="min-h-dvh bg-gray-50 overflow-y-auto">
        <Outlet />
      </div>
    </AppShell>
  );
}