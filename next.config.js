/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { domains: ["ipfs.atomichub.io"] },

  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      "/": { page: "/" },
      "/ended": { page: "/ended" },
      "/ending-soon": { page: "/ending-soon" },
      "/new": { page: "/new" },
    };
  },

  async rewrites() {
    return [
      {
        source: "/atomicassets/v1/assets",
        destination: "https://wax.api.atomicassets.io",
      },
    ];
  },
};

module.exports = nextConfig;
