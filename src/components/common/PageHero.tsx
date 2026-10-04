import type { ReactNode } from "react";
import type { ContentImage } from "@/types/content";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { SmartImage } from "./SmartImage";

interface PageHeroProps {
  image: ContentImage;
  breadcrumbs: Crumb[];
  siteUrl: string;
  eyebrow?: string;
  title: string;
  description?: string;
  /** Extra content under the description (chips, stats, actions). */
  children?: ReactNode;
}

/** Image-led hero shared by category, destination and static pages. */
export function PageHero({ image, breadcrumbs, siteUrl, eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="relative isolate flex min-h-[26rem] overflow-hidden bg-navy-deep sm:min-h-[30rem] lg:min-h-[34rem]">
      <SmartImage image={image} sizes="100vw" priority className="-z-20" />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-deep/95 via-navy-deep/65 to-navy-deep/35 md:via-navy-deep/45 md:to-navy-deep/20"
        aria-hidden="true"
      />
      <div className="container-site flex flex-col justify-end pt-24 pb-10 sm:pb-14">
        <Breadcrumbs items={breadcrumbs} siteUrl={siteUrl} className="mb-6" />
        {eyebrow && <p className="eyebrow text-amber">{eyebrow}</p>}
        <h1 className="heading-1 mt-3 max-w-3xl text-white">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">{description}</p>}
        {children && <div className="mt-7">{children}</div>}
      </div>
    </section>
  );
}
