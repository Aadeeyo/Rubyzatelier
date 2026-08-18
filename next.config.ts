import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/shop/office", destination: "/shop/office-edit", permanent: true },
      { source: "/shop/sunday", destination: "/shop/sunday-edit", permanent: true },
      { source: "/shop/date", destination: "/shop/date-edit", permanent: true },
      { source: "/shop/celebration", destination: "/shop/celebration-edit", permanent: true },
      { source: "/about", destination: "/our-story", permanent: true },
      {
        source: "/journal/why-elegant-fashion-shouldnt-require-a-long-trip",
        destination: "/journal/why-should-every-life-moment-require-travel",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
