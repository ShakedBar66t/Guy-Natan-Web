/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/blog/new',
        destination: '/admin/dashboard/blog/new',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig; 