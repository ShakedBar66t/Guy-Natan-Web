/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  async redirects() {
    console.log('Loading redirects configuration...');
    return [
      // Redirect from date-based URLs to the blog structure
      {
        source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
      // Redirect from Hebrew URL with /new to the admin dashboard new blog page
      {
        source: '/מאמרים/new',
        destination: '/admin/dashboard/blog/new',
        permanent: false,
      },
      // Redirect from /blog/new to the admin dashboard new blog page
      // But only if it's exactly /blog/new and not a dynamic route
      {
        source: '/blog/new',
        destination: '/admin/dashboard/blog/new',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig; 