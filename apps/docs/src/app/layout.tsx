import type { Metadata, Viewport } from 'next';
import { ThemeScript } from '@nexub/react';
import { ClientProviders } from '@/components/ClientProviders';
import { searchIndex } from '@/registry/index';
import { TRUSTED_TYPES_POLICY } from '@/lib/trusted';
import { SITE_URL } from './site';
import '@/styles/globals.css';

const description =
  'The official design system for Nexub products. Components, tokens, and patterns for building beautiful SaaS interfaces.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Nexub DS', template: '%s — Nexub DS' },
  description,
  openGraph: { type: 'website', siteName: 'Nexub DS', title: 'Nexub DS', description },
  twitter: { card: 'summary', title: 'Nexub DS', description },
  icons: {
    icon: '/nexub-icon.svg',
    shortcut: '/nexub-icon.svg',
    apple: '/nexub-icon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-expression="vivid" suppressHydrationWarning>
      <head>
        {/* First: the Trusted Types default policy must exist before any other script runs. */}
        <script dangerouslySetInnerHTML={{ __html: TRUSTED_TYPES_POLICY }} />
        {/* Keys must match ClientProviders' storageKey, BrandSwitcher and ContrastSwitcher. */}
        <ThemeScript productStorageKey="nexub-brand" contrastStorageKey="nexub-contrast" />
        {/* Hold the first paint until the page body is parsed (Chromium; others ignore it). On a
            slow CPU the parser yields partway through a long page, and a half-parsed page paints:
            a centred preview then moves when the code block below it, or the rest of the example,
            arrives. The marker sits after the visible content, before Next's data scripts. */}
        <link rel="expect" href="#nx-content-end" blocking="render" />
      </head>
      <body className="m-0" suppressHydrationWarning>
        <ClientProviders searchIndex={searchIndex}>
          {children}
        </ClientProviders>
        <div id="nx-content-end" hidden />
      </body>
    </html>
  );
}
