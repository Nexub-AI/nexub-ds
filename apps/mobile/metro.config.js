// Showcase only: resolve workspace packages from source ("source" export
// condition), so edits show up without rebuilding lib/. Published consumers
// don't set this condition and get the built files.
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.unstable_conditionNames = ['source', ...config.resolver.unstable_conditionNames];

// Native modules must load once. Library source would otherwise resolve them
// from its own devDependencies (a second copy → "two views with the same name").
const SINGLETONS = [
  'react',
  'react-native',
  'react-native-reanimated',
  'react-native-worklets',
  'react-native-svg',
  'react-native-safe-area-context',
  'react-native-screens',
  'react-native-gesture-handler',
  '@react-native-community/datetimepicker',
  'expo',
  'expo-modules-core',
  'expo-font',
  'expo-haptics',
  'expo-glass-effect',
  'expo-screen-capture',
];
const app = path.join(__dirname, 'package.json');
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const single = SINGLETONS.some((s) => moduleName === s || moduleName.startsWith(`${s}/`));
  return context.resolveRequest(single ? { ...context, originModulePath: app } : context, moduleName, platform);
};

module.exports = config;
