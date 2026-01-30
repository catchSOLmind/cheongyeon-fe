import { Outlet } from 'react-router-dom';
import { AppShell } from '@/app/AppShell';

export function DefaultLayout() {
  return (
    <AppShell>
      <div className="min-h-screen bg-gray-50">
        <Outlet />
      </div>
    </AppShell>
  );
}