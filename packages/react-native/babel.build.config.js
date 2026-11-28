// `bob build` only (the module target's configFile; Jest uses babel.config.js). Bob's own preset,
// without the source comments: lib/ ships source maps that point at src/, which is published too
// and keeps every comment.
module.exports = {
  presets: [require.resolve('react-native-builder-bob/babel-preset')],
  comments: false,
  compact: true,
};
