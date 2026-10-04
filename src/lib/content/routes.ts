import type { ContentTree } from "@/types/content";

/** Pages rendered from content/pages/<slug>.json by their own route folders in src/app. */
export const STATIC_PAGE_SLUGS = ["about", "contact", "terms", "privacy"] as const;
export type StaticPageSlug = (typeof STATIC_PAGE_SLUGS)[number];

/** Top-level names a category may not use, because the app or the static export already owns them. */
export const RESERVED_SLUGS: readonly string[] = [
  ...STATIC_PAGE_SLUGS,
  "images",
  "_img",
  "_next",
  "404",
  "sitemap.xml",
  "robots.txt",
  "icon.png",
  "apple-icon.png",
];

export const categoryHref = (category: string) => `/${category}/`;
export const destinationHref = (category: string, destination: string) => `/${category}/${destination}/`;
export const packageHref = (category: string, destination: string, pkg: string) =>
  `/${category}/${destination}/${pkg}/`;

/** "/goa#packages?x" → "/goa/" — the form used for route lookups. */
export function normalizePath(href: string): string {
  const pathOnly = href.split(/[?#]/)[0] ?? "/";
  if (pathOnly === "" || pathOnly === "/") return "/";
  return pathOnly.endsWith("/") ? pathOnly : `${pathOnly}/`;
}

export interface SiteRoute {
  path: string;
  kind: "home" | "page" | "category" | "destination" | "package";
}

/** Every route the static export will generate, derived purely from (published) content. */
export function listRoutes(tree: Pick<ContentTree, "categories" | "destinations" | "packages" | "pages">): SiteRoute[] {
  return [
    { path: "/", kind: "home" },
    ...tree.pages
      .filter((p) => (STATIC_PAGE_SLUGS as readonly string[]).includes(p.slug))
      .map((p) => ({ path: `/${p.slug}/`, kind: "page" as const })),
    ...tree.categories.map((c) => ({ path: c.href, kind: "category" as const })),
    ...tree.destinations.map((d) => ({ path: d.href, kind: "destination" as const })),
    ...tree.packages.map((p) => ({ path: p.href, kind: "package" as const })),
  ];
}
