import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type ExampleKind = 'components' | 'patterns';

/**
 * The source of one example file, which is what the docs show as its code.
 * Build time only (pages and scripts/build-ai-docs.mjs); `dir` is apps/docs/src/examples.
 */
export function exampleCode(dir: string, kind: ExampleKind, slug: string, idx: number): string {
  // Server pages import every example since 9.2, so each is a client module. The
  // directive the docs added for that is not part of the sample; an example's own stays.
  return readFileSync(join(dir, kind, slug, `${idx}.tsx`), 'utf8')
    .replace(/^'use client'; \/\/ docs preview:.*\n\s*/, '')
    .trimEnd();
}
