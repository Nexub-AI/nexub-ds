import * as React from 'react';
import type { GlassMode } from '@nexub/core';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ThemeMode = 'light' | 'dark' | 'system';

/** Glass intensity dial (user preference, like iOS 27's clear → tinted slider).
 *  'off' makes every glass surface solid. Set as `data-glass` on <html>. */
export type { GlassMode };
const GLASS_MODES: readonly GlassMode[] = ['clear', 'balanced', 'tinted', 'off'];

export interface ThemeContextValue {
  /** The resolved theme actually applied (never 'system'). */
  resolvedTheme: 'light' | 'dark';
  /** The mode set by the consumer — may be 'system'. */
  theme: ThemeMode;
  /** Change the active theme. */
  setTheme: (mode: ThemeMode) => void;
  /** Glass intensity. */
  glass: GlassMode;
  /** Change (and persist) the glass intensity. */
  setGlass: (mode: GlassMode) => void;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  /**
   * Initial theme.  Defaults to 'system'.
   */
  defaultTheme?: ThemeMode;
  /**
   * localStorage key used to persist the user's choice.
   * Defaults to 'nexub-theme'.
   */
  storageKey?: string;
  /** Initial glass intensity. Defaults to 'balanced'. */
  defaultGlass?: GlassMode;
  /** localStorage key for the glass intensity. Defaults to 'nexub-glass'. */
  glassStorageKey?: string;
  /**
   * Brand seed colour (`#rgb` / `#rrggbb`) for white-label theming. The accent
   * family named by `seedTarget` is regenerated from it (same HCT tones as the
   * built-in roles, so WCAG pairs hold) and set on `<html>` via the CSSOM
   * (strict-CSP safe), following the current `data-contrast` level.
   *
   * Runs on the client after `@nexub/tokens/seed` loads (a lazy chunk with
   * the colour library), so server-rendered pages paint the default brand
   * first. To avoid that flash, emit `createSeedThemeCss(seed)` from
   * `@nexub/tokens/seed` into a server-rendered stylesheet instead.
   */
  seed?: string;
  /** Accent family the seed recolours: 'primary' (default) or 'tertiary' (product brand). */
  seedTarget?: 'primary' | 'tertiary';
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);
ThemeContext.displayName = 'ThemeContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DARK_QUERY = '(prefers-color-scheme: dark)';

// 'system' removes the attribute so @nexub/themes' prefers-color-scheme rules
// apply with no JS round-trip (no flash on first paint).
function applyTheme(theme: ThemeMode): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
}

function readStorage(key: string, fallback: ThemeMode): ThemeMode {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {
    // localStorage not available
  }
  return fallback;
}

function readGlass(key: string, fallback: GlassMode): GlassMode {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key) as GlassMode | null;
    if (stored && GLASS_MODES.includes(stored)) return stored;
  } catch {
    // localStorage not available
  }
  return fallback;
}

type Contrast = 'standard' | 'medium' | 'high';
const CONTRAST_QUERY = '(prefers-contrast: more)';

// Mirrors @nexub/tokens' roles.css: data-contrast wins, else prefers-contrast: more → high.
function readContrast(root: HTMLElement): Contrast {
  const attr = root.getAttribute('data-contrast');
  if (attr === 'standard' || attr === 'medium' || attr === 'high') return attr;
  return window.matchMedia(CONTRAST_QUERY).matches ? 'high' : 'standard';
}

// Seed theming: lazy-loads @nexub/tokens/seed (keeps the colour library out of
// apps that don't use it), writes the role vars on <html> with setProperty,
// recomputes on contrast changes, and removes them on cleanup.
function useSeedTheme(seed: string | undefined, target: 'primary' | 'tertiary'): void {
  React.useEffect(() => {
    if (!seed) return;
    const color = seed;
    const root = document.documentElement;
    const mq = window.matchMedia(CONTRAST_QUERY);
    const observer = new MutationObserver(() => update());
    let applied: string[] = [];
    let create: typeof import('@nexub/tokens/seed').createSeedTheme | undefined;
    let done = false;

    const clear = () => {
      for (const name of applied) root.style.removeProperty(name);
      applied = [];
    };
    const stop = () => {
      done = true;
      observer.disconnect();
      mq.removeEventListener('change', update);
    };
    function update() {
      if (done || !create) return;
      let vars: Record<string, string>;
      try {
        vars = create(color, { contrast: readContrast(root), target });
      } catch (error) {
        console.error(error);
        clear();
        stop();
        return;
      }
      clear();
      for (const [name, value] of Object.entries(vars)) root.style.setProperty(name, value);
      applied = Object.keys(vars);
    }

    observer.observe(root, { attributes: true, attributeFilter: ['data-contrast'] });
    mq.addEventListener('change', update);
    import('@nexub/tokens/seed').then(
      (mod) => {
        create = mod.createSeedTheme;
        update();
      },
      (error: unknown) => {
        console.error(error);
        stop();
      },
    );
    return () => {
      stop();
      clear();
    };
  }, [seed, target]);
}

function writeStorage(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // localStorage not available
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'nexub-theme',
  defaultGlass = 'balanced',
  glassStorageKey = 'nexub-glass',
  seed,
  seedTarget = 'primary',
}: ThemeProviderProps) {
  useSeedTheme(seed, seedTarget);

  // Start from props (not storage/matchMedia) so server and client render the
  // same tree; real values are synced before paint below.
  const [theme, setThemeState] = React.useState<ThemeMode>(defaultTheme);
  const [systemTheme, setSystemTheme] = React.useState<'light' | 'dark'>('light');
  const [glass, setGlassState] = React.useState<GlassMode>(defaultGlass);

  useIsomorphicLayoutEffect(() => {
    setThemeState(readStorage(storageKey, defaultTheme));
  }, [storageKey, defaultTheme]);

  useIsomorphicLayoutEffect(() => {
    const mq = window.matchMedia(DARK_QUERY);
    const sync = () => setSystemTheme(mq.matches ? 'dark' : 'light');
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useIsomorphicLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useIsomorphicLayoutEffect(() => {
    setGlassState(readGlass(glassStorageKey, defaultGlass));
  }, [glassStorageKey, defaultGlass]);

  useIsomorphicLayoutEffect(() => {
    document.documentElement.setAttribute('data-glass', glass);
  }, [glass]);

  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  const setTheme = React.useCallback(
    (mode: ThemeMode) => {
      writeStorage(storageKey, mode);
      setThemeState(mode);
    },
    [storageKey],
  );

  const setGlass = React.useCallback(
    (mode: GlassMode) => {
      writeStorage(glassStorageKey, mode);
      setGlassState(mode);
    },
    [glassStorageKey],
  );

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, glass, setGlass }),
    [theme, resolvedTheme, setTheme, glass, setGlass],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside a <ThemeProvider>.');
  }
  return ctx;
}

// ─── Pre-paint script ─────────────────────────────────────────────────────────

export interface ThemeScriptProps {
  /** Must match ThemeProvider's `storageKey`. Defaults to 'nexub-theme'. */
  storageKey?: string;
  /** If set, a stored product brand (e.g. 'bookub') is applied as `data-product`. */
  productStorageKey?: string;
  /** Must match ThemeProvider's `glassStorageKey`. Defaults to 'nexub-glass'. */
  glassStorageKey?: string;
  /** CSP nonce for pages whose script-src disallows inline scripts. */
  nonce?: string;
}

// JSON-encode and escape '<' so a key can never close the <script> tag.
const jsString = (s: string) => JSON.stringify(s).replace(/</g, '\\u003c');

/** @internal Exported for tests. */
export function themeScriptSource(storageKey: string, productStorageKey?: string, glassStorageKey = 'nexub-glass'): string {
  const product = productStorageKey
    ? `var b=localStorage.getItem(${jsString(productStorageKey)});if(b&&b!=='base')d.setAttribute('data-product',b);`
    : '';
  const glass = `var g=localStorage.getItem(${jsString(glassStorageKey)});if(${JSON.stringify(GLASS_MODES)}.indexOf(g)>-1)d.setAttribute('data-glass',g);`;
  return `try{var d=document.documentElement,t=localStorage.getItem(${jsString(storageKey)});if(t==='light'||t==='dark')d.setAttribute('data-theme',t);${product}${glass}}catch(e){}`;
}

/**
 * Applies the stored theme before first paint, so there is no light/dark flash.
 * Render it in `<head>` (or at the top of `<body>`) on server-rendered pages.
 */
export function ThemeScript({ storageKey = 'nexub-theme', productStorageKey, glassStorageKey, nonce }: ThemeScriptProps) {
  return (
    <script
      nonce={nonce}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: themeScriptSource(storageKey, productStorageKey, glassStorageKey) }}
    />
  );
}
