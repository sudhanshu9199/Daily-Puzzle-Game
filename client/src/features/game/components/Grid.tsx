// Grid.tsx

import { ReactNode } from 'react';

export const Grid = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid grid-cols-4 gap-3 p-4 bg-slate-100 rounded-xl shadow-inner mx-auto max-w-sm">
      {children}
    </div>
  );
};