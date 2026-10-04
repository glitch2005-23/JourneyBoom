import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category, Destination, HomeSectionOf } from "@/types/content";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SmartImage } from "@/components/common/SmartImage";

export function FeaturedCategories({
  section,
  categories,
  destinations,
}: {
  section: HomeSectionOf<"featuredCategories">;
  categories: Category[];
  destinations: Destination[];
}) {
  if (!categories.length) return null;
  return (
    <section id={section.id} className="section">
      <div className="container-site">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} />
        <div className="grid gap-5 md:grid-cols-2">
          {categories.map((category, i) => {
            const count = destinations.filter((d) => d.categorySlug === category.slug).length;
            return (
              <Reveal key={category.href} delay={i * 100}>
                <article className="group relative isolate flex min-h-[22rem] overflow-hidden rounded-(--radius-card) bg-navy shadow-card sm:min-h-[26rem]">
                  <SmartImage image={category.cardImage} alt="" sizes="(min-width: 768px) 50vw, 100vw" className="zoom-img -z-10" />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-deep/90 via-navy-deep/30 to-transparent" aria-hidden="true" />
                  <div className="mt-auto flex w-full items-end justify-between gap-6 p-6 sm:p-8">
                    <div>
                      <p className="eyebrow text-amber">{category.tagline}</p>
                      <h3 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                        <Link href={category.href} className="after:absolute after:inset-0 after:content-['']">
                          {category.title}
                        </Link>
                      </h3>
                      <p className="mt-2 text-sm text-white/80">
                        {count} {count === 1 ? "destination" : "destinations"}
                      </p>
                    </div>
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-navy transition duration-300 group-hover:bg-orange" aria-hidden="true">
                      <ArrowUpRight className="size-5" />
                    </span>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
