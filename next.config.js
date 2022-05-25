/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { loader: "akamai", path: "", domains: ["*"] },
  exportPathMap: async function (defaultPathMap) {
    return {
      "/": { page: "/" },
      "/ended": { page: "/ended" },
      "/ending-soon": { page: "/ending-soon" },
      "/new": { page: "/new" },
    };
  },
};

module.exports = nextConfig;
