/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  i18n: {
    locales: ['en', 'ua', 'ru'],
    defaultLocale: 'en',
  },
};

export default nextConfig;