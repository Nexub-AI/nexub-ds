import { defineConfig } from 'tsup';
import { shared } from './tsup.config.js';

// 11.9: `define/<name>.js` registers one element and is a file of its own (no shared chunks), so
// a page that uses one element loads one file with just its code. Runs after the main build
// (package.json `build`), which cleans `dist`.
export default defineConfig({
  ...shared,
  entry: ['src/define/number-input.ts', 'src/define/date-picker.ts', 'src/define/select.ts', 'src/define/combobox.ts', 'src/define/phone-input.ts'],
  outDir: 'dist/define',
  splitting: false,
  clean: false,
});
