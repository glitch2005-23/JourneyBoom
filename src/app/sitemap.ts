import type { MetadataRoute } from "next";
import { getContentProvider } from "@/content";

export const dynamic = "force-static";

const PRIORITY = { home: 1, category: 0.9, destination: 0.8, package: 0.7, page: 0.4 } as const;

/** sitemap.xml generated from the content structure — new content appears automatically. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = getContentProvider();
  const [settings, routes] = await Promise.all([content.getSiteSettings(), content.getRoutes()]);
  return routes.map((route) => ({
    url: `${settings.siteUrl}${route.path}`,
    changeFrequency: route.kind === "page" ? "yearly" : "weekly",
    priority: PRIORITY[route.kind],
  }));
}
