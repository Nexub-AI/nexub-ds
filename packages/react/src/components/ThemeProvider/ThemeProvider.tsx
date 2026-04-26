import * as React from 'react';

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
  /**
   * Element to apply the `data-theme` attribute to.
   * Defaults to `document.documentElement` (<html>).
   */
  attribute?: 'data-theme' | 'class';
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);
ThemeContext.displayName = 'ThemeContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(
  resolvedTheme: 'light' | 'dark',
  attribute: 'data-theme' | 'class',
): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (attribute === 'class') {
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  } else {
    root.setAttribute('data-theme', resolvedTheme);
  }
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
  attribute = 'data-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<ThemeMode>(() =>
    readStorage(storageKey, defaultTheme),
  );

  const resolvedTheme = React.useMemo<'light' | 'dark'>(
    () => (theme === 'system' ? getSystemTheme() : theme),
    [theme],
  );

  // Apply to DOM whenever resolvedTheme changes
  React.useEffect(() => {
    applyTheme(resolvedTheme, attribute);
  }, [resolvedTheme, attribute]);

  // Track system preference changes when theme === 'system'
  React.useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      applyTheme(getSystemTheme(), attribute);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme, attribute]);

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
