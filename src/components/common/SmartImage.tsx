import Image from "next/image";
import type { ContentImage } from "@/types/content";
import { cn } from "@/lib/utils/cn";

interface SmartImageProps {
  image: ContentImage;
  /** Responsive sizes hint, e.g. "(min-width: 1024px) 33vw, 100vw". */
  sizes: string;
  /** Above-the-fold hero images: load eagerly with high priority. */
  priority?: boolean;
  className?: string;
  /** Override the alt text (pass "" for purely decorative usage). */
  alt?: string;
}

/**
 * Fills its (relatively positioned) parent. Pre-optimised WebP variants come from the
 * custom loader; the sand background shows while loading or if a remote image fails.
 */
export function SmartImage({ image, sizes, priority = false, className, alt }: SmartImageProps) {
  return (
    <Image
      src={image.src}
      alt={alt ?? image.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("bg-line/40 object-cover", className)}
      style={image.focal ? { objectPosition: image.focal } : undefined}
    />
  );
}
