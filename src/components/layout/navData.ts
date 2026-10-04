import type { Category, Destination, Navigation, SiteSettings } from "@/types/content";
import { formatPrice } from "@/lib/utils/format";
import type { NavData } from "./types";

/** Shapes header data on the server so the client header receives only what it renders. */
export function buildNavData(
  settings: SiteSettings,
  navigation: Navigation,
  categories: Category[],
  destinations: Destination[],
): NavData {
  const money = { locale: settings.locale, currency: settings.currency };
  return {
    logo: settings.logo,
    homeLabel: "Home",
    menus: navigation.showCategoryMenus
      ? categories.map((category) => ({
          label: category.title,
          tagline: category.tagline,
          href: category.href,
          items: destinations
            .filter((d) => d.categorySlug === category.slug)
            .map((d) => ({
              label: d.title,
              href: d.href,
              region: d.region,
              image: d.cardImage,
              startingPrice: d.startingPrice === null ? null : formatPrice(d.startingPrice, money),
            })),
        }))
      : [],
    links: navigation.links,
    cta: navigation.cta,
    phone: { href: `tel:${settings.contact.phone}`, label: settings.contact.phoneDisplay },
    whatsapp: settings.contact.whatsapp ? `https://wa.me/${settings.contact.whatsapp}` : undefined,
  };
}
