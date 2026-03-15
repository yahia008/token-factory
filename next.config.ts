import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
  output: "export",      // enable static HTML export
  trailingSlash: true, 
};

export default nextConfig;
