import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', './.storybook/**/*.{ts,tsx}'],
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  presets: [require('../tokens/dist/tailwind/preset.js')],
  theme: { extend: {} },
  plugins: [],
};

export default config;
