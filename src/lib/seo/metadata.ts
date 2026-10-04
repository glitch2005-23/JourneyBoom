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
  /** Site-relative canonical path, e.g. "/domestic/srinagar/". */
  path: string;
  /** Fallback share image when seo.ogImage is not set (usually the page hero). */
  image?: string;
  /** Use the title as-is instead of applying the "| Site name" template. */
  absoluteTitle?: boolean;
}

/** Page metadata (title, description, canonical, OpenGraph, Twitter) built entirely from content. */
export function buildMetadata({ settings, seo, path, image, absoluteTitle = false }: BuildMetadataInput): Metadata {
  const shareImage = seo.ogImage ?? image ?? settings.defaultOgImage;
  const fullTitle = absoluteTitle ? seo.title : `${seo.title} | ${settings.siteName}`;
  return {
    title: absoluteTitle ? { absolute: seo.title } : seo.title,
    description: seo.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: settings.siteName,
      locale: settings.locale.replace("-", "_"),
      title: fullTitle,
      description: seo.description,
      images: [{ url: shareImage, width: 1200, height: 630, alt: seo.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: seo.description,
      images: [shareImage],
    },
  };
}
