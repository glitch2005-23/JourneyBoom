import type { HomeSectionOf } from "@/types/content";
import { Icon } from "@/components/common/Icon";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";

export function WhyUs({ section }: { section: HomeSectionOf<"whyUs"> }) {
  return (
    <section id={section.id} className="section bg-white">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} className="mb-0 md:mb-0 lg:sticky lg:top-32" />
        </div>
        <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-8">
          {section.items.map((item, i) => (
            <Reveal as="li" key={item.title} delay={(i % 2) * 100} className="group flex gap-5">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-orange/10 text-orange transition-colors duration-300 group-hover:bg-orange group-hover:text-navy-deep">
                <Icon name={item.icon} className="size-6" />
              </span>
              <div>
                <h3 className="heading-3">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
