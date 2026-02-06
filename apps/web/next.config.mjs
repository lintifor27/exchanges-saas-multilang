/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed deprecated experimental.appDir option. The app directory is enabled by default
  i18n: {
    locales: ['en', 'ua', 'ru'],
    defaultLocale: 'en',
  },
};

export default nextConfig;