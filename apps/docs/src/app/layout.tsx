import type { Metadata, Viewport } from 'next';
import { ClientProviders } from '@/components/ClientProviders';
import { searchIndex } from '@/registry/index';
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

// Applies the persisted theme/brand before first paint (static export has no
// server to do it). Keys must match ClientProviders' storageKey and BrandSwitcher.
const prePaintScript = `try{var d=document.documentElement,t=localStorage.getItem('nexub-theme'),b=localStorage.getItem('nexub-brand');if(t==='light'||t==='dark')d.setAttribute('data-theme',t);if(b&&b!=='base')d.setAttribute('data-product',b)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prePaintScript }} />
      </head>
      <body style={{ margin: 0 }} suppressHydrationWarning>
        <ClientProviders searchIndex={searchIndex}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
