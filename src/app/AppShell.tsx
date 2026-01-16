import type { ReactNode } from 'react';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div style={styles.outer}>
      <div style={styles.frame}>{children}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  outer: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    background: '#f6f7f9',
  },
  frame: {
    width: '100%',
    maxWidth: 390, // 모바일 폭 고정
    minHeight: '100vh',
    background: '#fff',
    boxShadow: '0 0 24px rgba(0,0,0,0.08)',
  },
};
