/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  i18n: {
    locales: ["en", "kn"],
    defaultLocale: "en",
  },
};

export default nextConfig;
