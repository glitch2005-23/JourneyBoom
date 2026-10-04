import type { ContentProvider } from "@/content/provider";
import type { ContentTree, TravelPackage } from "@/types/content";
import { applyImageFallback } from "./images";
import { loadContent, type LoadOptions } from "./load";
import { listRoutes } from "./routes";
import { ContentValidationError, formatIssues } from "./validation";
import { publish } from "./visibility";

export interface FileSystemProviderOptions extends LoadOptions {
  /**
   * When true (production builds), any content error throws so the build fails.
   * When false (development), errors are logged, invalid files are skipped and missing
   * images fall back to the placeholder — so authors can keep previewing while they fix things.
   */
  strict?: boolean;
  /** Replaces settings.siteUrl (canonical URLs, sitemap, OpenGraph), e.g. for a staging host. */
  siteUrlOverride?: string;
}

export class FileSystemContentProvider implements ContentProvider {
  private tree: Promise<ContentTree> | undefined;

  constructor(private readonly options: FileSystemProviderOptions) {}

  private content(): Promise<ContentTree> {
    this.tree ??= Promise.resolve().then(() => {
      const { strict = true, siteUrlOverride, ...loadOptions } = this.options;
      const { tree, issues } = loadContent(loadOptions);
      const hasErrors = issues.some((i) => i.severity === "error");
      if (!tree || (strict && hasErrors)) throw new ContentValidationError(issues);
      if (hasErrors) console.warn(`\n[content] Problems found:\n\n${formatIssues(issues)}\n`);
      if (siteUrlOverride) tree.settings.siteUrl = siteUrlOverride.replace(/\/$/, "");
      return publish(applyImageFallback(tree, loadOptions.publicDir, tree.settings.fallbackImage));
    });
    return this.tree;
  }

  async getSiteSettings() {
    return (await this.content()).settings;
  }

  async getNavigation() {
    return (await this.content()).navigation;
  }

  async getFooter() {
    return (await this.content()).footer;
  }

  async getHomepage() {
    return (await this.content()).homepage;
  }

  async getCategories() {
    return (await this.content()).categories;
  }

  async getCategory(slug: string) {
    return (await this.content()).categories.find((c) => c.slug === slug) ?? null;
  }

  async getAllDestinations() {
    return (await this.content()).destinations;
  }

  async getDestinations(categorySlug: string) {
    return (await this.content()).destinations.filter((d) => d.categorySlug === categorySlug);
  }

  async getDestination(categorySlug: string, destinationSlug: string) {
    return (
      (await this.content()).destinations.find(
        (d) => d.categorySlug === categorySlug && d.slug === destinationSlug,
      ) ?? null
    );
  }

  async getAllPackages() {
    return (await this.content()).packages;
  }

  async getPackages(categorySlug: string, destinationSlug: string) {
    return (await this.content()).packages.filter(
      (p) => p.categorySlug === categorySlug && p.destinationSlug === destinationSlug,
    );
  }

  async getPackage(categorySlug: string, destinationSlug: string, packageSlug: string) {
    return (
      (await this.content()).packages.find(
        (p) => p.categorySlug === categorySlug && p.destinationSlug === destinationSlug && p.slug === packageSlug,
      ) ?? null
    );
  }

  async getRelatedPackages(pkg: TravelPackage, limit = 3) {
    const others = (await this.content()).packages.filter((p) => p.href !== pkg.href);
    const sameDestination = others.filter(
      (p) => p.categorySlug === pkg.categorySlug && p.destinationSlug === pkg.destinationSlug,
    );
    const sameCategory = others.filter(
      (p) => p.categorySlug === pkg.categorySlug && p.destinationSlug !== pkg.destinationSlug,
    );
    const rest = others.filter((p) => p.categorySlug !== pkg.categorySlug);
    return [...sameDestination, ...sameCategory, ...rest].slice(0, limit);
  }

  async getReviews(filter: { destination?: string; package?: string } = {}) {
    const reviews = (await this.content()).reviews;
    if (filter.package) return reviews.filter((r) => r.package === filter.package);
    if (filter.destination) {
      const prefix = `${filter.destination}/`;
      return reviews.filter((r) => r.destination === filter.destination || r.package?.startsWith(prefix));
    }
    return reviews;
  }

  async getBanner(id: string) {
    return (await this.content()).banners.find((b) => b.id === id) ?? null;
  }

  async getGallery(id: string) {
    return (await this.content()).galleries.find((g) => g.id === id) ?? null;
  }

  async getPage(slug: string) {
    return (await this.content()).pages.find((p) => p.slug === slug) ?? null;
  }

  async getRoutes() {
    return listRoutes(await this.content());
  }
}
