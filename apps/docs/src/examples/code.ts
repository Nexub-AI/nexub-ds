import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type ExampleKind = 'components' | 'patterns';

/**
 * The source of one example file, which is what the docs show as its code.
 * Build time only (pages and scripts/build-ai-docs.mjs); `dir` is apps/docs/src/examples.
 */
export function exampleCode(dir: string, kind: ExampleKind, slug: string, idx: number): string {
  return readFileSync(join(dir, kind, slug, `${idx}.tsx`), 'utf8').trimEnd();
}
