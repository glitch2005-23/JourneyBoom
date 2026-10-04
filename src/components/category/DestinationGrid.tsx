import type { Destination } from "@/types/content";
import type { MoneyFormat } from "@/lib/utils/format";
import { DestinationCard } from "@/components/common/DestinationCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Reveal } from "@/components/common/Reveal";

export function DestinationGrid({ destinations, money }: { destinations: Destination[]; money: MoneyFormat }) {
  if (!destinations.length) {
    return (
      <EmptyState
        title="New destinations coming soon"
        text="We're curating fresh journeys here. Tell us where you'd like to go and we'll plan it for you."
      />
    );
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {destinations.map((destination, i) => (
        <Reveal key={destination.href} delay={(i % 3) * 90}>
          <DestinationCard destination={destination} money={money} headingLevel="h3" className="min-h-[24rem]" />
        </Reveal>
      ))}
    </div>
  );
}
