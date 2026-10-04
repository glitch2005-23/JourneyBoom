import type { z } from "zod";
import type {
  bannerSchema,
  categorySchema,
  destinationSchema,
  footerSchema,
  gallerySchema,
  homeSectionSchema,
  homepageSchema,
  imageSchema,
  itineraryDaySchema,
  navigationSchema,
  packageActionSchema,
  packageSchema,
  pageBlockSchema,
  reviewSchema,
  siteSettingsSchema,
  staticPageSchema,
} from "@/content/schemas";

/** Domain types: schema output plus identity derived from the content's location. */

export type ContentImage = z.output<typeof imageSchema>;
export type ItineraryDay = z.output<typeof itineraryDaySchema>;
export type PackageAction = z.output<typeof packageActionSchema>;

export type Category = Omit<z.output<typeof categorySchema>, "slug"> & {
  slug: string;
  href: string;
};

export type Destination = Omit<z.output<typeof destinationSchema>, "slug"> & {
  slug: string;
  categorySlug: string;
  href: string;
  /** Computed from enabled packages. */
  packageCount: number;
  /** Lowest enabled package price, or null when there are no packages. */
  startingPrice: number | null;
};

export type TravelPackage = Omit<z.output<typeof packageSchema>, "slug"> & {
  slug: string;
  categorySlug: string;
  destinationSlug: string;
  destinationTitle: string;
  href: string;
};

export type Review = z.output<typeof reviewSchema> & { id: string };
export type Banner = z.output<typeof bannerSchema> & { id: string };
export type Gallery = z.output<typeof gallerySchema> & { id: string };
export type StaticPage = z.output<typeof staticPageSchema> & { slug: string };
export type PageBlock = z.output<typeof pageBlockSchema>;

export type HomePage = z.output<typeof homepageSchema>;
export type HomeSection = z.output<typeof homeSectionSchema>;
export type HomeSectionOf<T extends HomeSection["type"]> = Extract<HomeSection, { type: T }>;

export type Navigation = z.output<typeof navigationSchema>;
export type Footer = z.output<typeof footerSchema>;
export type SiteSettings = z.output<typeof siteSettingsSchema>;

/** Everything under content/, validated. Includes disabled items — see publish() for visitor-facing data. */
export interface ContentTree {
  settings: SiteSettings;
  navigation: Navigation;
  footer: Footer;
  homepage: HomePage;
  categories: Category[];
  destinations: Destination[];
  packages: TravelPackage[];
  reviews: Review[];
  banners: Banner[];
  galleries: Gallery[];
  pages: StaticPage[];
}
