/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // Core configuration
  reactStrictMode: true,
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel-analytics.com https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: *.vercel.app https://www.google-analytics.com",
              "font-src 'self'",
              "connect-src 'self' *.vercel-analytics.com https://www.google-analytics.com https://www.googletagmanager.com",
              "frame-ancestors 'none'"
            ].join('; ')
          }
        ]
      }
    ];
  },

  // Redirect configuration
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      }
    ];
  },

  // Performance monitoring
  poweredByHeader: false,
  compress: true,
  
  // Output configuration
  output: 'standalone',
  
  // TypeScript configuration
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
};

module.exports = withBundleAnalyzer(nextConfig);
