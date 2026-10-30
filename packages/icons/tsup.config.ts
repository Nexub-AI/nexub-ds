import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.ts', 'native/index': 'src/native/index.ts' },
  format: ['esm'],
  dts: true,
  treeshake: true,
  clean: true,
  external: ['react', 'react-dom', 'react-native', 'react-native-svg', 'lucide-react-native'],
});
