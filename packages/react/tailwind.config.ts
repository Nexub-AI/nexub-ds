import type { Config } from 'tailwindcss';
// ESM import, not require(): the preset is ESM-only, and require() hands
// Tailwind the module namespace ({ default }), which it silently ignores.
import nexub from '@nexub/tokens/tailwind';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', './.storybook/**/*.{ts,tsx}', '../patterns/src/**/*.{ts,tsx}'],
  presets: [nexub],
  theme: { extend: {} },
  plugins: [],
};

export default config;
