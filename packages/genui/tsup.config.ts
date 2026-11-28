import { defineConfig, type Options } from 'tsup';

const external = ['react', 'react-dom', /^@nexub\/react(\/.*)?$/, '@nexub/core', '@nexub/icons'];

export default defineConfig([
  // @nexub/genui/schema: no React, no DOM, and no 'use client' (servers and @nexub/mcp import it).
  {
    entry: { 'schema/index': 'src/schema/index.ts' },
    format: ['esm'],
    dts: true,
    splitting: false,
    sourcemap: true, // 12.8: for ../../scripts/minify-dist.mjs, which minifies dist/ after the build
    external,
  },
  // The renderer: one file. It imports the schema entry above instead of bundling a second copy,
  // so an app that uses both loads the validator once.
  {
    entry: { index: 'src/index.ts' },
    format: ['esm'],
    dts: true,
    splitting: false,
    sourcemap: true, // 12.8: for ../../scripts/minify-dist.mjs, which minifies dist/ after the build
    external,
    banner: { js: "'use client';" },
    esbuildPlugins: [
      {
        name: 'schema-entry',
        setup(build) {
          build.onResolve({ filter: /^\.\/schema\/index\.js$/ }, () => ({ path: './schema/index.js', external: true }));
        },
      },
    ],
  } satisfies Options,
]);
