import type { ReactNode } from 'react';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-outer">
      <div className="app-frame">{children}</div>
    </div>
  );
}
