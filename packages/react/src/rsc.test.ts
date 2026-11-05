// @vitest-environment node
// React Server Components boundaries. The build keeps one output file per
// source file, so each module's own 'use client' (or its absence) is what a
// Next.js app sees. Two rules keep that safe:
// 1. A module that needs the browser or client-only React APIs says 'use client'.
// 2. A server module imports only components (PascalCase) and types from client
//    modules: any other value it imports there is a client reference, and
//    calling it on the server throws.
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const src = new URL('.', import.meta.url).pathname;
const files = (readdirSync(src, { recursive: true }) as string[])
  .filter((f) => /\.tsx?$/.test(f) && !/\.(test|stories)\.tsx?$|^stories\/|test-setup|\.d\.ts$/.test(f))
  .map((f) => join(src, f));

// useCallback, useMemo, useId and useDebugValue exist in React's server build;
// Radix Slot only calls useCallback, so `asChild` stays server-safe.
const CLIENT_ONLY =
  /\b(?!use(?:Callback|Memo|Id|DebugValue)\b)use[A-Z]\w*\s*\(|\bcreateContext\b|from ['"](@radix-ui\/(?!react-slot)|vaul|cmdk|react-day-picker)|\son[A-Z]\w*=\{|\bwindow\.|\bdocument\./m;

const source = new Map(files.map((f) => [f, readFileSync(f, 'utf8')]));
const isClient = (f: string) => /^'use client'/.test(source.get(f) ?? '');

describe('server component boundaries', () => {
  it('marks every module that needs the client', () => {
    const missing = files.filter((f) => !isClient(f) && CLIENT_ONLY.test(source.get(f)!));
    expect(missing.map((f) => relative(src, f))).toEqual([]);
  });

  it('keeps presentational components on the server', () => {
    for (const name of ['Heading', 'Text', 'Container', 'Section', 'Stack', 'Badge', 'EyebrowChip', 'Logo']) {
      expect(isClient(join(src, `components/${name}/${name}.tsx`)), name).toBe(false);
    }
    for (const f of ['Motion/Float.tsx', 'Motion/Marquee.tsx']) expect(isClient(join(src, 'components', f)), f).toBe(false);
    expect(isClient(join(src, 'index.ts'))).toBe(false);
  });

  it('server modules import only components and types from client modules', () => {
    const bad: string[] = [];
    for (const f of files.filter((f) => !isClient(f))) {
      for (const m of source.get(f)!.matchAll(/^import\s+(?!type\s)\{([^}]*)\}\s+from\s+'(\.[^']+)'/gm)) {
        const target = resolve(dirname(f), m[2]!.replace(/\.js$/, ''));
        const file = [`${target}.tsx`, `${target}.ts`].find((p) => source.has(p));
        if (!file || !isClient(file)) continue;
        for (const name of m[1]!.split(',').map((s) => s.trim()).filter(Boolean)) {
          if (!name.startsWith('type ') && !/^[A-Z]/.test(name)) bad.push(`${relative(src, f)} imports ${name}`);
        }
      }
    }
    expect(bad).toEqual([]);
  });
});
