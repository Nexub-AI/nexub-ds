import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx', '../../patterns/src/**/*.stories.tsx', '../../../apps/docs/src/stories/*.stories.tsx'],
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
    plugins: [...(config.plugins ?? []), tailwindcss()],
    // apps/docs (coverage stories render its examples) has jsx: "preserve" for Next;
    // compile JSX here regardless of the nearest tsconfig.
    oxc: { ...(config as { oxc?: object }).oxc, jsx: { runtime: 'automatic' } },
    build: { ...config.build, cssTarget: ['chrome123', 'edge123', 'firefox120', 'safari17.5'] },
  }),
};

export default config;
