/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['primereact', 'primeicons'],
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.2.2',
  },
};

module.exports = nextConfig;
