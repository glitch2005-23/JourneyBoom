import fs from "node:fs";
import path from "node:path";
import type { ContentImage } from "@/types/content";

function isImage(value: unknown): value is ContentImage {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as ContentImage).src === "string" &&
    typeof (value as ContentImage).alt === "string"
  );
}

/**
 * Replaces references to missing local images with the site's fallback image (keeping the
 * original alt text), so a missing file degrades gracefully instead of rendering a broken image.
 * Validation still reports the missing file; this only matters in development.
 */
export function applyImageFallback<T>(data: T, publicDir: string, fallback: ContentImage): T {
  const exists = new Map<string, boolean>();
  const isMissing = (src: string) => {
    if (!src.startsWith("/")) return false;
    if (!exists.has(src)) exists.set(src, fs.existsSync(path.join(publicDir, decodeURI(src))));
    return !exists.get(src);
  };

  const visit = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(visit);
    if (isImage(value) && isMissing(value.src)) return { ...value, src: fallback.src, focal: undefined };
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, visit(v)]));
    }
    return value;
  };
  return visit(data) as T;
}
