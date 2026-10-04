import Link from "next/link";
import { ArrowUpRight, Check, Clock, MapPin } from "lucide-react";
import type { TravelPackage } from "@/types/content";
import { formatDurationShort, formatRoute, type MoneyFormat } from "@/lib/utils/format";
import { Badge } from "./Badge";
import { PriceDisplay } from "./PriceDisplay";
import { SmartImage } from "./SmartImage";

interface PackageCardProps {
  pkg: TravelPackage;
  money: MoneyFormat;
  /** Show the destination name above the title (useful outside destination pages). */
  showDestination?: boolean;
  headingLevel?: "h2" | "h3";
}

export function PackageCard({ pkg, money, showDestination = true, headingLevel: Heading = "h3" }: PackageCardProps) {
  const image = pkg.images.card ?? pkg.images.hero;
  return (
    <article className="group card relative flex h-full flex-col overflow-hidden transition duration-500 ease-(--ease-soft) hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden">
        <SmartImage
          image={image}
          alt=""
          sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
          className="zoom-img"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
          <div className="flex flex-wrap gap-2">
            {pkg.badges.map((badge, i) => (
              <Badge key={badge} tone={i === 0 ? "orange" : "white"}>
                {badge}
              </Badge>
            ))}
          </div>
        </div>
        <div className="absolute bottom-4 left-4">
          <Badge tone="white" className="normal-case tracking-normal">
            <Clock className="size-3.5 text-orange" aria-hidden="true" />
            {formatDurationShort(pkg.duration)}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {showDestination && (
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted uppercase">
            <MapPin className="size-3.5 text-orange" aria-hidden="true" />
            {pkg.destinationTitle}
          </p>
        )}
        <Heading className="heading-3">
          {/* Stretched link: the whole card is clickable, with one accessible link. */}
          <Link href={pkg.href} className="after:absolute after:inset-0 after:content-['']">
            {pkg.title}
          </Link>
        </Heading>
        {pkg.route.length > 0 && <p className="mt-1.5 text-sm text-muted">{formatRoute(pkg.route)}</p>}

        <ul className="mt-4 space-y-2">
          {pkg.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex gap-2 text-sm text-ink/80">
              <Check className="mt-0.5 size-4 shrink-0 text-palm" aria-hidden="true" />
              <span className="line-clamp-1">{h}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-line pt-5">
          <PriceDisplay
            amount={pkg.price.amount}
            originalAmount={pkg.price.originalAmount}
            basis={pkg.price.basis}
            money={money}
          />
          <span
            className="grid size-11 shrink-0 place-items-center rounded-full bg-navy text-white transition duration-300 group-hover:bg-orange group-hover:text-navy-deep"
            aria-hidden="true"
          >
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </div>
    </article>
  );
}
