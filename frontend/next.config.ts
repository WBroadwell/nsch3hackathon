import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Enable standalone output for Docker deployment
  // This creates a minimal production build with only necessary files
  output: "standalone",

  // Proxy API requests to the backend server
  // This allows the frontend to be the only exposed service in Docker
  // Browser requests /api/* -> Next.js proxies to backend:5000/*
  async rewrites() {
    const backendUrl = process.env.INTERNAL_BACKEND_URL || "http://backend:5000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
