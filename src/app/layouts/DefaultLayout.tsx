import { Outlet } from 'react-router-dom';
import { AppShell } from '@/app/AppShell';

export function DefaultLayout() {
  return (
    <AppShell>
        <Outlet />
    </AppShell>
  );
}