import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Destination } from "@/types/content";
import { formatPrice, type MoneyFormat } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { SmartImage } from "./SmartImage";

interface DestinationCardProps {
  destination: Destination;
  money: MoneyFormat;
  /** Visual size; "feature" is the tall lead card in editorial layouts. */
  variant?: "default" | "feature";
  sizes?: string;
  className?: string;
  headingLevel?: "h2" | "h3";
}

/** Full-bleed image card with the destination name and starting price overlaid. */
export function DestinationCard({
  destination,
  money,
  variant = "default",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  className,
  headingLevel: Heading = "h3",
}: DestinationCardProps) {
  const { packageCount, startingPrice } = destination;
  return (
    <article
      className={cn(
        "group relative isolate flex overflow-hidden rounded-(--radius-card) bg-navy shadow-card",
        variant === "feature" ? "min-h-[26rem] lg:min-h-full" : "min-h-[20rem]",
        className,
      )}
    >
      <SmartImage image={destination.cardImage} alt="" sizes={sizes} className="zoom-img -z-10" />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-deep/90 via-navy-deep/25 to-transparent"
        aria-hidden="true"
      />
      <div className="mt-auto w-full p-6 sm:p-7">
        <p className="text-xs font-semibold tracking-[0.18em] text-white/75 uppercase">{destination.region}</p>
        <Heading
          className={cn(
            "mt-1.5 font-bold text-white",
            variant === "feature" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-[1.75rem]",
          )}
        >
          <Link href={destination.href} className="after:absolute after:inset-0 after:content-['']">
            {destination.title}
          </Link>
        </Heading>
        {variant === "feature" && <p className="mt-2 max-w-md text-sm text-white/80">{destination.tagline}</p>}
        <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/20 pt-4 text-sm text-white">
          <span>
            {packageCount > 0 ? (
              <>
                {packageCount} {packageCount === 1 ? "package" : "packages"}
                {startingPrice !== null && (
                  <>
                    {" · from "}
                    <strong className="font-display font-semibold text-amber">{formatPrice(startingPrice, money)}</strong>
                  </>
                )}
              </>
            ) : (
              "Tailor-made trips"
            )}
          </span>
          <ArrowRight
            className="size-5 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </div>
      </div>
    </article>
  );
}
