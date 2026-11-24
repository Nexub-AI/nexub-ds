import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import type { Plugin } from 'vite';
import { toNexubLayer } from '../scripts/build-nexub-layer.mjs';

// 11.9: NEXUB_LAYER=1 builds the canvas with the 12.0 cascade layers (RFC 12.0, decision 2):
// preview.css gets the same rename as dist/styles.nexub-layer.css (every layer under `nexub`,
// the v3 compatibility file inlined), before Tailwind compiles it. The visual contrast and axe
// suites then run on it: NEXUB_LAYER=1 pnpm build-storybook, then test:visual as usual.
const nexubLayer: Plugin = {
  name: 'nexub-layer',
  enforce: 'pre',
  transform(code, id) {
    if (id.split('?')[0].endsWith('/.storybook/preview.css')) return toNexubLayer(code, id.split('?')[0]);
  },
  // Tailwind's own `properties` layer (the @property fallbacks) moves under nexub too, as in
  // dist/styles.nexub-layer.css. (The diagram's prebuilt CSS keeps its own layers: 12.0 scope
  // is @nexub/react/styles.css.)
  generateBundle(_, bundle) {
    for (const asset of Object.values(bundle)) {
      if (asset.type === 'asset' && asset.fileName.endsWith('.css') && String(asset.source).includes('@layer nexub.'))
        asset.source = String(asset.source).replace(/@layer properties\b/g, '@layer nexub.properties');
    }
  },
};

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx', '../../patterns/src/**/*.stories.tsx', '../../diagram/src/**/*.stories.tsx', '../../elements/stories/*.stories.tsx', '../../../apps/docs/src/stories/*.stories.tsx'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // Tailwind v4 through its Vite plugin (not PostCSS): it hands the @nexub/themes
  // @imports to Vite, so their relative font url()s resolve and get bundled.
  // cssTarget: vite 8's lightningcss lowers light-dark() for older targets into
  // vars resolved once at :root, which breaks nested data-theme surfaces.
  viteFinal: (config) => ({
    ...config,
    plugins: [...(config.plugins ?? []), ...(process.env.NEXUB_LAYER ? [nexubLayer] : []), tailwindcss()],
    // apps/docs (coverage stories render its examples) has jsx: "preserve" for Next;
    // compile JSX here regardless of the nearest tsconfig.
    oxc: { ...(config as { oxc?: object }).oxc, jsx: { runtime: 'automatic' } },
    // packages/elements has no React of its own (its stories are the only React there):
    // resolve react (and react/jsx-runtime) from this package, one copy for every story.
    resolve: { ...config.resolve, dedupe: [...(config.resolve?.dedupe ?? []), 'react', 'react-dom'] },
    build: { ...config.build, cssTarget: ['chrome123', 'edge123', 'firefox120', 'safari17.5'] },
  }),
};

export default config;
