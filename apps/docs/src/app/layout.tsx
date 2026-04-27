import type { Metadata } from 'next';
import { ClientProviders } from '@/components/ClientProviders';
import '@/styles/globals.css';

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
      <body style={{ margin: 0 }} suppressHydrationWarning>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
