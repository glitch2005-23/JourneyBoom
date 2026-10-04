import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentProvider } from "@/content";
import { PageEnquiry } from "@/components/common/PageEnquiry";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { DestinationGallery } from "@/components/destination/DestinationGallery";
import { DestinationHero } from "@/components/destination/DestinationHero";
import { DestinationHighlights } from "@/components/destination/DestinationHighlights";
import { PackageGrid } from "@/components/destination/PackageGrid";
import { Reviews } from "@/components/home/Reviews";
import { buildMetadata } from "@/lib/seo/metadata";

type Params = { category: string; destination: string };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  const destinations = await getContentProvider().getAllDestinations();
  return destinations.map((d) => ({ category: d.categorySlug, destination: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category, destination: slug } = await params;
  const content = getContentProvider();
  const [settings, destination] = await Promise.all([content.getSiteSettings(), content.getDestination(category, slug)]);
  if (!destination) return {};
  return buildMetadata({ settings, seo: destination.seo, path: destination.href, image: destination.heroImage.src });
}

export default async function DestinationPage({ params }: { params: Promise<Params> }) {
  const { category: categorySlug, destination: slug } = await params;
  const content = getContentProvider();
  const [category, destination] = await Promise.all([
    content.getCategory(categorySlug),
    content.getDestination(categorySlug, slug),
  ]);
  if (!category || !destination) notFound();

  const [settings, packages, reviews, allDestinations] = await Promise.all([
    content.getSiteSettings(),
    content.getPackages(categorySlug, slug),
    content.getReviews({ destination: `${categorySlug}/${slug}` }),
    content.getAllDestinations(),
  ]);
  const money = { locale: settings.locale, currency: settings.currency };
  const facts = destination.quickFacts;

  return (
    <>
      <DestinationHero destination={destination} category={category} siteUrl={settings.siteUrl} money={money} />

      <section className="section">
        <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow">About {destination.title}</p>
            <h2 className="heading-2 mt-3">{destination.tagline}</h2>
            <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-ink/80">
              {destination.description.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </Reveal>
          {facts && (
            <Reveal delay={100} className="lg:col-span-5">
              <dl className="card divide-y divide-line p-2">
                {[
                  ["Best time to visit", facts.bestTime],
                  ["Ideal trip length", facts.idealDuration],
                  ["Language", facts.language],
                  ["Currency", facts.currency],
                ]
                  .filter((row): row is [string, string] => Boolean(row[1]))
                  .map(([label, value]) => (
                    <div key={label} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                      <dt className="text-sm text-muted">{label}</dt>
                      <dd className="font-display font-semibold text-navy sm:text-right">{value}</dd>
                    </div>
                  ))}
              </dl>
            </Reveal>
          )}
        </div>
        {destination.highlights.length > 0 && (
          <div className="container-site mt-14">
            <DestinationHighlights highlights={destination.highlights} />
          </div>
        )}
      </section>

      <section id="packages" className="section bg-white">
        <div className="container-site">
          <SectionHeading eyebrow="Holiday packages" title={`${destination.title} tour packages`} />
          <PackageGrid packages={packages} money={money} destinationTitle={destination.title} />
        </div>
      </section>

      <DestinationGallery title={`Moments from ${destination.title}`} images={destination.gallery} />

      <Reviews id="reviews" eyebrow="Traveller stories" title={`What travellers say about ${destination.title}`} reviews={reviews} locale={settings.locale} />

      <PageEnquiry settings={settings} destinations={allDestinations} destination={destination.title} title={`Plan your ${destination.title} holiday`} />
    </>
  );
}
