// The docs' web preview is served under nexub.design/m, so its export needs
// experiments.baseUrl = '/m'. Only that build sets NEXUB_WEB_BASE_URL
// (scripts/build-web.mjs): on iOS and Android a base path is stripped from
// in-app routes, and '/m' also matches the start of '/mobile'.
module.exports = ({ config }) =>
  process.env.NEXUB_WEB_BASE_URL
    ? { ...config, experiments: { ...config.experiments, baseUrl: process.env.NEXUB_WEB_BASE_URL } }
    : config;
