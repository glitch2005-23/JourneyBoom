import type { SiteSettings, TravelPackage } from "@/types/content";

const absolute = (siteUrl: string, path: string) => (path.startsWith("http") ? path : `${siteUrl}${path}`);

export function breadcrumbJsonLd(items: { label: string; href: string }[], siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: absolute(siteUrl, item.href),
    })),
  };
}

export function travelAgencyJsonLd(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: settings.siteName,
    slogan: settings.tagline,
    description: settings.description,
    url: settings.siteUrl,
    logo: absolute(settings.siteUrl, settings.logo.src),
    image: absolute(settings.siteUrl, settings.defaultOgImage),
    telephone: settings.contact.phone,
    email: settings.contact.email,
    address: settings.contact.address,
    sameAs: settings.social.map((s) => s.href),
  };
}

export function touristTripJsonLd(pkg: TravelPackage, settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: pkg.title,
    description: pkg.shortDescription,
    url: absolute(settings.siteUrl, pkg.href),
    image: absolute(settings.siteUrl, pkg.images.hero.src),
    touristType: pkg.badges,
    itinerary: {
      "@type": "ItemList",
      numberOfItems: pkg.itinerary.length,
      itemListElement: pkg.itinerary.map((day) => ({
        "@type": "ListItem",
        position: day.day,
        name: `Day ${day.day}: ${day.title}`,
      })),
    },
    offers: {
      "@type": "Offer",
      price: pkg.price.amount,
      priceCurrency: settings.currency,
      availability: "https://schema.org/InStock",
      url: absolute(settings.siteUrl, pkg.href),
    },
    provider: { "@type": "TravelAgency", name: settings.siteName, url: settings.siteUrl },
  };
}
