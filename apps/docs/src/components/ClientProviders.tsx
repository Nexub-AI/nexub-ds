'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { NexubProvider, ThemeProvider, TooltipProvider, Toaster } from '@nexub/react';

// The Pages middleware puts a per-request CSP nonce in <meta name="csp-nonce">;
// NexubProvider hands it to the <style> tags Radix overlays inject, so docs
// can run style-src-elem without 'unsafe-inline'. Absent at build time.
const cspNonce =
  typeof document === 'undefined'
    ? undefined
    : (document.querySelector<HTMLMetaElement>('meta[name="csp-nonce"]')?.content ?? undefined);
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
    <NexubProvider nonce={cspNonce}>
      <ThemeProvider defaultTheme="system" storageKey="nexub-theme">
        <TooltipProvider delayDuration={400}>
          {children}
          {!inFrame && <SearchModal searchIndex={searchIndex} />}
          {!inFrame && <FeedbackButton />}
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </NexubProvider>
  );
}
