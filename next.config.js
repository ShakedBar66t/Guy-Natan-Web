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
      {
        source: '/services',
        destination: '/',
        permanent: false,
      },
      {
        source: '/faq',
        destination: '/qna',
        permanent: false,
      },
      {
        source: '/terms',
        destination: '/',
        permanent: false,
      },
      {
        source: '/accessibility',
        destination: '/',
        permanent: false,
      }
    ];
  },
};

module.exports = nextConfig; 