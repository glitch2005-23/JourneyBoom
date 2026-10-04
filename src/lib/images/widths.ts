/**
 * Responsive widths shared by next.config (srcset generation), the custom image
 * loader and scripts/optimize-images.ts (which pre-renders every width as WebP).
 */
export const IMAGE_WIDTHS = {
  device: [640, 960, 1280, 1920, 2560],
  image: [320, 480],
} as const;

export const ALL_IMAGE_WIDTHS: readonly number[] = [...IMAGE_WIDTHS.image, ...IMAGE_WIDTHS.device];

/** Folder (under /public) that holds the generated variants. */
export const OPTIMIZED_DIR = "_img";

/** "/images/a/b.jpg" + 960 → "/_img/images/a/b-960.webp" */
export function optimizedPath(src: string, width: number): string {
  const withoutExt = src.replace(/\.[a-z0-9]+$/i, "");
  return `/${OPTIMIZED_DIR}${withoutExt}-${width}.webp`;
}
