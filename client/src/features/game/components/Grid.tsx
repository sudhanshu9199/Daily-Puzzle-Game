// Grid.tsx

import type { ReactNode } from 'react';

interface GridProps {
  children: ReactNode;
  cols?: number;
}

export const Grid = ({ children, cols = 4 }: GridProps) => {
  return (
    <div 
      className="grid gap-2 w-full max-w-sm mx-auto"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {children}
    </div>
  );
};

// export const Grid = ({ children }: { children: ReactNode }) => {
//   return (
//     <div className="grid grid-cols-4 gap-3 p-4 bg-slate-100 rounded-xl shadow-inner mx-auto max-w-sm">
//       {children}
//     </div>
//   );
// };