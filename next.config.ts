import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "react-dropzone",
      "jszip",
      "pdf-lib",
      "pdfjs-dist",
    ],
  },
  output: "standalone",
  compress: true,
};

export default nextConfig;
