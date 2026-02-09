import { Outlet } from 'react-router-dom';
import { AppShell } from '@/app/AppShell';

export function DefaultLayout() {
  return (
    <AppShell>
      <div className="min-h-dvh bg-white overflow-y-auto">
        <Outlet />
      </div>
    </AppShell>
  );
}