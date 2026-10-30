'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { ThemeProvider, TooltipProvider, Toaster } from '@nexub/react';
import type { SearchEntry } from '@/registry/index';

// ssr:false is only valid inside a Client Component — that's why this lives here
// and not in the Server Component layout. The search index arrives as a prop
// from the root layout (server), so the full registry never ships to the client.
const SearchModal = dynamic(
  () => import('@/components/docs/SearchModal').then((m) => m.SearchModal),
  { ssr: false },
);

// The FAB itself is tiny; FeedbackButton lazy-loads the dialog (Turnstile,
// capture, annotation) on first click. Import the file directly — the
// feedback barrel re-exports the dialog statically.
const FeedbackButton = dynamic(
  () => import('@/components/feedback/FeedbackButton').then((m) => m.FeedbackButton),
  { ssr: false },
);

export function ClientProviders({
  children,
  searchIndex,
}: {
  children: React.ReactNode;
  searchIndex: SearchEntry[];
}) {
  // Preview frames (/frame/…) render one page template, without docs chrome.
  const inFrame = usePathname()?.startsWith('/frame/') ?? false;
  return (
    <ThemeProvider defaultTheme="system" storageKey="nexub-theme">
      <TooltipProvider delayDuration={400}>
        {children}
        {!inFrame && <SearchModal searchIndex={searchIndex} />}
        {!inFrame && <FeedbackButton />}
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}
