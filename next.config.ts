import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        canvas: 'canvas'
      });
    }

    config.resolve.alias.canvas = false; // prevents client bundle from trying to load it
    return config;
  }
};

export default nextConfig;
