import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { ClientProviders } from '@/components/ClientProviders';
import '@/styles/globals.css';

// Lazy-load SearchModal — it pulls in cmdk + full registry search index.
// Never needed on first paint; loads only when CMD+K is pressed.
const SearchModal = dynamic(
  () => import('@/components/docs/SearchModal').then((m) => m.SearchModal),
  { ssr: false },
);

export const metadata: Metadata = {
  title: { default: 'Nexub DS', template: '%s — Nexub DS' },
  description: 'The official design system for Nexub products. Components, tokens, and patterns for building beautiful SaaS interfaces.',
  icons: {
    icon: '/nexub-icon.svg',
    shortcut: '/nexub-icon.svg',
    apple: '/nexub-icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ margin: 0 }}>
        <ClientProviders>
          {children}
          <SearchModal />
        </ClientProviders>
      </body>
    </html>
  );
}
