import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/hosts",
        destination: "/early-access#hosts",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
