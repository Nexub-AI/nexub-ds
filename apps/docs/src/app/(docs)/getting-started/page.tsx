import type { Metadata } from 'next';
import { CodeBlock } from '@/components/docs/CodeBlock';

export const metadata: Metadata = { title: 'Getting Started' };

export default function GettingStartedPage() {
  return (
    <div className="docs-prose">
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-brand-primary-500)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
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
import '@nexub/themes/dark';   // dark mode overrides`} />

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
