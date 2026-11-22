import { defineConfig } from 'tsup';

export default defineConfig({
  // `define` registers the tags and imports the classes from the main entry, so an app that
  // imports both gets one copy of each class (one shared chunk).
  entry: ['src/index.ts', 'src/define.ts'],
  format: ['esm'],
  dts: true,
  splitting: true,
  clean: true,
  // No runtime dependencies: the shared field rules from @nexub/core are bundled in, so the
  // files work from a CDN on a page with no build step.
  noExternal: ['@nexub/core'],
  target: 'es2022',
});
