// Bundle analysis — install manually when needed:
//   pnpm add -D @next/bundle-analyzer
//   ANALYZE=true pnpm build
let withBundleAnalyzer = (config) => config;
try {
  const { default: BundleAnalyzer } = await import('@next/bundle-analyzer');
  withBundleAnalyzer = BundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });
} catch {
  // not installed — normal dev/CI builds skip analysis
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — generates apps/docs/out/ at build time.
  // All pages have force-static so this is safe and produces pure HTML/CSS/JS
  // that Cloudflare Pages serves from its global CDN with zero server costs.
  // Headers are handled by apps/docs/public/_headers (Cloudflare Pages convention).
  output: 'export',

  transpilePackages: [
    '@nexub/react',
    '@nexub/patterns',
    '@nexub/tokens',
    '@nexub/themes',
    '@nexub/icons',
  ],

  images: {
    // Required for static export — Next.js image optimisation needs a server.
    // Cloudflare Images or Cloudflare's Polish handles optimisation at the CDN layer.
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  experimental: {
    optimizePackageImports: ['@nexub/react', '@nexub/icons', 'lucide-react'],
  },
};

export default withBundleAnalyzer(nextConfig);
