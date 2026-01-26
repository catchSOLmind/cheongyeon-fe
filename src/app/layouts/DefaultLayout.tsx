import { Outlet } from 'react-router-dom';
import { AppShell } from '@/app/AppShell';

/**
 * Renders the application shell and the currently matched child route.
 *
 * @returns The JSX layout containing AppShell with an Outlet for nested routes.
 */
export function DefaultLayout() {
  return (
    <AppShell>
        <Outlet />
    </AppShell>
  );
}