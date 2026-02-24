/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "datapols.com",
      },
      // add whatever domain your article images come from
      {
        protocol: "https",
        hostname: "datapols.com", //godaddy.com
      },
    ],
  },
};

export default nextConfig;