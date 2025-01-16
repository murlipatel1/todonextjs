import type { NextConfig } from "next";

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true // Set to true for a permanent redirect (301)
      }
    ];
  }
}

export default nextConfig;
