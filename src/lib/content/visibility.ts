import type { ContentTree, Destination, TravelPackage } from "@/types/content";

interface Orderable {
  displayOrder: number;
}

function labelOf(item: object): string {
  if ("title" in item && typeof item.title === "string") return item.title;
  if ("name" in item && typeof item.name === "string") return item.name;
  return "";
}

/** Ascending displayOrder, then alphabetical — stable and predictable for content authors. */
export function sortByDisplayOrder<T extends Orderable>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => a.displayOrder - b.displayOrder || labelOf(a).localeCompare(labelOf(b)));
}

export function onlyEnabled<T extends { enabled: boolean }>(items: readonly T[]): T[] {
  return items.filter((i) => i.enabled);
}

export function selectFeatured<T extends { featured: boolean }>(items: readonly T[]): T[] {
  return items.filter((i) => i.featured);
}

export function selectShowOnHome<T extends { showOnHome: boolean }>(items: readonly T[]): T[] {
  return items.filter((i) => i.showOnHome);
}

function withStats(destination: Destination, packages: readonly TravelPackage[]): Destination {
  const own = packages.filter(
    (p) => p.categorySlug === destination.categorySlug && p.destinationSlug === destination.slug,
  );
  return {
    ...destination,
    packageCount: own.length,
    startingPrice: own.length ? Math.min(...own.map((p) => p.price.amount)) : null,
  };
}

/**
 * The visitor-facing view of the content: disabled items removed (a disabled category hides
 * its destinations and packages; a disabled destination hides its packages), everything
 * sorted by displayOrder and destination stats computed from what remains.
 */
export function publish(tree: ContentTree): ContentTree {
  const categories = sortByDisplayOrder(onlyEnabled(tree.categories));
  const categoryRank = new Map(categories.map((c, i) => [c.slug, i]));

  // displayOrder applies within a parent; across the site, items follow their parent's order
  // (Array.prototype.sort is stable, so the inner order is preserved).
  const enabledDestinations = sortByDisplayOrder(
    onlyEnabled(tree.destinations).filter((d) => categoryRank.has(d.categorySlug)),
  ).sort((a, b) => categoryRank.get(a.categorySlug)! - categoryRank.get(b.categorySlug)!);

  const destinationRank = new Map(enabledDestinations.map((d, i) => [`${d.categorySlug}/${d.slug}`, i]));
  const rankOf = (p: TravelPackage) => destinationRank.get(`${p.categorySlug}/${p.destinationSlug}`)!;
  const packages = sortByDisplayOrder(
    onlyEnabled(tree.packages).filter((p) => destinationRank.has(`${p.categorySlug}/${p.destinationSlug}`)),
  ).sort((a, b) => rankOf(a) - rankOf(b));
  const destinations = enabledDestinations.map((d) => withStats(d, packages));

  return {
    ...tree,
    categories,
    destinations,
    packages,
    reviews: sortByDisplayOrder(onlyEnabled(tree.reviews)),
    banners: onlyEnabled(tree.banners),
    homepage: { ...tree.homepage, sections: tree.homepage.sections.filter((s) => s.enabled) },
  };
}
