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

/** Site-wide structured data: the business (TravelAgency) and the website it publishes. */
export function travelAgencyJsonLd(settings: SiteSettings) {
  const { contact } = settings;
  const postal = contact.postalAddress;
  const agencyId = `${settings.siteUrl}/#organization`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": agencyId,
        name: settings.siteName,
        slogan: settings.tagline,
        description: settings.description,
        url: settings.siteUrl,
        logo: absolute(settings.siteUrl, settings.footerLogo.src),
        image: absolute(settings.siteUrl, settings.defaultOgImage),
        telephone: contact.phone,
        email: contact.email,
        address: postal
          ? {
              "@type": "PostalAddress",
              streetAddress: postal.streetAddress,
              addressLocality: postal.locality,
              ...(postal.region && { addressRegion: postal.region }),
              postalCode: postal.postalCode,
              addressCountry: postal.country,
            }
          : contact.address,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: contact.phone,
          email: contact.email,
          contactType: "customer service",
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"],
        },
        currenciesAccepted: settings.currency,
        sameAs: settings.social.map((s) => s.href),
      },
      {
        "@type": "WebSite",
        "@id": `${settings.siteUrl}/#website`,
        url: settings.siteUrl,
        name: settings.siteName,
        inLanguage: settings.locale,
        publisher: { "@id": agencyId },
      },
    ],
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
    ...(pkg.price && {
      offers: {
        "@type": "Offer",
        price: pkg.price.amount,
        priceCurrency: settings.currency,
        availability: "https://schema.org/InStock",
        url: absolute(settings.siteUrl, pkg.href),
      },
    }),
    provider: { "@type": "TravelAgency", name: settings.siteName, url: settings.siteUrl },
  };
}
