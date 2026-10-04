import { MapPin } from "lucide-react";
import type { Category, Destination } from "@/types/content";
import { formatPrice, type MoneyFormat } from "@/lib/utils/format";
import { CTAButton } from "@/components/common/CTAButton";
import { PageHero } from "@/components/common/PageHero";

export function DestinationHero({
  destination,
  category,
  siteUrl,
  money,
}: {
  destination: Destination;
  category: Category;
  siteUrl: string;
  money: MoneyFormat;
}) {
  return (
    <PageHero
      image={destination.heroImage}
      siteUrl={siteUrl}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: category.title, href: category.href },
        { label: destination.title, href: destination.href },
      ]}
      eyebrow={destination.tagline}
      title={destination.title}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-white/85">
          <MapPin className="size-4 text-amber" aria-hidden="true" />
          {destination.region}
          {destination.startingPrice !== null && (
            <>
              <span className="mx-1 text-white/40" aria-hidden="true">
                |
              </span>
              Packages from <strong className="font-display text-amber">{formatPrice(destination.startingPrice, money)}</strong>
            </>
          )}
        </p>
        {destination.packageCount > 0 && (
          <CTAButton href="#packages" variant="accent">
            View {destination.packageCount} {destination.packageCount === 1 ? "package" : "packages"}
          </CTAButton>
        )}
      </div>
    </PageHero>
  );
}
