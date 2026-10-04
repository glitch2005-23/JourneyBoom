import { Clock, MapPin, Plane, Route } from "lucide-react";
import type { Category, TravelPackage } from "@/types/content";
import { destinationHref } from "@/lib/content/routes";
import { formatDurationLong, formatRoute } from "@/lib/utils/format";
import { Badge } from "@/components/common/Badge";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { SmartImage } from "@/components/common/SmartImage";

export function PackageHero({ pkg, category, siteUrl }: { pkg: TravelPackage; category: Category; siteUrl: string }) {
  const meta = [
    { icon: Clock, label: "Duration", value: formatDurationLong(pkg.duration) },
    { icon: MapPin, label: "Destination", value: pkg.destinationTitle },
    pkg.departureCity && { icon: Plane, label: "Starts from", value: pkg.departureCity },
    pkg.route.length > 0 && { icon: Route, label: "Route", value: formatRoute(pkg.route) },
  ].filter((m): m is { icon: typeof Clock; label: string; value: string } => Boolean(m));

  return (
    <section className="relative isolate flex min-h-[30rem] overflow-hidden bg-navy-deep sm:min-h-[34rem] lg:min-h-[38rem]">
      <SmartImage image={pkg.images.hero} sizes="100vw" priority className="-z-20" />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-deep via-navy-deep/70 to-navy-deep/35 md:via-navy-deep/50 md:to-navy-deep/10"
        aria-hidden="true"
      />
      <div className="container-site flex flex-col justify-end pt-24 pb-10 sm:pb-12">
        <Breadcrumbs
          siteUrl={siteUrl}
          className="mb-6"
          items={[
            { label: "Home", href: "/" },
            { label: category.title, href: category.href },
            { label: pkg.destinationTitle, href: destinationHref(pkg.categorySlug, pkg.destinationSlug) },
            { label: pkg.title, href: pkg.href },
          ]}
        />
        {pkg.badges.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {pkg.badges.map((badge, i) => (
              <Badge key={badge} tone={i === 0 ? "orange" : "white"}>
                {badge}
              </Badge>
            ))}
          </div>
        )}
        <h1 className="heading-1 max-w-4xl text-white">{pkg.title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">{pkg.shortDescription}</p>
        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/15 backdrop-blur-sm lg:flex">
          {meta.map(({ icon: IconComponent, label, value }) => (
            <div key={label} className="flex items-start gap-2.5 bg-navy-deep/45 px-4 py-3.5 sm:items-center sm:gap-3 sm:px-5 sm:py-4 lg:flex-1">
              <IconComponent className="mt-0.5 size-4 shrink-0 text-amber sm:mt-0 sm:size-5" aria-hidden="true" />
              <div className="min-w-0">
                <dt className="text-xs text-white/65">{label}</dt>
                <dd className="font-display text-sm font-semibold text-white">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
