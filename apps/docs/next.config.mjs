/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@nexub/react',
    '@nexub/patterns',
    '@nexub/tokens',
    '@nexub/themes',
    '@nexub/icons',
  ],
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
