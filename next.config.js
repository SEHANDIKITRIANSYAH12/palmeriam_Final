/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  // Allow loading scripts from n8n CDN
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack: (config) => {
    // Custom alias resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '.'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/assets': path.resolve(__dirname, './src/assets'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/src': path.resolve(__dirname, './src'),
    };
    
    // For @/lib/*, try src/lib first, then lib/
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, './src'),
      path.resolve(__dirname, '.'),
    ];
    
    return config;
  },
  // Add security headers for the chat widget
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' https://cdn.jsdelivr.net https://*.googleapis.com https://*.gstatic.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://*.googleapis.com https://*.gstatic.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://*.googleapis.com; img-src 'self' data: https: blob:; frame-src 'self' https://www.google.com https://maps.google.com; connect-src 'self' https://your-n8n-instance.com https://*.googleapis.com;"
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
