import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentProvider } from "@/content";
import { JsonLd } from "@/components/common/JsonLd";
import { PackageCard } from "@/components/common/PackageCard";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { BookingCard } from "@/components/package/BookingCard";
import { EnquiryCTA } from "@/components/package/EnquiryCTA";
import { Exclusions } from "@/components/package/Exclusions";
import { Inclusions } from "@/components/package/Inclusions";
import { Itinerary } from "@/components/package/Itinerary";
import { KnowBeforeYouGo } from "@/components/package/KnowBeforeYouGo";
import { PackageGallery } from "@/components/package/PackageGallery";
import { PackageHero } from "@/components/package/PackageHero";
import { PackageHighlights } from "@/components/package/PackageHighlights";
import { PackageOverview } from "@/components/package/PackageOverview";
import { PackageSectionNav } from "@/components/package/PackageSectionNav";
import { StickyBookingBar } from "@/components/package/StickyBookingBar";
import { resolvePackageActions } from "@/components/package/packageActions";
import { touristTripJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

type Params = { category: string; destination: string; package: string };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  const packages = await getContentProvider().getAllPackages();
  return packages.map((p) => ({ category: p.categorySlug, destination: p.destinationSlug, package: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  // "package" is a reserved word, so it is renamed when destructuring.
  const { category, destination, package: packageSlug } = await params;
  const content = getContentProvider();
  const [settings, pkg] = await Promise.all([content.getSiteSettings(), content.getPackage(category, destination, packageSlug)]);
  if (!pkg) return {};
  return buildMetadata({ settings, seo: pkg.seo, path: pkg.href, image: pkg.images.hero.src });
}

export default async function PackagePage({ params }: { params: Promise<Params> }) {
  const { category: categorySlug, destination: destinationSlug, package: packageSlug } = await params;
  const content = getContentProvider();
  const [category, pkg] = await Promise.all([
    content.getCategory(categorySlug),
    content.getPackage(categorySlug, destinationSlug, packageSlug),
  ]);
  if (!category || !pkg) notFound();

  const [settings, related, destinations] = await Promise.all([
    content.getSiteSettings(),
    content.getRelatedPackages(pkg, 3),
    content.getAllDestinations(),
  ]);
  const money = { locale: settings.locale, currency: settings.currency };
  const actions = resolvePackageActions(pkg, settings.labels);
  const [primaryAction] = actions;

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "itinerary", label: "Itinerary" },
    { id: "inclusions", label: "Inclusions" },
    ...(pkg.images.gallery.length ? [{ id: "gallery", label: "Gallery" }] : []),
    { id: "enquire", label: "Enquire" },
  ];

  return (
    <div className="pb-20 lg:pb-0">
      <PackageHero pkg={pkg} category={category} siteUrl={settings.siteUrl} />
      <PackageSectionNav sections={sections} />

      <div className="container-site grid gap-12 py-12 md:py-16 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 space-y-14 md:space-y-16 lg:col-span-8">
          <PackageOverview pkg={pkg} />
          <PackageHighlights highlights={pkg.highlights} />
          <Itinerary days={pkg.itinerary} />
          <section id="inclusions" className="scroll-mt-36">
            <p className="eyebrow">The fine print</p>
            <h2 className="heading-2 mt-3">Inclusions &amp; exclusions</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <Inclusions items={pkg.inclusions} />
              <Exclusions items={pkg.exclusions} />
            </div>
          </section>
          <PackageGallery images={pkg.images.gallery} />
          <KnowBeforeYouGo items={pkg.knowBeforeYouGo} />
        </div>
        <div className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-36">
            <BookingCard pkg={pkg} actions={actions} settings={settings} money={money} />
          </div>
        </div>
      </div>

      <EnquiryCTA pkg={pkg} settings={settings} destinations={destinations} />

      {related.length > 0 && (
        <section className="section bg-white">
          <div className="container-site">
            <SectionHeading eyebrow="You may also like" title="Similar packages" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.href} delay={i * 90} className="h-full">
                  <PackageCard pkg={p} money={money} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {primaryAction && <StickyBookingBar pkg={pkg} action={primaryAction} money={money} />}
      <JsonLd data={touristTripJsonLd(pkg, settings)} />
    </div>
  );
}
