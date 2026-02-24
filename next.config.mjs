/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "datapols.com",
      },
      {
        protocol: "https",
        hostname: "api.datapols.com",
      },
    ],
  },
};

export default nextConfig;