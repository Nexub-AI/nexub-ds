import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/react/src/**/*.{ts,tsx}',
    '../../packages/patterns/src/**/*.{ts,tsx}',
  ],
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  presets: [require('@nexub/tokens/tailwind')],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
