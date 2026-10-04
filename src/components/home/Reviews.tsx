import { Quote, Star } from "lucide-react";
import type { Review } from "@/types/content";
import { formatMonth } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { SectionHeading } from "@/components/common/SectionHeading";

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("flex gap-0.5", className)} role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={cn("size-4", i < rating ? "fill-amber text-amber" : "fill-line text-line")} aria-hidden="true" />
      ))}
    </span>
  );
}

/** Traveller reviews on a native scroll-snap rail (no carousel JS), with an aggregate rating. */
export function Reviews({
  id,
  eyebrow,
  title,
  subtitle,
  reviews,
  locale,
  tone = "white",
}: {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  reviews: Review[];
  locale: string;
  tone?: "white" | "sand";
}) {
  if (!reviews.length) return null;
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section id={id} className={cn("section overflow-hidden", tone === "white" ? "bg-white" : "bg-sand")}>
      <div className="container-site">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          action={
            <div className="flex items-center gap-4 rounded-2xl border border-line bg-sand/60 px-5 py-4">
              <span className="font-display text-4xl font-bold text-navy">{average.toFixed(1)}</span>
              <span>
                <Stars rating={Math.round(average)} />
                <span className="mt-1 block text-[13px] text-muted">
                  from {reviews.length} traveller {reviews.length === 1 ? "review" : "reviews"}
                </span>
              </span>
            </div>
          }
        />
        <ul className="rail -mx-4 scroll-px-4 px-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0" aria-label="Traveller reviews">
          {reviews.map((review) => (
            <li key={review.id} className="w-[85%] shrink-0 sm:w-[24rem]">
              <figure className="card flex h-full flex-col p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <Stars rating={review.rating} />
                  <Quote className="size-7 text-orange/30" aria-hidden="true" />
                </div>
                <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-ink/85">“{review.text}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-navy font-display text-sm font-semibold text-white" aria-hidden="true">
                    {review.name
                      .split(/\s+/)
                      .filter((word) => /^\p{L}/u.test(word))
                      .map((word) => word[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display font-semibold text-navy">{review.name}</span>
                    <span className="block truncate text-[13px] text-muted">
                      {review.location}
                      {review.trip ? ` · ${review.trip}` : ""} · {formatMonth(review.date, locale)}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
