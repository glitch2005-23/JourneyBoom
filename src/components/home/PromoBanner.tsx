import { ArrowRight } from "lucide-react";
import type { Banner } from "@/types/content";
import { CTAButton } from "@/components/common/CTAButton";
import { Reveal } from "@/components/common/Reveal";
import { SmartImage } from "@/components/common/SmartImage";

export function PromoBanner({ id, banner }: { id: string; banner: Banner }) {
  return (
    <section id={id} className="section pt-0 md:pt-0">
      <div className="container-site">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-navy-deep">
            <SmartImage image={banner.image} sizes="(min-width: 1280px) 1216px, 100vw" className="-z-20" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-deep/95 via-navy-deep/70 to-navy-deep/10" aria-hidden="true" />
            <div className="max-w-xl px-6 py-14 sm:px-12 sm:py-20 lg:px-16 lg:py-24">
              {banner.eyebrow && <p className="eyebrow text-amber">{banner.eyebrow}</p>}
              <h2 className="heading-2 mt-3 text-white">{banner.title}</h2>
              <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">{banner.text}</p>
              {banner.cta && (
                <CTAButton href={banner.cta.href} variant={banner.cta.variant} className="mt-8">
                  {banner.cta.label} <ArrowRight className="size-4" aria-hidden="true" />
                </CTAButton>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
