import type { ContentProvider } from "@/content/provider";
import type { HomeSection } from "@/types/content";
import { selectFeatured, selectShowOnHome } from "@/lib/content/visibility";
import { buildEnquiryFormProps } from "@/components/enquiry/enquiryProps";
import { EnquirySection } from "./EnquirySection";
import { FeaturedCategories } from "./FeaturedCategories";
import { FeaturedDestinations } from "./FeaturedDestinations";
import { FeaturedPackages } from "./FeaturedPackages";
import { Gallery } from "./Gallery";
import { Hero } from "./Hero";
import { PromoBanner } from "./PromoBanner";
import { QuickLinks } from "./QuickLinks";
import { Reviews } from "./Reviews";
import { WhyUs } from "./WhyUs";

/** Renders one homepage section from its JSON configuration. */
export async function SectionRenderer({ section, content }: { section: HomeSection; content: ContentProvider }) {
  const settings = await content.getSiteSettings();
  const money = { locale: settings.locale, currency: settings.currency };

  switch (section.type) {
    case "hero":
      return <Hero section={section} />;

    case "quickLinks":
      return <QuickLinks section={section} />;

    case "featuredCategories":
      return (
        <FeaturedCategories section={section} categories={await content.getCategories()} destinations={await content.getAllDestinations()} />
      );

    case "featuredDestinations": {
      const all = await content.getAllDestinations();
      const picked = section.source === "featured" ? selectFeatured(all) : selectShowOnHome(all);
      return <FeaturedDestinations section={section} destinations={picked.slice(0, section.limit)} money={money} />;
    }

    case "featuredPackages": {
      const all = await content.getAllPackages();
      const picked = section.source === "featured" ? selectFeatured(all) : selectShowOnHome(all);
      return <FeaturedPackages section={section} packages={picked.slice(0, section.limit)} money={money} />;
    }

    case "promoBanner": {
      const banner = await content.getBanner(section.bannerId);
      return banner ? <PromoBanner id={section.id} banner={banner} /> : null;
    }

    case "whyUs":
      return <WhyUs section={section} />;

    case "gallery": {
      const gallery = await content.getGallery(section.galleryId);
      return gallery ? (
        <Gallery id={section.id} eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} gallery={gallery} />
      ) : null;
    }

    case "reviews": {
      const reviews = (await content.getReviews()).slice(0, section.limit);
      return (
        <Reviews
          id={section.id}
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          reviews={reviews}
          locale={settings.locale}
        />
      );
    }

    case "enquiry":
      return (
        <EnquirySection
          id={section.id}
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          image={section.image}
          points={section.points}
          form={buildEnquiryFormProps(settings, await content.getAllDestinations())}
        />
      );
  }
}
