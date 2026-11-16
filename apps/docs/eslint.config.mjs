import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

const config = [
  // public/m: the React Native web preview, copied in by build:mobile-web.
  { ignores: ['.next/**', 'out/**', 'public/m/**', 'next-env.d.ts'] },
  ...coreWebVitals,
  ...typescript,
  {
    // React Compiler rules that eslint-config-next 16 turns on. 17 findings in the docs app
    // (theme and preview effects, measured refs): fixing them is its own piece of work.
    rules: { 'react-hooks/set-state-in-effect': 'off', 'react-hooks/refs': 'off', 'react-hooks/purity': 'off' },
  },
];

export default config;
