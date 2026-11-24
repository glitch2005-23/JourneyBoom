import type { Metadata } from "next";
import type { SiteSettings } from "@/types/content";

interface PageSeo {
  title: string;
  description: string;
  ogImage?: string;
}

interface BuildMetadataInput {
  settings: SiteSettings;
  seo: PageSeo;
  /** Site-relative canonical path, e.g. "/domestic/kashmir/". */
  path: string;
  /** Fallback share image when seo.ogImage is not set (usually the page hero). */
  image?: string;
  /** Use the title as-is instead of applying the "| Site name" template. */
  absoluteTitle?: boolean;
}

/** Search results truncate titles around this length, so the brand suffix is dropped beyond it. */
const MAX_TITLE_LENGTH = 65;

/** Page metadata (title, description, canonical, OpenGraph, Twitter) built entirely from content. */
export function buildMetadata({ settings, seo, path, image, absoluteTitle = false }: BuildMetadataInput): Metadata {
  const shareImage = seo.ogImage ?? image ?? settings.defaultOgImage;
  const branded = `${seo.title} | ${settings.siteName}`;
  // Keep the "| Journey Boom" suffix only when the whole title still fits in search results.
  const useBrand = !absoluteTitle && branded.length <= MAX_TITLE_LENGTH;
  const fullTitle = useBrand ? branded : seo.title;
  return {
    title: { absolute: fullTitle },
    description: seo.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: settings.siteName,
      locale: settings.locale.replace("-", "_"),
      title: fullTitle,
      description: seo.description,
      images: [{ url: shareImage, alt: seo.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: seo.description,
      images: [shareImage],
    },
  };
}
