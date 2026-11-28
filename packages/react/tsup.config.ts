import { readFileSync } from 'node:fs';
import { defineConfig, type Options } from 'tsup';

type EsbuildPlugin = NonNullable<Options['esbuildPlugins']>[number];

// vaul (Drawer/Sheet) injects a <style> tag as soon as it is imported, which
// strict Content-Security-Policy pages block. We bundle vaul, drop that call,
// and ship the same CSS in @nexub/themes/core (and base). The build fails if the two
// drift apart (e.g. after a vaul upgrade): copy the new string into core.css.
// core.css leaves out one invalid rule that browsers ignore anyway but strict
// CSS parsers (lightningcss / Turbopack) reject.
const VAUL_INVALID_RULE = '@media (pointer:fine){[data-vaul-handle-hitarea]:{width:100%;height:100%}}';

const vaulWithoutStyleInjection: EsbuildPlugin = {
  name: 'vaul-without-style-injection',
  setup(build) {
    build.onLoad({ filter: /[\\/]vaul[\\/]dist[\\/]index\.mjs$/ }, ({ path }) => {
      const source = readFileSync(path, 'utf8');
      const call = /\n__insertCSS\(("(?:[^"\\]|\\.)*")\);/.exec(source);
      if (!call) throw new Error('vaul: __insertCSS call not found; update tsup.config.ts');
      const css = (JSON.parse(call[1]) as string).replace(VAUL_INVALID_RULE, '');
      const base = readFileSync(new URL('../themes/src/core.css', import.meta.url), 'utf8');
      if (!base.includes(css)) {
        throw new Error('vaul CSS changed: copy the __insertCSS string from vaul into @nexub/themes/src/core.css');
      }
      return { contents: source.replace(call[0], '\n'), loader: 'js' };
    });
  },
};

export default defineConfig([
  // One output file per source file, not a bundle: each module keeps its own
  // 'use client' directive (or none), so React Server Components can render
  // the presentational ones on the server and bundlers ship only the client
  // modules a page uses. Types come from tsc (see the build script).
  {
    entry: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.test.{ts,tsx}',
      '!src/**/*.stories.tsx',
      '!src/stories/**',
      '!src/test-setup.ts',
      '!src/vendor/**',
    ],
    format: ['esm'],
    bundle: false,
    clean: false,
    sourcemap: true, // 12.8: for ../../scripts/minify-dist.mjs, which minifies dist/ after the build
    // 12.8: no @__PURE__ on JSX calls: nearly all sit inside components, where they don't help
    // tree-shaking, and minify-dist keeps every annotation, so they would only add bytes.
    esbuildOptions(options) {
      options.jsxSideEffects = true;
    },
    silent: true, // one line per file otherwise
  },
  // vaul is bundled (it isn't a dependency) with its style injection removed.
  {
    entry: { 'vendor/vaul': 'src/vendor/vaul.ts' },
    format: ['esm'],
    clean: false,
    external: ['react', 'react-dom'],
    noExternal: ['vaul'],
    // Third-party code: minified here, with no source map (8.7, B1). Our own modules are
    // minified after the build with maps (12.8, minify-dist), one file per source file.
    minify: true,
    esbuildPlugins: [vaulWithoutStyleInjection],
    banner: { js: "'use client';" },
  },
]);
