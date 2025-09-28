/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // Disable request logging in development
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

export default nextConfig;
