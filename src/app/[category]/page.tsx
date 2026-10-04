import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentProvider } from "@/content";
import { CategoryHero } from "@/components/category/CategoryHero";
import { DestinationGrid } from "@/components/category/DestinationGrid";
import { PackageCard } from "@/components/common/PackageCard";
import { PageEnquiry } from "@/components/common/PageEnquiry";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { buildMetadata } from "@/lib/seo/metadata";
import { selectFeatured } from "@/lib/content/visibility";

type Params = { category: string };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  const categories = await getContentProvider().getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category: slug } = await params;
  const content = getContentProvider();
  const [settings, category] = await Promise.all([content.getSiteSettings(), content.getCategory(slug)]);
  if (!category) return {};
  return buildMetadata({ settings, seo: category.seo, path: category.href, image: category.heroImage.src });
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { category: slug } = await params;
  const content = getContentProvider();
  const category = await content.getCategory(slug);
  if (!category) notFound();

  const [settings, destinations, allDestinations, allPackages] = await Promise.all([
    content.getSiteSettings(),
    content.getDestinations(slug),
    content.getAllDestinations(),
    content.getAllPackages(),
  ]);
  const money = { locale: settings.locale, currency: settings.currency };
  const packages = allPackages.filter((p) => p.categorySlug === slug);
  const featured = selectFeatured(packages).slice(0, 6);

  return (
    <>
      <CategoryHero category={category} siteUrl={settings.siteUrl} destinationCount={destinations.length} packageCount={packages.length} />

      <section className="section">
        <div className="container-site">
          <SectionHeading eyebrow={category.tagline} title={`${category.title} destinations`} />
          <DestinationGrid destinations={destinations} money={money} />
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section bg-white">
          <div className="container-site">
            <SectionHeading eyebrow="Handpicked" title={`Popular ${category.title.toLowerCase()} packages`} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((pkg, i) => (
                <Reveal key={pkg.href} delay={(i % 3) * 90} className="h-full">
                  <PackageCard pkg={pkg} money={money} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <PageEnquiry settings={settings} destinations={allDestinations} />
    </>
  );
}
