import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      /*
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
      },
      */
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
}

export default nextConfig
