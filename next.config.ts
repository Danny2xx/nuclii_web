import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/hosts",
        destination: "/partner",
        permanent: false,
      },
      // the old partner page lived here
      {
        source: "/early-access",
        destination: "/partner",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
