import { ReactNode } from 'react';

export function FixedPaginationBar({ children }: { children: ReactNode }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-card-border shadow-[0_-4px_20px_rgba(2,55,254,0.06)] lg:absolute lg:inset-x-0"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {children}
    </div>
  );
}

export default FixedPaginationBar;
