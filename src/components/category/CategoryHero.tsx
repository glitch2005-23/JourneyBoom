import type { Category } from "@/types/content";
import { PageHero } from "@/components/common/PageHero";

export function CategoryHero({
  category,
  siteUrl,
  destinationCount,
  packageCount,
}: {
  category: Category;
  siteUrl: string;
  destinationCount: number;
  packageCount: number;
}) {
  return (
    <PageHero
      image={category.heroImage}
      siteUrl={siteUrl}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: category.title, href: category.href },
      ]}
      eyebrow={category.tagline}
      title={category.title}
      description={category.description}
    >
      <dl className="flex flex-wrap gap-3 text-sm text-white">
        <div className="rounded-full border border-white/25 bg-white/10 px-4 py-2 backdrop-blur-sm">
          <dt className="sr-only">Destinations</dt>
          <dd>
            <strong className="font-display">{destinationCount}</strong> {destinationCount === 1 ? "destination" : "destinations"}
          </dd>
        </div>
        <div className="rounded-full border border-white/25 bg-white/10 px-4 py-2 backdrop-blur-sm">
          <dt className="sr-only">Packages</dt>
          <dd>
            <strong className="font-display">{packageCount}</strong> {packageCount === 1 ? "package" : "packages"}
          </dd>
        </div>
      </dl>
    </PageHero>
  );
}
