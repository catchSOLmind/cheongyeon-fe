import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell } from '../AppShell';
import { setThemeColor } from '@/shared/utils/setThemeColor';

export function AuthLayout() {
  useEffect(() => {
    // 상태바(안드로이드/크롬)
    setThemeColor('#00bcd4');

    // 오버스크롤(바운스) 배경까지 하늘색
    // document.documentElement.classList.add('auth-theme');
    // document.body.classList.add('auth-theme');

    return () => {
      setThemeColor('#ffffff');
      document.documentElement.classList.remove('auth-theme');
      document.body.classList.remove('auth-theme');
    };
  }, []);

  return (
    <div className="min-h-dvh bg-primary">
      <AppShell>
        <Outlet />
      </AppShell>
    </div>
  );
}
