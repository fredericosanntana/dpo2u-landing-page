/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  turbopack: {
    root: process.cwd()
  }
}

module.exports = nextConfig
