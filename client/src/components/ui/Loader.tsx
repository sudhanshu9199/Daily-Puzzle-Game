// src/components/ui/Loader.tsx
import { Loader2 } from 'lucide-react';

export const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-slate-50">
    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
  </div>
);