import { ArrowRight } from "lucide-react";
import type { Destination, HomeSectionOf } from "@/types/content";
import type { MoneyFormat } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { CTAButton } from "@/components/common/CTAButton";
import { DestinationCard } from "@/components/common/DestinationCard";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";

/** Editorial bento: a tall lead destination beside smaller cards. */
export function FeaturedDestinations({
  section,
  destinations,
  money,
}: {
  section: HomeSectionOf<"featuredDestinations">;
  destinations: Destination[];
  money: MoneyFormat;
}) {
  if (!destinations.length) return null;
  const [lead, ...rest] = destinations;
  const restSpan = rest.length <= 2 ? "lg:col-span-6" : "lg:col-span-3";
  return (
    <section id={section.id} className="section bg-white">
      <div className="container-site">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          action={
            section.cta && (
              <CTAButton href={section.cta.href} variant="outline">
                {section.cta.label} <ArrowRight className="size-4" aria-hidden="true" />
              </CTAButton>
            )
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:auto-rows-[minmax(17rem,auto)] lg:grid-cols-12">
          {lead && (
            <Reveal className={cn("sm:col-span-2 lg:col-span-6", rest.length > 0 && "lg:row-span-2")}>
              <DestinationCard
                destination={lead}
                money={money}
                variant="feature"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-full"
              />
            </Reveal>
          )}
          {rest.map((destination, i) => (
            <Reveal key={destination.href} delay={(i + 1) * 90} className={restSpan}>
              <DestinationCard
                destination={destination}
                money={money}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="h-full"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
