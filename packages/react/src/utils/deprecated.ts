const warned = new Set<string>();

/**
 * Warns once per component, outside production, that it is deprecated and removed in 3.0
 * (GOVERNANCE.md: a removal needs a development warning in a 2.x minor first).
 * Bundlers replace `process.env.NODE_ENV`, so production builds drop the call's body.
 */
export function warnDeprecated(name: string, replacement: string): void {
  try {
    if (process.env.NODE_ENV === 'production') return;
  } catch {
    return; // no bundler and no `process`: treat as production
  }
  if (warned.has(name)) return;
  warned.add(name);
  console.warn(
    `[@nexub/react] ${name} is deprecated and will be removed in 3.0. Use ${replacement} instead.`,
  );
}
