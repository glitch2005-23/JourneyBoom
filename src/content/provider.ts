import type { SiteRoute } from "@/lib/content/routes";
import type {
  Banner,
  Category,
  Destination,
  Footer,
  Gallery,
  HomePage,
  Navigation,
  Review,
  SiteSettings,
  StaticPage,
  TravelPackage,
} from "@/types/content";

/**
 * The only way the UI gets content. Implementations return visitor-facing data:
 * disabled items removed and lists sorted by displayOrder.
 *
 * Today: FileSystemContentProvider (JSON in content/). Tomorrow: an ApiContentProvider
 * or headless-CMS provider can implement this same interface with no UI changes.
 */
export interface ContentProvider {
  getSiteSettings(): Promise<SiteSettings>;
  getNavigation(): Promise<Navigation>;
  getFooter(): Promise<Footer>;
  getHomepage(): Promise<HomePage>;

  getCategories(): Promise<Category[]>;
  getCategory(slug: string): Promise<Category | null>;

  getAllDestinations(): Promise<Destination[]>;
  getDestinations(categorySlug: string): Promise<Destination[]>;
  getDestination(categorySlug: string, destinationSlug: string): Promise<Destination | null>;

  getAllPackages(): Promise<TravelPackage[]>;
  getPackages(categorySlug: string, destinationSlug: string): Promise<TravelPackage[]>;
  getPackage(categorySlug: string, destinationSlug: string, packageSlug: string): Promise<TravelPackage | null>;
  /** Other packages from the same destination first, then the same category. */
  getRelatedPackages(pkg: TravelPackage, limit?: number): Promise<TravelPackage[]>;

  /** All reviews, or those linked to a destination ("domestic/goa") or package ("domestic/goa/beach-escape"). */
  getReviews(filter?: { destination?: string; package?: string }): Promise<Review[]>;
  getBanner(id: string): Promise<Banner | null>;
  getGallery(id: string): Promise<Gallery | null>;
  getPage(slug: string): Promise<StaticPage | null>;

  /** Every route the site has — used for the sitemap. */
  getRoutes(): Promise<SiteRoute[]>;
}
