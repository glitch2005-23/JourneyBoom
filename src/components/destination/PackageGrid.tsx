import type { TravelPackage } from "@/types/content";
import type { MoneyFormat } from "@/lib/utils/format";
import { CTAButton } from "@/components/common/CTAButton";
import { EmptyState } from "@/components/common/EmptyState";
import { PackageCard } from "@/components/common/PackageCard";
import { Reveal } from "@/components/common/Reveal";

export function PackageGrid({
  packages,
  money,
  destinationTitle,
}: {
  packages: TravelPackage[];
  money: MoneyFormat;
  destinationTitle: string;
}) {
  if (!packages.length) {
    return (
      <EmptyState
        title={`Tailor-made ${destinationTitle} trips`}
        text="Our ready-made packages for this destination are being refreshed. Share your dates and we'll design an itinerary just for you."
        action={
          <CTAButton href="#enquire" variant="accent">
            Plan my trip
          </CTAButton>
        }
      />
    );
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg, i) => (
        <Reveal key={pkg.href} delay={(i % 3) * 90} className="h-full">
          <PackageCard pkg={pkg} money={money} showDestination={false} />
        </Reveal>
      ))}
    </div>
  );
}
