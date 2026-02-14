// Grid.tsx

import type { ReactNode } from 'react';

interface GridProps {
  children: ReactNode;
  cols?: number;
}

export const Grid = ({ children, cols = 4 }: GridProps) => {
  return (
    <div 
      className="grid gap-3 w-full max-w-sm mx-auto p-2"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {children}
    </div>
  );
};
