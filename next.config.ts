import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Perenual plant thumbnails in search results
        protocol: "https",
        hostname: "s3.us-central-1.wasabisys.com",
      },
      {
        // Vercel Blob — for our AI-generated plant illustrations
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
