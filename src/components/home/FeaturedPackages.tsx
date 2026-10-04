import { ArrowRight } from "lucide-react";
import type { HomeSectionOf, TravelPackage } from "@/types/content";
import type { MoneyFormat } from "@/lib/utils/format";
import { CTAButton } from "@/components/common/CTAButton";
import { PackageCard } from "@/components/common/PackageCard";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";

export function FeaturedPackages({
  section,
  packages,
  money,
}: {
  section: HomeSectionOf<"featuredPackages">;
  packages: TravelPackage[];
  money: MoneyFormat;
}) {
  if (!packages.length) return null;
  return (
    <section id={section.id} className="section">
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, i) => (
            <Reveal key={pkg.href} delay={(i % 3) * 90} className="h-full">
              <PackageCard pkg={pkg} money={money} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
