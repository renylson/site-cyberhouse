/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
