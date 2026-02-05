import type { ReactNode } from 'react';

export function AppShell({ children }: { children: ReactNode }) {
  return (
      <div className="app-outer relative">
      <div className="app-frame relative">{children}</div>
    </div>
  );
}
