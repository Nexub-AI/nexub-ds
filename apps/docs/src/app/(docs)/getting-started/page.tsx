import type { Metadata } from 'next';
import { CodeBlock } from '@/components/docs/CodeBlock';

export const metadata: Metadata = { title: 'Getting Started' };

export default function GettingStartedPage() {
  return (
    <div className="docs-prose">
      <p className="text-[0.8rem] font-semibold text-[var(--color-primary)] tracking-wider uppercase mb-2">
        Introduction
      </p>
      <h1>Getting Started</h1>
      <p>
        Nexub DS is a token-driven React design system built for SaaS products.
        It ships with 89+ accessible components, 10 composite patterns, and 5 brand themes — all powered by CSS custom properties.
      </p>

      <h2>Installation</h2>
      <p>Install the core packages from your package manager:</p>
      <CodeBlock lang="bash" code={`npm install @nexub/react @nexub/themes @nexub/tokens @nexub/icons`} />

      <p>Or with pnpm:</p>
      <CodeBlock lang="bash" code={`pnpm add @nexub/react @nexub/themes @nexub/tokens @nexub/icons`} />

      <h2>Setup</h2>
      <p>
        Import the theme CSS files at your application root. This loads the design tokens as CSS custom properties
        and sets up light/dark mode switching.
      </p>
      <CodeBlock code={`// In your global CSS or entry file
import '@nexub/themes/base';   // resets + token aliases
import '@nexub/themes/light';  // light mode defaults
import '@nexub/themes/dark';   // optional: dark comes from light-dark() roles now`} />

      <h2>Tailwind</h2>
      <p>
        Components ship Tailwind class names, so your Tailwind (v3) build must use the Nexub preset and scan the
        package output. The preset maps the tokens and registers <code>tailwindcss-animate</code>.
      </p>
      <CodeBlock code={`// tailwind.config.ts
import nexub from '@nexub/tokens/tailwind';

export default {
  presets: [nexub],
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@nexub/react/dist/**/*.js',
    './node_modules/@nexub/patterns/dist/**/*.js',
  ],
};`} />

      <h3>Tailwind v4</h3>
      <p>
        On Tailwind v4, skip the config file and import the CSS-first theme instead. It is generated from the same
        tokens as the v3 preset, so the class names are identical (<code>bg-surface-container-high</code>,{' '}
        <code>rounded-shape-container</code>, <code>shadow-elevation-2</code>, <code>text-body-md</code>,{' '}
        <code>duration-spatial-default</code>, <code>ease-spatial-default</code>, <code>h-control-md</code>, …) and
        every utility resolves to the token&apos;s <code>var(--…)</code> at runtime, so light/dark, brand, contrast and
        density keep working. Keep the theme CSS from Setup loaded; v4 apps also need <code>@source</code> for the
        package output, because v4 does not scan <code>node_modules</code>.
      </p>
      <CodeBlock lang="css" code={`/* app.css */
@import "tailwindcss";
@import "@nexub/tokens/tailwind.css";

@source "../node_modules/@nexub/react/dist";
@source "../node_modules/@nexub/patterns/dist";`} />
      <p>
        Tailwind v3 keeps using the preset above; nothing changes there. Known differences on v4:{' '}
        <code>tailwindcss-animate</code> is a v3 plugin, so add a v4 port such as <code>tw-animate-css</code> for the{' '}
        <code>animate-in</code>/<code>zoom-in-95</code> classes the overlays use (the accordion keyframes are already in
        the theme). Opacity modifiers like <code>bg-primary/50</code> work on v4 (via <code>color-mix()</code>) but not
        with the v3 preset.
      </p>

      <h2>ThemeProvider</h2>
      <p>
        Wrap your app with <code>ThemeProvider</code> to enable light/dark/system mode switching
        with automatic localStorage persistence.
      </p>
      <CodeBlock code={`import { ThemeProvider } from '@nexub/react';

export default function App({ children }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="my-app-theme">
      {children}
    </ThemeProvider>
  );
}`} />

      <h2>ThemeScript</h2>
      <p>
        On server-rendered pages, add <code>ThemeScript</code> to <code>&lt;head&gt;</code> so the
        stored theme is applied before first paint (no light/dark flash). Use the same{' '}
        <code>storageKey</code> as <code>ThemeProvider</code>, and pass your CSP <code>nonce</code>{' '}
        if your Content-Security-Policy blocks inline scripts.
      </p>
      <CodeBlock code={`import { ThemeScript } from '@nexub/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript storageKey="my-app-theme" nonce={nonce} />
      </head>
      <body>{children}</body>
    </html>
  );
}`} />

      <h2>useTheme</h2>
      <p>Read and control the active theme from any client component:</p>
      <CodeBlock code={`'use client';
import { useTheme } from '@nexub/react';

export const dynamic = 'force-static';

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
      Toggle theme
    </button>
  );
}`} />

      <h2>Brand themes</h2>
      <p>
        Apply a brand theme by adding the <code>data-product</code> attribute to your root element.
        Four brands are available: <code>leap</code>, <code>bookub</code>, <code>payub</code>, <code>founderub</code>.
      </p>
      <CodeBlock lang="html" code={`<!-- Apply leap brand theme -->
<html data-theme="light" data-product="leap">
  ...
</html>`} />

      <h2>Using patterns</h2>
      <p>Higher-level composite components are available in the <code>@nexub/patterns</code> package:</p>
      <CodeBlock code={`import { StatCard, FilterBar, PlanCard } from '@nexub/patterns';

<StatCard
  label="Revenue"
  value="$48,295"
  delta="+12.5%"
  deltaType="increase"
/>`} />
    </div>
  );
}
