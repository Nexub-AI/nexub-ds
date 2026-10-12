import * as React from 'react';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
  /** The resolved theme actually applied (never 'system'). */
  resolvedTheme: 'light' | 'dark';
  /** The mode set by the consumer — may be 'system'. */
  theme: ThemeMode;
  /** Change the active theme. */
  setTheme: (mode: ThemeMode) => void;
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
}: ThemeProviderProps) {
  // Start from props (not storage/matchMedia) so server and client render the
  // same tree; real values are synced before paint below.
  const [theme, setThemeState] = React.useState<ThemeMode>(defaultTheme);
  const [systemTheme, setSystemTheme] = React.useState<'light' | 'dark'>('light');

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

  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  const setTheme = React.useCallback(
    (mode: ThemeMode) => {
      writeStorage(storageKey, mode);
      setThemeState(mode);
    },
    [storageKey],
  );

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
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
