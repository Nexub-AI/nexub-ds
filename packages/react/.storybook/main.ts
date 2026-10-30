import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx', '../../patterns/src/**/*.stories.tsx'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // Tailwind v4 through its Vite plugin (not PostCSS): it hands the @nexub/themes
  // @imports to Vite, so their relative font url()s resolve and get bundled.
  viteFinal: (config) => ({ ...config, plugins: [...(config.plugins ?? []), tailwindcss()] }),
};

export default config;
