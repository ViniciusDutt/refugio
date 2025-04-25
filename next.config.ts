import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zsgevfhnkqpyzzpunduf.supabase.co",
        port: "",
        search: "",
      },
    ],
  },
};

export default nextConfig;
