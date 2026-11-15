'use client';

import * as React from 'react';

/**
 * 4.7: recolours one element (and everything inside it) from a brand seed, like
 * <ThemeProvider seed> but scoped, e.g. to preview a customer's brand on one
 * card or section. Writes the seeded role variables through the CSSOM (strict-
 * CSP safe) and removes them when the seed is cleared or the component unmounts.
 * Lazy-loads @nexub/tokens/seed, so the colour library stays out of the main bundle.
 */
export function useScopedSeed<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  seed: string | null | undefined,
  options: { target?: 'primary' | 'tertiary' } = {},
): void {
  const { target = 'primary' } = options;
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !seed) return;
    let applied: string[] = [];
    let cancelled = false;
    import('@nexub/tokens/seed').then(({ createSeedTheme }) => {
      if (cancelled) return;
      const vars = createSeedTheme(seed, { target });
      for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v);
      applied = Object.keys(vars);
    });
    return () => {
      cancelled = true;
      for (const k of applied) el.style.removeProperty(k);
    };
  }, [ref, seed, target]);
}
