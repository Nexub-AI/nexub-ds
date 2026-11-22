/** Joins class names, skipping empty ones (no dependency; the package has none at runtime). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
