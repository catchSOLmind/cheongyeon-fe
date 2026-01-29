import type { ReactNode } from 'react';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-outer relative min-h-screen">
      <div className="app-frame relative min-h-screen pb-16">{children}</div>
    </div>
  );
}
