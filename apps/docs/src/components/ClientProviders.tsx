'use client';

import * as React from 'react';
import { ThemeProvider, TooltipProvider } from '@nexub/react';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="nexub-theme">
      <TooltipProvider delayDuration={400}>
        {children}
      </TooltipProvider>
    </ThemeProvider>
  );
}
