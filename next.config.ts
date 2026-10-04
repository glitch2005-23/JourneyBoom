import type { NextConfig } from "next";
import { IMAGE_WIDTHS } from "./src/lib/images/widths";

/**
 * Optional sub-path the site is served from, e.g. "/JourneyBoom" for a GitHub Pages
 * project site (https://<user>.github.io/JourneyBoom/). Leave unset for a root domain.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/images/loader.ts",
    deviceSizes: [...IMAGE_WIDTHS.device],
    imageSizes: [...IMAGE_WIDTHS.image],
  },
};

export default nextConfig;
