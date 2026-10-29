// Showcase only: resolve workspace packages from source ("source" export
// condition), so edits show up without rebuilding lib/. Published consumers
// don't set this condition and get the built files.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.unstable_conditionNames = ['source', ...config.resolver.unstable_conditionNames];

module.exports = config;
