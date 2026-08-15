import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/shop/office", destination: "/shop/office-edit", permanent: true },
      { source: "/shop/sunday", destination: "/shop/sunday-edit", permanent: true },
      { source: "/shop/date", destination: "/shop/date-edit", permanent: true },
      { source: "/shop/celebration", destination: "/shop/celebration-edit", permanent: true },
    ];
  },
};

export default nextConfig;
