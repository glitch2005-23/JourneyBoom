import { optimizedPath } from "./widths";

type LoaderArgs = { src: string; width: number; quality?: number };

/** Sub-path the site is served from (e.g. "/JourneyBoom" on GitHub Pages); empty at a root domain. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Static-export image loader. Local images resolve to WebP variants pre-generated
 * by scripts/optimize-images.ts; remote images pass through untouched. Custom loaders
 * don't get Next's basePath automatically, so it is added here.
 */
export default function imageLoader({ src, width }: LoaderArgs): string {
  if (!src.startsWith("/")) return src;
  if (src.endsWith(".svg")) return `${basePath}${src}`;
  return `${basePath}${optimizedPath(src, width)}`;
}
