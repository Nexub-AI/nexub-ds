import type { Metadata, Viewport } from 'next';
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
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
