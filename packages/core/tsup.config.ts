import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  treeshake: true,
  sourcemap: true, // 12.8: for ../../scripts/minify-dist.mjs, which minifies dist/ after the build
  clean: true,
});
