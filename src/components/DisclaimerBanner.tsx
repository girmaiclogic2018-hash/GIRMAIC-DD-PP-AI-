import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-amber-950/90 text-amber-200 px-4 py-2 text-xs md:text-sm font-medium border-b border-amber-800 flex items-center justify-center gap-2 text-center shadow-inner">
      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
      <span>
        <strong>Notice:</strong> AI-powered information assistant. Not an official government or Prosperity Party representative unless formally authorized.
      </span>
    </div>
  );
};
