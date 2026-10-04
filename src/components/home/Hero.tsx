import type { HomeSectionOf } from "@/types/content";
import { CTAButton } from "@/components/common/CTAButton";
import { SmartImage } from "@/components/common/SmartImage";

/** Full-bleed editorial hero. The image is the LCP element, so it loads with priority. */
export function Hero({ section }: { section: HomeSectionOf<"hero"> }) {
  return (
    <section id={section.id} className="relative isolate flex min-h-[calc(100svh-4.5rem)] flex-col overflow-hidden bg-navy-deep md:min-h-[min(88svh,56rem)]">
      <SmartImage image={section.image} sizes="100vw" priority className="-z-20 scale-[1.02]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-deep via-navy-deep/45 to-navy-deep/10" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-deep/60 via-transparent to-transparent" aria-hidden="true" />

      <div className="container-site flex flex-1 flex-col justify-end pt-28 pb-10 md:pb-14">
        <div className="max-w-3xl">
          {section.eyebrow && (
            <p className="mb-5 inline-flex items-center gap-3 font-display text-xs font-semibold tracking-[0.24em] text-amber uppercase">
              <span className="h-px w-8 bg-amber" aria-hidden="true" />
              {section.eyebrow}
            </p>
          )}
          <h1 className="heading-display text-white">{section.title}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl">{section.subtitle}</p>
          {section.ctas.length > 0 && (
            <div className="mt-9 flex flex-col gap-3 xs:flex-row">
              {section.ctas.map((cta) => (
                <CTAButton key={cta.href} href={cta.href} variant={cta.variant} className="h-14 px-8 text-[15px]">
                  {cta.label}
                </CTAButton>
              ))}
            </div>
          )}
        </div>

        {section.stats.length > 0 && (
          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/15 backdrop-blur-sm md:mt-16 md:grid-cols-4">
            {section.stats.map((stat) => (
              <div key={stat.label} className="bg-navy-deep/40 px-5 py-4 sm:px-6 sm:py-5">
                <dt className="text-[13px] text-white/70">{stat.label}</dt>
                <dd className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
