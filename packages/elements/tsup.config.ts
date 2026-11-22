import { fileURLToPath } from 'node:url';
import { defineConfig } from 'tsup';

export default defineConfig({
  // `define` registers the tags and imports the classes from the main entry, so an app that
  // imports both gets one copy of each class (one shared chunk).
  entry: ['src/index.ts', 'src/define.ts'],
  format: ['esm'],
  // Core's types are inlined too: it is a devDependency, so consumers don't have it.
  dts: { resolve: ['@nexub/core'] },
  splitting: true,
  clean: true,
  // No runtime dependencies: the shared field rules from @nexub/core are bundled in, so the
  // files work from a CDN on a page with no build step.
  noExternal: ['@nexub/core'],
  esbuildOptions(options) {
    // Bundle core from its source modules, not its one-file dist: with core's
    // `sideEffects: false`, the modules the elements don't use (phone, QR, money, messages)
    // are dropped whole instead of leaving their top-level tables behind.
    options.alias = { ...options.alias, '@nexub/core': fileURLToPath(new URL('../core/src/index.ts', import.meta.url)) };
  },
  target: 'es2022',
  // Served as is from a CDN on pages with no build step.
  minify: true,
});
