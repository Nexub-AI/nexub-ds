import { readFileSync } from 'node:fs';
import { defineConfig, type Options } from 'tsup';

type EsbuildPlugin = NonNullable<Options['esbuildPlugins']>[number];

// vaul (Drawer/Sheet) injects a <style> tag as soon as it is imported, which
// strict Content-Security-Policy pages block. We bundle vaul, drop that call,
// and ship the same CSS in @nexub/themes/base. The build fails if the two
// drift apart (e.g. after a vaul upgrade): copy the new string into base.css.
// base.css leaves out one invalid rule that browsers ignore anyway but strict
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
      const base = readFileSync(new URL('../themes/src/base.css', import.meta.url), 'utf8');
      if (!base.includes(css)) {
        throw new Error('vaul CSS changed: copy the __insertCSS string from vaul into @nexub/themes/src/base.css');
      }
      return { contents: source.replace(call[0], '\n'), loader: 'js' };
    });
  },
};

export default defineConfig({
  // One entry per component so consumers' bundlers can drop unused modules
  // (sideEffects:false only works at module granularity).
  entry: ['src/index.ts', 'src/components/*/index.ts'],
  format: ['esm'],
  dts: { entry: 'src/index.ts' },
  splitting: true,
  clean: true,
  external: ['react', 'react-dom'],
  noExternal: ['vaul'],
  esbuildPlugins: [vaulWithoutStyleInjection],
  // esbuild strips module-level directives when bundling; re-add on every
  // output file so Next.js RSC consumers can import from server components.
  banner: { js: "'use client';" },
});
