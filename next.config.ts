import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/hosts",
        destination: "/early-access?role=host",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
