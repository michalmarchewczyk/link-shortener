/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => ({
    afterFiles: [
      {
        source: '/:slug',
        destination: '/api/links/redirect/:slug',
      },
    ],
  }),
};

module.exports = nextConfig;
