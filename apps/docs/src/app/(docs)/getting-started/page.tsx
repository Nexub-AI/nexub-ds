import type { Metadata } from 'next';
import { PageIntro } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';

export const metadata: Metadata = { title: 'Getting Started' };

export default function GettingStartedPage() {
  return (
    <div className="docs-prose">
      <PageIntro eyebrow="Introduction" title="Getting Started" />
      <p>
        Nexub DS is a token-driven design system for SaaS products on the web and on mobile. It ships 90+ accessible
        React components, 17 composite patterns, a React Native package (<code>@nexub/react-native</code>) and 5 brand
        themes, all driven by the same tokens.
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
        Components ship Tailwind class names, so your Tailwind build must generate them. Tailwind v3 and v4 are both
        supported and use the same class names; pick the setup that matches your Tailwind version.
      </p>

      <h3>Tailwind v3</h3>
      <p>
        Use the Nexub preset and scan the package output. The preset maps the tokens and registers{' '}
        <code>tailwindcss-animate</code>.
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
        density keep working. v4 also needs <code>@source</code> for the package output, because it does not scan{' '}
        <code>node_modules</code>.
      </p>
      <CodeBlock lang="css" code={`/* app.css: replaces the JS theme imports from Setup */
@layer theme, base, components, utilities;

@import "@nexub/themes/base" layer(base);
@import "@nexub/themes/light" layer(base);
@import "@nexub/themes/dark" layer(base);
@import "tailwindcss";
@import "@nexub/tokens/tailwind.css";

@source "../node_modules/@nexub/react/dist";
@source "../node_modules/@nexub/patterns/dist";`} />
      <p>
        Load the theme CSS into the <code>base</code> layer, as above, rather than from JavaScript. Tailwind v4 puts
        its own CSS in cascade layers, and CSS outside a layer beats every layer, so an unlayered theme would win over
        Tailwind&apos;s preflight and utilities (for example, the theme&apos;s link colour would override{' '}
        <code>text-*</code> on a link). In the base layer it sits where it did on v3: before preflight and the
        utilities.
      </p>
      <p>
        Known differences on v4: the overlays animate with <code>nx-motion</code> from <code>@nexub/themes</code>, so you
        need a v4 port of <code>tailwindcss-animate</code> (such as <code>tw-animate-css</code>) only if your own code
        uses <code>animate-in</code>/<code>zoom-in-95</code> (the accordion keyframes are already in the theme). Opacity
        modifiers like <code>bg-primary/50</code> work on v4 (via <code>color-mix()</code>) but not with the v3 preset.
        Tailwind v4 also changed some defaults that affect your own markup (a bare <code>border</code> is{' '}
        <code>currentColor</code>, a bare <code>ring</code> is 1px, placeholders are 50% <code>currentColor</code>);
        Nexub components set their border, ring and placeholder styles explicitly, and{' '}
        <code>@nexub/themes/base</code> restores the pointer cursor on buttons, so components look and behave the same
        on both versions.
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
