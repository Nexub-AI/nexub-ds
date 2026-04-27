'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { ThemeProvider, TooltipProvider } from '@nexub/react';

// ssr:false is only valid inside a Client Component — that's why this lives here
// and not in the Server Component layout. cmdk + registry index never land in
// the initial HTML payload; they load only when CMD+K is pressed.
const SearchModal = dynamic(
  () => import('@/components/docs/SearchModal').then((m) => m.SearchModal),
  { ssr: false },
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="nexub-theme">
      <TooltipProvider delayDuration={400}>
        {children}
        <SearchModal />
      </TooltipProvider>
    </ThemeProvider>
  );
}
