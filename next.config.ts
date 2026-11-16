import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is generated at build time. If your host only serves static
  // files (GitHub Pages, Netlify drop, S3...), uncomment the next line and
  // deploy the `out/` folder produced by `npm run build`.
  // output: "export",
  trailingSlash: false,
};

export default nextConfig;
