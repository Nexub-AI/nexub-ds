// @vitest-environment node
// 11.9: styles.nexub-layer.css is styles.css with every layer under `nexub`, and nothing else.
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildNexubLayer, compile, nexubLayerOutput, toNexubLayer } from './build-nexub-layer.mjs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const layerNames = (css) =>
  [...css.matchAll(/@layer\s+([^;{]+)/g)].flatMap((m) => m[1].split(',').map((n) => n.trim()));
// The same stylesheet with the `nexub.` prefix taken off every layer name.
const unprefix = (css) => css.replace(/@layer\s+[^;{]+/g, (m) => m.replace(/nexub\./g, ''));

describe('styles.nexub-layer.css source', () => {
  const source = toNexubLayer(read('../src/styles.css'));

  it('declares and imports into nexub.* layers only', () => {
    expect(source).toContain('@layer nexub.theme, nexub.base, nexub.components, nexub.utilities;');
    expect(source).toContain("@import 'tailwindcss/theme.css' layer(nexub.theme);");
    expect(source).toContain("@import 'tailwindcss/utilities.css' layer(nexub.utilities) source(none);");
    expect(source).not.toMatch(/layer\((?!nexub\.)/);
    expect(layerNames(source).every((n) => n.startsWith('nexub.'))).toBe(true);
  });

  it('inlines the v3 compatibility file with its base layer moved', () => {
    expect(source).not.toContain('tailwind-v3-compat.css');
    expect(source).toContain('@layer nexub.base {');
    expect(source).toContain('@custom-variant hover (&:hover);');
    // The class sources are untouched (Tailwind compiles from src/, as for styles.css).
    expect(source).toContain("@source './**/*.{ts,tsx}';");
  });

  it('is idempotent', () => {
    expect(toNexubLayer(source)).toBe(source);
  });

  it('rejects a Tailwind output with a layer it cannot place', () => {
    expect(nexubLayerOutput('@layer a{x{y:z}}')).toBe('@layer nexub.a{x{y:z}}');
    // An anonymous layer would sit outside nexub: the build fails instead.
    expect(() => nexubLayerOutput('@media print{@layer {x{y:z}}}')).toThrow(/outside nexub/);
  });
});

describe('compiled', () => {
  const plain = compile(read('../src/styles.css'));
  const layered = buildNexubLayer();

  it('has the same rules as styles.css apart from layer names', () => {
    expect(layered).not.toBe(plain);
    expect(unprefix(layered)).toBe(plain);
  });

  it('puts every layer, Tailwind’s own properties layer included, under nexub', () => {
    const names = layerNames(layered);
    expect(new Set(names)).toEqual(
      new Set(['nexub.properties', 'nexub.theme', 'nexub.base', 'nexub.components', 'nexub.utilities']),
    );
    // The first layer the file names is a nexub one, so `nexub` is declared before any app layer.
    expect(names[0]).toMatch(/^nexub\./);
  });

  it.skipIf(!existsSync(new URL('../dist/styles.nexub-layer.css', import.meta.url)))(
    '12.0: dist/styles.css is the layered file; the 11.9 name is the same bytes',
    () => {
      expect(read('../dist/styles.nexub-layer.css')).toBe(read('../dist/styles.css'));
      expect(read('../dist/styles.css')).not.toMatch(/@layer (?!nexub\.)[\w-]+[;{,]/);
    },
  );
});
