import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir:
    process.env.NEXT_DIST_DIR ||
    (process.env.CI ? ".next" : ".next-local-build"),
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
