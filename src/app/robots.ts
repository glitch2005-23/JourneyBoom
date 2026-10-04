import type { MetadataRoute } from "next";
import { getContentProvider } from "@/content";

export const dynamic = "force-static";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getContentProvider().getSiteSettings();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${settings.siteUrl}/sitemap.xml`,
    host: settings.siteUrl,
  };
}
