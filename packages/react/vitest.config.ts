import { defineConfig, type Plugin } from 'vitest/config';
import { transformAsync } from '@babel/core';

// 12.1: `pnpm test:compiler` runs the suite on components compiled by the React Compiler, the way an
// app with the compiler on would build them. Babel applies only the compiler and keeps TSX, which
// esbuild then compiles as usual. Functions the compiler skips (it logs why) run as written.
function reactCompiler(): Plugin {
  return {
    name: 'nexub-react-compiler',
    enforce: 'pre',
    async transform(code, id) {
      if (
        !/\/src\/.*\.tsx?$/.test(id) ||
        /\.(test|stories)\.tsx?$/.test(id) ||
        id.includes('/vendor/')
      )
        return null;
      const out = await transformAsync(code, {
        filename: id,
        babelrc: false,
        configFile: false,
        sourceMaps: true,
        parserOpts: { plugins: ['jsx', 'typescript'] },
        plugins: [['babel-plugin-react-compiler', { target: '19' }]],
      });
      return out?.code ? { code: out.code, map: out.map } : null;
    },
  };
}

export default defineConfig({
  plugins: process.env.REACT_COMPILER ? [reactCompiler()] : [],
  // Per-package cache: under vite 8 both packages otherwise share one dir and race under turbo.
  cacheDir: 'node_modules/.vite',
  test: {
    // Vitest 5's module cache defaults to the workspace root; per package, or
    // parallel runs under turbo delete each other's cache (ENOTEMPTY).
    fsModuleCachePath: new URL('node_modules/.vitest-cache', import.meta.url).pathname,
    environment: 'jsdom',
    // Every package's tests run at once in CI; 5s is too tight for the typing-heavy ones.
    testTimeout: 20_000,
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    // visual/ is the Playwright suite (pnpm test:visual), not vitest.
    // src/leaks.test.tsx takes minutes (1,000 mounts per story): `pnpm test:leaks`, CI job "Resilience".
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'visual/**',
      ...(process.env.LEAKS ? [] : ['src/leaks.test.tsx']),
    ],
    // On for `pnpm test` (vitest run --coverage). Reports land in coverage/
    // (turbo's test output). Thresholds are a ratchet: raise them as tests
    // land, never lower them.
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.stories.tsx',
        'src/stories/**',
        'src/test-setup.ts',
        'src/vendor/**',
      ],
      reporter: ['text-summary', 'json-summary'],
      // Measured 2026-11-11 (8.2), rounded down.
      thresholds: { lines: 95, functions: 91, branches: 85, statements: 93 },
    },
  },
});
