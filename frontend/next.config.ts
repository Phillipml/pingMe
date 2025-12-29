import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**'
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/**'
      },
      {
        protocol: 'http',
        hostname: '192.168.0.18',
        port: '8000',
        pathname: '/**'
      }
    ],
    unoptimized: false
  }
}

export default nextConfig
