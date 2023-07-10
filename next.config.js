/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => {
    return [
      {
        source: '/:path*',
        destination: '/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig
