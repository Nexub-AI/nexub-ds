// Bundle analysis — install manually when needed:
//   pnpm add -D @next/bundle-analyzer   (in apps/docs, after workspace packages are published)
//   ANALYZE=true pnpm build
//
// The treemap reveals:
//   • ComponentLivePreview chunk should NOT appear in initial client JS
//   • shiki should be server-only (not in any client chunk)
//   • lucide-react / @nexub/icons should be tree-shaken (only used icons)
let withBundleAnalyzer = (config) => config;
try {
  const { default: BundleAnalyzer } = await import('@next/bundle-analyzer');
  withBundleAnalyzer = BundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });
} catch {
  // @next/bundle-analyzer not installed — normal dev/CI builds skip analysis
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@nexub/react',
    '@nexub/patterns',
    '@nexub/tokens',
    '@nexub/themes',
    '@nexub/icons',
  ],

  // Reduce deploy artifact size by ~50% — only ship the server + required node_modules
  output: 'standalone',

  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  experimental: {
    // Better tree-shaking for large icon/component libraries — avoids barrel-import penalty
    optimizePackageImports: ['@nexub/react', '@nexub/icons', 'lucide-react'],
  },

  async headers() {
    return [
      {
        // Immutable cache for hashed static assets (_next/static)
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Short cache for HTML pages — stale-while-revalidate lets CDN serve stale instantly
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=600' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
